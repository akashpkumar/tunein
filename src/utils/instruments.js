// Instrument configurations with detection settings
export const INSTRUMENTS = {
  guitar: {
    name: 'Guitar',
    strings: 6,
    detection: {
      minFreq: 70,
      maxFreq: 400,
      fftSize: 4096,
    },
    tunings: {
      standard: {
        name: 'Standard',
        strings: [
          { note: 'E', octave: 2, frequency: 82.41, string: 6, label: '6th string' },
          { note: 'A', octave: 2, frequency: 110.0, string: 5, label: '5th string' },
          { note: 'D', octave: 3, frequency: 146.83, string: 4, label: '4th string' },
          { note: 'G', octave: 3, frequency: 196.0, string: 3, label: '3rd string' },
          { note: 'B', octave: 3, frequency: 246.94, string: 2, label: '2nd string' },
          { note: 'E', octave: 4, frequency: 329.63, string: 1, label: '1st string' },
        ],
      },
      dropD: {
        name: 'Drop D',
        strings: [
          { note: 'D', octave: 2, frequency: 73.42, string: 6, label: '6th string' },
          { note: 'A', octave: 2, frequency: 110.0, string: 5, label: '5th string' },
          { note: 'D', octave: 3, frequency: 146.83, string: 4, label: '4th string' },
          { note: 'G', octave: 3, frequency: 196.0, string: 3, label: '3rd string' },
          { note: 'B', octave: 3, frequency: 246.94, string: 2, label: '2nd string' },
          { note: 'E', octave: 4, frequency: 329.63, string: 1, label: '1st string' },
        ],
      },
      halfStepDown: {
        name: 'Half Step Down',
        strings: [
          { note: 'Eb', octave: 2, frequency: 77.78, string: 6, label: '6th string' },
          { note: 'Ab', octave: 2, frequency: 103.83, string: 5, label: '5th string' },
          { note: 'Db', octave: 3, frequency: 138.59, string: 4, label: '4th string' },
          { note: 'Gb', octave: 3, frequency: 185.0, string: 3, label: '3rd string' },
          { note: 'Bb', octave: 3, frequency: 233.08, string: 2, label: '2nd string' },
          { note: 'Eb', octave: 4, frequency: 311.13, string: 1, label: '1st string' },
        ],
      },
      fullStepDown: {
        name: 'Full Step Down',
        strings: [
          { note: 'D', octave: 2, frequency: 73.42, string: 6, label: '6th string' },
          { note: 'G', octave: 2, frequency: 98.0, string: 5, label: '5th string' },
          { note: 'C', octave: 3, frequency: 130.81, string: 4, label: '4th string' },
          { note: 'F', octave: 3, frequency: 174.61, string: 3, label: '3rd string' },
          { note: 'A', octave: 3, frequency: 220.0, string: 2, label: '2nd string' },
          { note: 'D', octave: 4, frequency: 293.66, string: 1, label: '1st string' },
        ],
      },
      openG: {
        name: 'Open G',
        strings: [
          { note: 'D', octave: 2, frequency: 73.42, string: 6, label: '6th string' },
          { note: 'G', octave: 2, frequency: 98.0, string: 5, label: '5th string' },
          { note: 'D', octave: 3, frequency: 146.83, string: 4, label: '4th string' },
          { note: 'G', octave: 3, frequency: 196.0, string: 3, label: '3rd string' },
          { note: 'B', octave: 3, frequency: 246.94, string: 2, label: '2nd string' },
          { note: 'D', octave: 4, frequency: 293.66, string: 1, label: '1st string' },
        ],
      },
      openD: {
        name: 'Open D',
        strings: [
          { note: 'D', octave: 2, frequency: 73.42, string: 6, label: '6th string' },
          { note: 'A', octave: 2, frequency: 110.0, string: 5, label: '5th string' },
          { note: 'D', octave: 3, frequency: 146.83, string: 4, label: '4th string' },
          { note: 'F#', octave: 3, frequency: 185.0, string: 3, label: '3rd string' },
          { note: 'A', octave: 3, frequency: 220.0, string: 2, label: '2nd string' },
          { note: 'D', octave: 4, frequency: 293.66, string: 1, label: '1st string' },
        ],
      },
      dadgad: {
        name: 'DADGAD',
        strings: [
          { note: 'D', octave: 2, frequency: 73.42, string: 6, label: '6th string' },
          { note: 'A', octave: 2, frequency: 110.0, string: 5, label: '5th string' },
          { note: 'D', octave: 3, frequency: 146.83, string: 4, label: '4th string' },
          { note: 'G', octave: 3, frequency: 196.0, string: 3, label: '3rd string' },
          { note: 'A', octave: 3, frequency: 220.0, string: 2, label: '2nd string' },
          { note: 'D', octave: 4, frequency: 293.66, string: 1, label: '1st string' },
        ],
      },
      dropC: {
        name: 'Drop C',
        strings: [
          { note: 'C', octave: 2, frequency: 65.41, string: 6, label: '6th string' },
          { note: 'G', octave: 2, frequency: 98.0, string: 5, label: '5th string' },
          { note: 'C', octave: 3, frequency: 130.81, string: 4, label: '4th string' },
          { note: 'F', octave: 3, frequency: 174.61, string: 3, label: '3rd string' },
          { note: 'A', octave: 3, frequency: 220.0, string: 2, label: '2nd string' },
          { note: 'D', octave: 4, frequency: 293.66, string: 1, label: '1st string' },
        ],
      },
    },
  },
  bass: {
    name: 'Bass',
    strings: 4,
    detection: {
      minFreq: 30,
      maxFreq: 150,
      fftSize: 8192,
    },
    tunings: {
      standard: {
        name: 'Standard',
        strings: [
          { note: 'E', octave: 1, frequency: 41.2, string: 4, label: '4th string' },
          { note: 'A', octave: 1, frequency: 55.0, string: 3, label: '3rd string' },
          { note: 'D', octave: 2, frequency: 73.42, string: 2, label: '2nd string' },
          { note: 'G', octave: 2, frequency: 98.0, string: 1, label: '1st string' },
        ],
      },
      dropD: {
        name: 'Drop D',
        strings: [
          { note: 'D', octave: 1, frequency: 36.71, string: 4, label: '4th string' },
          { note: 'A', octave: 1, frequency: 55.0, string: 3, label: '3rd string' },
          { note: 'D', octave: 2, frequency: 73.42, string: 2, label: '2nd string' },
          { note: 'G', octave: 2, frequency: 98.0, string: 1, label: '1st string' },
        ],
      },
      halfStepDown: {
        name: 'Half Step Down',
        strings: [
          { note: 'Eb', octave: 1, frequency: 38.89, string: 4, label: '4th string' },
          { note: 'Ab', octave: 1, frequency: 51.91, string: 3, label: '3rd string' },
          { note: 'Db', octave: 2, frequency: 69.3, string: 2, label: '2nd string' },
          { note: 'Gb', octave: 2, frequency: 92.5, string: 1, label: '1st string' },
        ],
      },
      fiveString: {
        name: '5-String Standard',
        strings: [
          { note: 'B', octave: 0, frequency: 30.87, string: 5, label: '5th string' },
          { note: 'E', octave: 1, frequency: 41.2, string: 4, label: '4th string' },
          { note: 'A', octave: 1, frequency: 55.0, string: 3, label: '3rd string' },
          { note: 'D', octave: 2, frequency: 73.42, string: 2, label: '2nd string' },
          { note: 'G', octave: 2, frequency: 98.0, string: 1, label: '1st string' },
        ],
      },
    },
  },
  ukulele: {
    name: 'Ukulele',
    strings: 4,
    detection: {
      minFreq: 200,
      maxFreq: 500,
      fftSize: 4096,
    },
    tunings: {
      standard: {
        name: 'Standard',
        strings: [
          { note: 'G', octave: 4, frequency: 392.0, string: 4, label: '4th string' },
          { note: 'C', octave: 4, frequency: 261.63, string: 3, label: '3rd string' },
          { note: 'E', octave: 4, frequency: 329.63, string: 2, label: '2nd string' },
          { note: 'A', octave: 4, frequency: 440.0, string: 1, label: '1st string' },
        ],
      },
      lowG: {
        name: 'Low G',
        strings: [
          { note: 'G', octave: 3, frequency: 196.0, string: 4, label: '4th string' },
          { note: 'C', octave: 4, frequency: 261.63, string: 3, label: '3rd string' },
          { note: 'E', octave: 4, frequency: 329.63, string: 2, label: '2nd string' },
          { note: 'A', octave: 4, frequency: 440.0, string: 1, label: '1st string' },
        ],
      },
      baritone: {
        name: 'Baritone',
        strings: [
          { note: 'D', octave: 3, frequency: 146.83, string: 4, label: '4th string' },
          { note: 'G', octave: 3, frequency: 196.0, string: 3, label: '3rd string' },
          { note: 'B', octave: 3, frequency: 246.94, string: 2, label: '2nd string' },
          { note: 'E', octave: 4, frequency: 329.63, string: 1, label: '1st string' },
        ],
      },
      dTuning: {
        name: 'D Tuning',
        strings: [
          { note: 'A', octave: 4, frequency: 440.0, string: 4, label: '4th string' },
          { note: 'D', octave: 4, frequency: 293.66, string: 3, label: '3rd string' },
          { note: 'F#', octave: 4, frequency: 369.99, string: 2, label: '2nd string' },
          { note: 'B', octave: 4, frequency: 493.88, string: 1, label: '1st string' },
        ],
      },
    },
  },
  mandolin: {
    name: 'Mandolin',
    strings: 8,
    detection: {
      minFreq: 150,
      maxFreq: 700,
      fftSize: 4096,
    },
    tunings: {
      standard: {
        name: 'Standard',
        strings: [
          { note: 'G', octave: 3, frequency: 196.0, string: 4, label: '4th course' },
          { note: 'D', octave: 4, frequency: 293.66, string: 3, label: '3rd course' },
          { note: 'A', octave: 4, frequency: 440.0, string: 2, label: '2nd course' },
          { note: 'E', octave: 5, frequency: 659.25, string: 1, label: '1st course' },
        ],
      },
      octave: {
        name: 'Octave Mandolin',
        strings: [
          { note: 'G', octave: 2, frequency: 98.0, string: 4, label: '4th course' },
          { note: 'D', octave: 3, frequency: 146.83, string: 3, label: '3rd course' },
          { note: 'A', octave: 3, frequency: 220.0, string: 2, label: '2nd course' },
          { note: 'E', octave: 4, frequency: 329.63, string: 1, label: '1st course' },
        ],
      },
    },
  },
  banjo: {
    name: 'Banjo',
    strings: 5,
    detection: {
      minFreq: 140,
      maxFreq: 400,
      fftSize: 4096,
    },
    tunings: {
      openG: {
        name: 'Open G',
        strings: [
          { note: 'G', octave: 4, frequency: 392.0, string: 5, label: '5th string' },
          { note: 'D', octave: 3, frequency: 146.83, string: 4, label: '4th string' },
          { note: 'G', octave: 3, frequency: 196.0, string: 3, label: '3rd string' },
          { note: 'B', octave: 3, frequency: 246.94, string: 2, label: '2nd string' },
          { note: 'D', octave: 4, frequency: 293.66, string: 1, label: '1st string' },
        ],
      },
      doubleC: {
        name: 'Double C',
        strings: [
          { note: 'G', octave: 4, frequency: 392.0, string: 5, label: '5th string' },
          { note: 'C', octave: 3, frequency: 130.81, string: 4, label: '4th string' },
          { note: 'G', octave: 3, frequency: 196.0, string: 3, label: '3rd string' },
          { note: 'C', octave: 4, frequency: 261.63, string: 2, label: '2nd string' },
          { note: 'D', octave: 4, frequency: 293.66, string: 1, label: '1st string' },
        ],
      },
      sawmill: {
        name: 'Sawmill (G Modal)',
        strings: [
          { note: 'G', octave: 4, frequency: 392.0, string: 5, label: '5th string' },
          { note: 'D', octave: 3, frequency: 146.83, string: 4, label: '4th string' },
          { note: 'G', octave: 3, frequency: 196.0, string: 3, label: '3rd string' },
          { note: 'C', octave: 4, frequency: 261.63, string: 2, label: '2nd string' },
          { note: 'D', octave: 4, frequency: 293.66, string: 1, label: '1st string' },
        ],
      },
    },
  },
};

export const DEFAULT_INSTRUMENT = 'guitar';
export const DEFAULT_TUNINGS = {
  guitar: 'standard',
  bass: 'standard',
  ukulele: 'standard',
  mandolin: 'standard',
  banjo: 'openG',
};

export function getInstrumentList() {
  return Object.entries(INSTRUMENTS).map(([key, inst]) => ({
    key,
    name: inst.name,
  }));
}

export function getTuningsForInstrument(instrumentKey) {
  const instrument = INSTRUMENTS[instrumentKey];
  if (!instrument) return [];

  return Object.entries(instrument.tunings).map(([key, tuning]) => ({
    key,
    name: tuning.name,
    notes: tuning.strings.map(s => s.note).join(' '),
  }));
}
