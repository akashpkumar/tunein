import { useState, useEffect, useCallback, useRef } from 'react';
import { createAudioAnalyzer, findClosestString, getCentsOff } from '../utils/pitchDetection';
import Waveform from './Waveform';
import './Tuner.css';

const NUM_BARS = 41;
const CENTER_INDEX = Math.floor(NUM_BARS / 2);
const MAX_CENTS = 50;

function getBarColor(index) {
  const distanceFromCenter = Math.abs(index - CENTER_INDEX);
  const maxDistance = CENTER_INDEX;

  // Normalize to 0-1 range
  const t = Math.min(distanceFromCenter / maxDistance, 1);

  // Interpolate hue: green (142) -> yellow (60) -> orange (30) -> red (0)
  // Using a curve that spends more time in green/yellow
  let hue;
  if (t < 0.3) {
    // Green to yellow-green
    hue = 142 - (t / 0.3) * 50; // 142 -> 92
  } else if (t < 0.6) {
    // Yellow-green to yellow/orange
    hue = 92 - ((t - 0.3) / 0.3) * 42; // 92 -> 50
  } else {
    // Orange to red
    hue = 50 - ((t - 0.6) / 0.4) * 50; // 50 -> 0
  }

  // Saturation and lightness
  const saturation = 80 + t * 10; // 80% -> 90%
  const lightness = 55 - t * 10; // 55% -> 45%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function TuningIndicator({ cents, analyzerRef }) {
  const clampedCents = Math.max(-MAX_CENTS, Math.min(MAX_CENTS, cents || 0));
  const activeIndex = Math.round(CENTER_INDEX + (clampedCents / MAX_CENTS) * CENTER_INDEX);
  const color = getBarColor(activeIndex);

  // Calculate offset from center bar (in bar units including gap)
  const offsetFromCenter = activeIndex - CENTER_INDEX;
  const isOnCenter = activeIndex === CENTER_INDEX;

  return (
    <div className="tuning-indicator">
      <div className="bars-container">
        <Waveform analyzerRef={analyzerRef} />
        {Array.from({ length: NUM_BARS }, (_, i) => (
          <div
            key={i}
            className={`bar ${i === CENTER_INDEX ? 'center' : ''}`}
          />
        ))}
        <div
          className={`bar-glow ${isOnCenter ? 'center' : ''}`}
          style={{
            '--offset': offsetFromCenter,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
          }}
        />
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

function getTuningHint(cents) {
  if (Math.abs(cents) < 5) {
    return { text: 'In tune', className: 'in-tune' };
  } else if (cents < -25) {
    return { text: 'Tune up ↑', className: 'tune-up' };
  } else if (cents < 0) {
    return { text: 'Tune up slightly', className: 'tune-up' };
  } else if (cents > 25) {
    return { text: 'Tune down ↓', className: 'tune-down' };
  } else {
    return { text: 'Tune down slightly', className: 'tune-down' };
  }
}

const SMOOTHING_FACTOR = 0.3; // Lower = smoother but more lag (0.1-0.5 range)
const NOTE_HOLD_FRAMES = 5; // Frames to hold a note before switching

export default function Tuner() {
  const [frequency, setFrequency] = useState(null);
  const [closestString, setClosestString] = useState(null);
  const [cents, setCents] = useState(0);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const analyzerRef = useRef(null);
  const animationRef = useRef(null);
  const smoothedFreqRef = useRef(null);
  const noteHoldRef = useRef({ note: null, count: 0 });

  const startListening = useCallback(async () => {
    try {
      setError(null);
      const analyzer = await createAudioAnalyzer();
      analyzerRef.current = analyzer;
      setIsReady(true);

      const updatePitch = () => {
        if (!analyzerRef.current) return;

        const freq = analyzerRef.current.getFrequency();

        if (freq) {
          // Exponential smoothing for frequency
          if (smoothedFreqRef.current === null) {
            smoothedFreqRef.current = freq;
          } else {
            smoothedFreqRef.current =
              SMOOTHING_FACTOR * freq + (1 - SMOOTHING_FACTOR) * smoothedFreqRef.current;
          }

          const smoothedFreq = smoothedFreqRef.current;
          setFrequency(smoothedFreq);

          const string = findClosestString(smoothedFreq);

          // Hysteresis: only switch notes after consistent detection
          if (string) {
            const noteKey = `${string.note}${string.octave}`;
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

  const hint = getTuningHint(cents);
  const isInTune = Math.abs(cents) < 5;

  return (
    <div className="tuner">
      <div className="tuner-content">
        <div className="note-section">
          <div className={`note-display ${isInTune ? 'in-tune' : ''}`}>
            <AnimatedNote
              note={closestString?.note}
              octave={closestString?.octave}
              isInTune={isInTune}
            />
          </div>
          <div className="string-label">
            {closestString ? closestString.label : 'Play a string'}
          </div>
        </div>

        <TuningIndicator cents={cents} analyzerRef={analyzerRef} />

        <div className={`tuning-hint ${hint.className}`}>
          {closestString ? hint.text : ''}
        </div>
      </div>
    </div>
  );
}
