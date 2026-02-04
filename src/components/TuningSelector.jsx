import { useState } from 'react';
import { TUNINGS, getTuningNotesShort } from '../utils/tunings';
import './TuningSelector.css';

export default function TuningSelector({ currentTuning, onSelectTuning }) {
  const [isOpen, setIsOpen] = useState(false);

  const tuning = TUNINGS[currentTuning];
  const notesDisplay = getTuningNotesShort(tuning);

  return (
    <>
      <button className="tuning-pill" onClick={() => setIsOpen(true)}>
        <span className="tuning-name">{tuning.name}</span>
        <span className="tuning-notes">{notesDisplay}</span>
      </button>

      <div
        className={`tuning-modal-overlay ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`tuning-modal ${isOpen ? 'open' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>Select Tuning</h2>
          <div className="tuning-list">
            {Object.entries(TUNINGS).map(([key, t]) => (
              <button
                key={key}
                className={`tuning-option ${key === currentTuning ? 'active' : ''}`}
                onClick={() => {
                  onSelectTuning(key);
                  setIsOpen(false);
                }}
              >
                <span className="tuning-option-name">{t.name}</span>
                <span className="tuning-option-notes">
                  {t.strings.map(s => s.note).join(' ')}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
