import { useRef, useEffect } from 'react';
import './Waveform.css';

export default function Waveform({ analyzerRef, color = 'rgba(255, 255, 255, 0.3)' }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      if (!analyzerRef.current) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      const waveform = analyzerRef.current.getWaveform();
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Draw waveform
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Sample the waveform (don't need all 4096 points)
      const samples = 128;
      const step = Math.floor(waveform.length / samples);

      for (let i = 0; i < samples; i++) {
        const index = i * step;
        const value = waveform[index];

        // Map -1..1 to canvas height
        const x = (i / samples) * width;
        const y = (1 - value) * 0.5 * height;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyzerRef, color]);

  return <canvas ref={canvasRef} className="waveform" />;
}
