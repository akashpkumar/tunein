import { useState, useEffect, useCallback, useRef } from 'react';
import { createAudioAnalyzer, findClosestString, getCentsOff } from '../utils/pitchDetection';
import { INSTRUMENTS, DEFAULT_INSTRUMENT, DEFAULT_TUNINGS } from '../utils/instruments';
import TuningSelector from './TuningSelector';
import Waveform from './Waveform';
import './Tuner.css';

const NUM_BARS_DESKTOP = 51;
const NUM_BARS_MOBILE = 31;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
const MAX_CENTS = 50;

function getBarColor(index, centerIndex) {
  const distanceFromCenter = Math.abs(index - centerIndex);
  const maxDistance = centerIndex;

  // Normalize to 0-1 range
  const t = Math.min(distanceFromCenter / maxDistance, 1);

  // Faster falloff: use cubic for quicker transition to orange/red
  // Green (120) -> Yellow (60) -> Orange (30) -> Red (0)
  const hue = 120 * Math.pow(1 - t, 2.5);

  // Saturation and lightness
  const saturation = 70 + t * 20;
  const lightness = 50;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}


const DEBOUNCE_THRESHOLD = 0.3; // Minimum change to update position

function TuningIndicator({ cents, analyzerRef }) {
  const isMobile = useIsMobile();
  const numBars = isMobile ? NUM_BARS_MOBILE : NUM_BARS_DESKTOP;
  const centerIndex = Math.floor(numBars / 2);

  const clampedCents = Math.max(-MAX_CENTS, Math.min(MAX_CENTS, cents || 0));
  const smoothedOffsetRef = useRef(0);
  const lastUpdateRef = useRef(0);

  // Adjust glow range based on bar count
  const glowRange = Math.floor(centerIndex * 0.8);

  // Calculate target offset
  const targetOffset = (clampedCents / MAX_CENTS) * glowRange;

  // Debounce: only update if change is significant
  const diff = Math.abs(targetOffset - lastUpdateRef.current);
  if (diff > DEBOUNCE_THRESHOLD) {
    lastUpdateRef.current = targetOffset;
  }
  const debouncedTarget = lastUpdateRef.current;

  // Smooth the offset (lerp toward target)
  smoothedOffsetRef.current += (debouncedTarget - smoothedOffsetRef.current) * 0.15;

  // Keep fractional position for smooth highlighting
  const fractionalOffset = smoothedOffsetRef.current;
  const activePosition = centerIndex + fractionalOffset;

  return (
    <div className="tuning-indicator">
      <div className="bars-container">
        <Waveform analyzerRef={analyzerRef} />
        {Array.from({ length: numBars }, (_, i) => {
          // Fractional distance for smooth blending
          const distance = Math.abs(i - activePosition);
          const color = getBarColor(i, centerIndex);

          // Smooth opacity falloff based on fractional distance
          let opacity = 0;
          if (distance <= 4) {
            // Smooth curve: 1.0 at center, fading to 0 at distance 4
            opacity = Math.max(0, 1 - (distance / 4) * 0.9);
          }

          return (
            <div
              key={i}
              className={`bar ${i === centerIndex ? 'center' : ''}`}
              style={opacity > 0 ? { backgroundColor: color, opacity } : undefined}
            />
          );
        })}
      </div>
      <div className="labels">
        <span className="label flat">FLAT</span>
        <span className="label in-tune">IN TUNE</span>
        <span className="label sharp">SHARP</span>
      </div>
    </div>
  );
}

function AnimatedNote({ note, octave }) {
  const prevRef = useRef({ note: null, octave: null });
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (note && prevRef.current.note && note !== prevRef.current.note) {
      setAnimating(true);
      const timeout = setTimeout(() => setAnimating(false), 200);
      return () => clearTimeout(timeout);
    }
    prevRef.current = { note, octave };
  }, [note, octave]);

  // Update ref when note changes (after animation trigger)
  useEffect(() => {
    prevRef.current = { note, octave };
  }, [note, octave]);

  if (!note) {
    return <span className="note-text">--</span>;
  }

  return (
    <span key={`${note}${octave}`} className={`note-text ${animating ? '' : 'note-enter'}`}>
      {note}<sub>{octave}</sub>
    </span>
  );
}

const SMOOTHING_FACTOR = 0.15; // Lower = smoother but more lag (0.1-0.5 range)
const NOTE_HOLD_FRAMES = 12; // Frames to hold a note before switching

export default function Tuner() {
  const [frequency, setFrequency] = useState(null);
  const [closestString, setClosestString] = useState(null);
  const [cents, setCents] = useState(0);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [currentInstrument, setCurrentInstrument] = useState(DEFAULT_INSTRUMENT);
  const [currentTuning, setCurrentTuning] = useState(DEFAULT_TUNINGS[DEFAULT_INSTRUMENT]);

  const analyzerRef = useRef(null);
  const animationRef = useRef(null);
  const smoothedFreqRef = useRef(null);
  const noteHoldRef = useRef({ note: null, count: 0 });
  const freqHistoryRef = useRef([]); // For median filtering
  const instrumentRef = useRef(currentInstrument);
  const tuningRef = useRef(currentTuning);

  // Get current instrument and tuning data
  const instrument = INSTRUMENTS[currentInstrument];
  const tuning = instrument.tunings[currentTuning];

  // Keep refs in sync
  useEffect(() => {
    instrumentRef.current = currentInstrument;
    tuningRef.current = currentTuning;
    // Reset note detection when instrument/tuning changes
    setClosestString(null);
    noteHoldRef.current = { note: null, count: 0 };

    // Update analyzer detection settings if it exists
    if (analyzerRef.current) {
      analyzerRef.current.updateDetection(instrument.detection);
    }
  }, [currentInstrument, currentTuning, instrument.detection]);

  // Handle instrument change - also reset tuning to default for that instrument
  const handleInstrumentChange = useCallback((newInstrument) => {
    setCurrentInstrument(newInstrument);
    setCurrentTuning(DEFAULT_TUNINGS[newInstrument]);
  }, []);

  const startListening = useCallback(async () => {
    try {
      setError(null);
      const detection = INSTRUMENTS[instrumentRef.current].detection;
      const analyzer = await createAudioAnalyzer(detection);
      analyzerRef.current = analyzer;
      setIsReady(true);

      const updatePitch = () => {
        if (!analyzerRef.current) return;

        const freq = analyzerRef.current.getFrequency();
        const currentInst = INSTRUMENTS[instrumentRef.current];
        const currentTuningData = currentInst.tunings[tuningRef.current];

        if (freq) {
          // Median filter: keep last 5 readings, use median
          freqHistoryRef.current.push(freq);
          if (freqHistoryRef.current.length > 5) {
            freqHistoryRef.current.shift();
          }
          const sorted = [...freqHistoryRef.current].sort((a, b) => a - b);
          const medianFreq = sorted[Math.floor(sorted.length / 2)];

          // Exponential smoothing on top of median
          if (smoothedFreqRef.current === null) {
            smoothedFreqRef.current = medianFreq;
          } else {
            smoothedFreqRef.current =
              SMOOTHING_FACTOR * medianFreq + (1 - SMOOTHING_FACTOR) * smoothedFreqRef.current;
          }

          const smoothedFreq = smoothedFreqRef.current;
          setFrequency(smoothedFreq);

          const tuningStrings = currentTuningData.strings;
          const string = findClosestString(smoothedFreq, tuningStrings, currentInst.detection);

          // Hysteresis: only switch notes after consistent detection
          if (string) {
            const noteKey = `${string.note}${string.octave}`;

            // If we have a current string, check if we should stick with it
            // (prefer current note if new note isn't significantly better)
            if (closestString) {
              const currentCents = Math.abs(getCentsOff(smoothedFreq, closestString.frequency));
              const newCents = Math.abs(getCentsOff(smoothedFreq, string.frequency));

              // Only consider switching if new note is notably closer (within 30 cents)
              // or if current note is way off (> 40 cents)
              if (currentCents < 40 && newCents > currentCents - 10) {
                // Stick with current note
                setCents(getCentsOff(smoothedFreq, closestString.frequency));
                noteHoldRef.current = { note: `${closestString.note}${closestString.octave}`, count: 0 };
                animationRef.current = requestAnimationFrame(updatePitch);
                return;
              }
            }

            if (noteKey === noteHoldRef.current.note) {
              noteHoldRef.current.count++;
            } else {
              noteHoldRef.current = { note: noteKey, count: 1 };
            }

            if (noteHoldRef.current.count >= NOTE_HOLD_FRAMES || closestString === null) {
              setClosestString(string);
            }

            setCents(getCentsOff(smoothedFreq, string.frequency));
          }
        }

        animationRef.current = requestAnimationFrame(updatePitch);
      };

      updatePitch();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please grant permission and refresh.');
    }
  }, [closestString]);

  useEffect(() => {
    startListening();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (analyzerRef.current) {
        analyzerRef.current.cleanup();
      }
    };
  }, [startListening]);

  if (error) {
    return (
      <div className="tuner">
        <div className="tuner-content">
          <p className="error">{error}</p>
        </div>
      </div>
    );
  }

  const isInTune = Math.abs(cents) < 5;

  return (
    <div className="tuner">
      <div className="tuner-content">
        <TuningSelector
          currentInstrument={currentInstrument}
          currentTuning={currentTuning}
          onSelectInstrument={handleInstrumentChange}
          onSelectTuning={setCurrentTuning}
        />

        <div className="note-section">
          <div className={`note-display ${isInTune ? 'in-tune' : ''}`}>
            <AnimatedNote
              note={closestString?.note}
              octave={closestString?.octave}
              isInTune={isInTune}
            />
            {closestString && !isInTune && (
              <span className={`tune-arrow ${cents < 0 ? 'up' : 'down'}`}>
                {cents < 0 ? '↑' : '↓'}
              </span>
            )}
          </div>
          <div className="string-label">
            {closestString ? closestString.label : 'Play a string'}
          </div>
        </div>

        <TuningIndicator cents={cents} analyzerRef={analyzerRef} />
      </div>
    </div>
  );
}
