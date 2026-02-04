// Find the closest string to a given frequency
export function findClosestString(frequency, strings, detection = { minFreq: 50, maxFreq: 400 }) {
  if (!frequency || frequency < detection.minFreq || frequency > detection.maxFreq || !strings || strings.length === 0) {
    return null;
  }

  let closest = strings[0];
  let minDiff = Math.abs(frequency - closest.frequency);

  for (const string of strings) {
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
const MIN_THRESHOLD = 0.001;
// Signal must be this many times above noise floor to trigger
const NOISE_GATE_RATIO = 4;
// How fast the noise floor adapts (lower = slower, more stable)
const NOISE_FLOOR_DECAY = 0.05;

// Autocorrelation-based pitch detection with adaptive noise gate
let noiseFloor = 0.01;

export function detectPitch(audioBuffer, sampleRate, detection = { minFreq: 70, maxFreq: 400 }) {
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

  // Find the FIRST significant peak (not just max) to avoid octave errors
  // Guitar harmonics can create higher peaks at half the period (octave up)

  let minLag = Math.floor(sampleRate / detection.maxFreq);
  let maxLag = Math.floor(sampleRate / detection.minFreq);

  // First, find the maximum correlation value for reference
  let maxCorrelation = 0;
  for (let lag = minLag; lag < maxLag && lag < MAX_SAMPLES; lag++) {
    if (correlations[lag] > maxCorrelation) {
      maxCorrelation = correlations[lag];
    }
  }

  // Now find the FIRST peak that's at least 80% of the max
  // This helps us find the fundamental rather than a harmonic
  const peakThreshold = maxCorrelation * 0.8;
  let peakLag = 0;
  let foundPeak = false;

  for (let lag = minLag; lag < maxLag && lag < MAX_SAMPLES; lag++) {
    const current = correlations[lag];
    const prev = correlations[lag - 1] || 0;
    const next = correlations[lag + 1] || 0;

    // Detect if we're at a local peak
    if (current > prev && current >= next && current >= peakThreshold) {
      peakLag = lag;
      foundPeak = true;
      break; // Take the first significant peak
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
  if (frequency < detection.minFreq || frequency > detection.maxFreq) {
    return null;
  }

  return frequency;
}

// Create audio analyzer
export async function createAudioAnalyzer(detection = { minFreq: 70, maxFreq: 400, fftSize: 4096 }) {
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

  analyser.fftSize = detection.fftSize;
  analyser.smoothingTimeConstant = 0.1;

  source.connect(analyser);

  let waveformBuffer = new Float32Array(analyser.fftSize);
  let currentDetection = detection;

  return {
    analyser,
    audioContext,
    stream,
    sampleRate: audioContext.sampleRate,
    getFrequency: () => {
      analyser.getFloatTimeDomainData(waveformBuffer);
      return detectPitch(waveformBuffer, audioContext.sampleRate, currentDetection);
    },
    getWaveform: () => {
      analyser.getFloatTimeDomainData(waveformBuffer);
      return waveformBuffer;
    },
    updateDetection: (newDetection) => {
      currentDetection = newDetection;
      if (newDetection.fftSize !== analyser.fftSize) {
        analyser.fftSize = newDetection.fftSize;
        waveformBuffer = new Float32Array(analyser.fftSize);
      }
    },
    cleanup: () => {
      stream.getTracks().forEach(track => track.stop());
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
    }
  };
}
