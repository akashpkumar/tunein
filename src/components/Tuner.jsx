import { useState, useEffect, useCallback, useRef } from 'react';
import { createAudioAnalyzer, findClosestString, getCentsOff } from '../utils/pitchDetection';
import './Tuner.css';

const NUM_BARS = 31;
const CENTER_INDEX = Math.floor(NUM_BARS / 2);
const MAX_CENTS = 50;

function getBarColor(index) {
  const distanceFromCenter = Math.abs(index - CENTER_INDEX);

  if (distanceFromCenter === 0) {
    return '#22c55e';
  } else if (distanceFromCenter <= 3) {
    return '#4ade80';
  } else if (distanceFromCenter <= 6) {
    return '#a3e635';
  } else if (distanceFromCenter <= 9) {
    return '#facc15';
  } else if (distanceFromCenter <= 12) {
    return '#fb923c';
  } else {
    return '#ef4444';
  }
}

function TuningIndicator({ cents, frequency }) {
  const clampedCents = Math.max(-MAX_CENTS, Math.min(MAX_CENTS, cents || 0));
  const activeIndex = Math.round(CENTER_INDEX + (clampedCents / MAX_CENTS) * CENTER_INDEX);

  return (
    <div className="tuning-indicator">
      <div className="bars-container">
        {Array.from({ length: NUM_BARS }, (_, i) => {
          const isActive = i === activeIndex;
          const color = getBarColor(i);

          return (
            <div
              key={i}
              className={`bar ${isActive ? 'active' : ''} ${i === CENTER_INDEX ? 'center' : ''}`}
              style={{
                backgroundColor: isActive ? color : 'rgba(255, 255, 255, 0.15)',
                boxShadow: isActive ? `0 0 10px ${color}, 0 0 20px ${color}` : 'none',
              }}
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

export default function Tuner() {
  const [frequency, setFrequency] = useState(null);
  const [closestString, setClosestString] = useState(null);
  const [cents, setCents] = useState(0);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const analyzerRef = useRef(null);
  const animationRef = useRef(null);

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
          setFrequency(freq);
          const string = findClosestString(freq);
          setClosestString(string);
          if (string) {
            setCents(getCentsOff(freq, string.frequency));
          }
        }

        animationRef.current = requestAnimationFrame(updatePitch);
      };

      updatePitch();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please grant permission and refresh.');
    }
  }, []);

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
            {closestString ? (
              <>
                {closestString.note}<sub>{closestString.octave}</sub>
              </>
            ) : '--'}
          </div>
          <div className="string-label">
            {closestString ? closestString.label : 'Play a string'}
          </div>
        </div>

        <TuningIndicator cents={cents} frequency={frequency} />

        <div className={`tuning-hint ${hint.className}`}>
          {closestString ? hint.text : ''}
        </div>
      </div>
    </div>
  );
}
