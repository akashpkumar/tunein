// Guitar string frequencies (standard tuning)
export const GUITAR_STRINGS = [
  { note: 'E', octave: 2, frequency: 82.41, string: 6, label: '6th string (low E)' },
  { note: 'A', octave: 2, frequency: 110.0, string: 5, label: '5th string' },
  { note: 'D', octave: 3, frequency: 146.83, string: 4, label: '4th string' },
  { note: 'G', octave: 3, frequency: 196.0, string: 3, label: '3rd string' },
  { note: 'B', octave: 3, frequency: 246.94, string: 2, label: '2nd string' },
  { note: 'E', octave: 4, frequency: 329.63, string: 1, label: '1st string (high E)' },
];

// Find the closest guitar string to a given frequency
export function findClosestString(frequency) {
  if (!frequency || frequency < 60 || frequency > 400) {
    return null;
  }

  let closest = GUITAR_STRINGS[0];
  let minDiff = Math.abs(frequency - closest.frequency);

  for (const string of GUITAR_STRINGS) {
    const diff = Math.abs(frequency - string.frequency);
    if (diff < minDiff) {
      minDiff = diff;
      closest = string;
    }
  }

  return closest;
}

// Calculate cents deviation from target frequency
// Cents = 1200 * log2(f1/f2)
export function getCentsOff(frequency, targetFrequency) {
  if (!frequency || !targetFrequency) return 0;
  return 1200 * Math.log2(frequency / targetFrequency);
}

// Minimum threshold to avoid detecting silence
const MIN_THRESHOLD = 0.002;
// Signal must be this many times above noise floor to trigger
const NOISE_GATE_RATIO = 4;
// How fast the noise floor adapts (lower = slower, more stable)
const NOISE_FLOOR_DECAY = 0.05;

// Autocorrelation-based pitch detection with adaptive noise gate
let noiseFloor = 0.01;

export function detectPitch(audioBuffer, sampleRate) {
  const buffer = audioBuffer;
  const SIZE = buffer.length;
  const MAX_SAMPLES = Math.floor(SIZE / 2);

  // Find the RMS (volume level)
  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / SIZE);

  // Update noise floor estimate (tracks quiet periods)
  // Only lower the floor gradually, raise it slowly too
  if (rms < noiseFloor) {
    noiseFloor = rms;
  } else if (rms < noiseFloor * 2) {
    // Slowly adapt up if consistently slightly louder
    noiseFloor += (rms - noiseFloor) * NOISE_FLOOR_DECAY;
  }

  // Dynamic threshold: must be well above noise floor
  const threshold = Math.max(MIN_THRESHOLD, noiseFloor * NOISE_GATE_RATIO);

  // Not enough signal above noise
  if (rms < threshold) {
    return null;
  }

  // Autocorrelation
  const correlations = new Array(MAX_SAMPLES);
  for (let lag = 0; lag < MAX_SAMPLES; lag++) {
    let sum = 0;
    for (let i = 0; i < MAX_SAMPLES; i++) {
      sum += buffer[i] * buffer[i + lag];
    }
    correlations[lag] = sum;
  }

  // Find the first peak after the initial decline
  let foundPeak = false;
  let peakLag = 0;
  let peakValue = 0;

  // Skip the first part (always high correlation at lag 0)
  // Look for where correlation starts rising again
  let minLag = Math.floor(sampleRate / 400); // ~400 Hz max
  let maxLag = Math.floor(sampleRate / 70);  // ~70 Hz min

  // Find the peak in the valid range
  for (let lag = minLag; lag < maxLag && lag < MAX_SAMPLES; lag++) {
    if (correlations[lag] > peakValue) {
      peakValue = correlations[lag];
      peakLag = lag;
      foundPeak = true;
    }
  }

  if (!foundPeak || peakLag === 0) {
    return null;
  }

  // Parabolic interpolation for better accuracy
  const y1 = correlations[peakLag - 1] || 0;
  const y2 = correlations[peakLag];
  const y3 = correlations[peakLag + 1] || 0;

  const shift = (y3 - y1) / (2 * (2 * y2 - y1 - y3));
  const refinedLag = peakLag + (isNaN(shift) ? 0 : shift);

  const frequency = sampleRate / refinedLag;

  // Sanity check
  if (frequency < 70 || frequency > 400) {
    return null;
  }

  return frequency;
}

// Create audio analyzer
export async function createAudioAnalyzer() {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
    }
  });

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();

  analyser.fftSize = 4096;
  analyser.smoothingTimeConstant = 0.1;

  source.connect(analyser);

  const waveformBuffer = new Float32Array(analyser.fftSize);

  return {
    analyser,
    audioContext,
    stream,
    sampleRate: audioContext.sampleRate,
    getFrequency: () => {
      analyser.getFloatTimeDomainData(waveformBuffer);
      return detectPitch(waveformBuffer, audioContext.sampleRate);
    },
    getWaveform: () => {
      analyser.getFloatTimeDomainData(waveformBuffer);
      return waveformBuffer;
    },
    cleanup: () => {
      stream.getTracks().forEach(track => track.stop());
      audioContext.close();
    }
  };
}
