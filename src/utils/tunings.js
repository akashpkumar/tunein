// Common guitar tunings
export const TUNINGS = {
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
  openE: {
    name: 'Open E',
    strings: [
      { note: 'E', octave: 2, frequency: 82.41, string: 6, label: '6th string' },
      { note: 'B', octave: 2, frequency: 123.47, string: 5, label: '5th string' },
      { note: 'E', octave: 3, frequency: 164.81, string: 4, label: '4th string' },
      { note: 'G#', octave: 3, frequency: 207.65, string: 3, label: '3rd string' },
      { note: 'B', octave: 3, frequency: 246.94, string: 2, label: '2nd string' },
      { note: 'E', octave: 4, frequency: 329.63, string: 1, label: '1st string' },
    ],
  },
  openA: {
    name: 'Open A',
    strings: [
      { note: 'E', octave: 2, frequency: 82.41, string: 6, label: '6th string' },
      { note: 'A', octave: 2, frequency: 110.0, string: 5, label: '5th string' },
      { note: 'E', octave: 3, frequency: 164.81, string: 4, label: '4th string' },
      { note: 'A', octave: 3, frequency: 220.0, string: 3, label: '3rd string' },
      { note: 'C#', octave: 4, frequency: 277.18, string: 2, label: '2nd string' },
      { note: 'E', octave: 4, frequency: 329.63, string: 1, label: '1st string' },
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
};

export const DEFAULT_TUNING = 'standard';

export function getTuningDisplay(tuning) {
  const notes = tuning.strings.map(s => `${s.note}${s.octave}`).join(' ');
  return `${tuning.name} (${notes})`;
}

export function getTuningNotesShort(tuning) {
  return tuning.strings.map(s => s.note).join(' ');
}
