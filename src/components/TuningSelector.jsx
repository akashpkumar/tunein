import { useState } from 'react';
import { INSTRUMENTS, getInstrumentList, getTuningsForInstrument } from '../utils/instruments';
import './TuningSelector.css';

export default function TuningSelector({
  currentInstrument,
  currentTuning,
  onSelectInstrument,
  onSelectTuning
}) {
  const [instrumentModalOpen, setInstrumentModalOpen] = useState(false);
  const [tuningModalOpen, setTuningModalOpen] = useState(false);

  const instrument = INSTRUMENTS[currentInstrument];
  const tuning = instrument.tunings[currentTuning];
  const tuningNotes = tuning.strings.map(s => s.note).join(' ');
  const instruments = getInstrumentList();
  const tunings = getTuningsForInstrument(currentInstrument);

  return (
    <>
      <div className="selector-pill">
        <button
          className="pill-section instrument-section"
          onClick={() => setInstrumentModalOpen(true)}
        >
          <span className="pill-label">{instrument.name}</span>
        </button>
        <div className="pill-divider" />
        <button
          className="pill-section tuning-section"
          onClick={() => setTuningModalOpen(true)}
        >
          <span className="pill-label">{tuning.name}</span>
          <span className="pill-notes">{tuningNotes}</span>
        </button>
      </div>

      {/* Instrument Modal */}
      <div
        className={`tuning-modal-overlay ${instrumentModalOpen ? 'open' : ''}`}
        onClick={() => setInstrumentModalOpen(false)}
      >
        <div
          className={`tuning-modal ${instrumentModalOpen ? 'open' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>Select Instrument</h2>
          <div className="tuning-list">
            {instruments.map(({ key, name }) => (
              <button
                key={key}
                className={`tuning-option ${key === currentInstrument ? 'active' : ''}`}
                onClick={() => {
                  onSelectInstrument(key);
                  setInstrumentModalOpen(false);
                }}
              >
                <span className="tuning-option-name">{name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tuning Modal */}
      <div
        className={`tuning-modal-overlay ${tuningModalOpen ? 'open' : ''}`}
        onClick={() => setTuningModalOpen(false)}
      >
        <div
          className={`tuning-modal ${tuningModalOpen ? 'open' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>Select Tuning</h2>
          <div className="tuning-list">
            {tunings.map(({ key, name, notes }) => (
              <button
                key={key}
                className={`tuning-option ${key === currentTuning ? 'active' : ''}`}
                onClick={() => {
                  onSelectTuning(key);
                  setTuningModalOpen(false);
                }}
              >
                <span className="tuning-option-name">{name}</span>
                <span className="tuning-option-notes">{notes}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
