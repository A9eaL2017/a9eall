import { useEffect, useRef } from 'react';
import type { EffectConfig } from '@/types/config';

interface GradientBackgroundProps {
  effect: EffectConfig;
  reducedMotion: boolean;
}

export function GradientBackground({ effect, reducedMotion }: GradientBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!effect.enabled || reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let isVisible = true;
    const handleVisibility = () => { isVisible = !document.hidden; };
    document.addEventListener('visibilitychange', handleVisibility);

    const speed = effect.speed / 50;
    const intensity = effect.intensity / 100;
    const opacity = effect.opacity / 100;
    const color = effect.color;

    let phase = 0;
    const animate = () => {
      if (!isVisible) {
        raf = requestAnimationFrame(animate);
        return;
      }
      phase += 0.005 * speed;
      const x = Math.sin(phase) * 30 * intensity;
      const y = Math.cos(phase * 0.7) * 30 * intensity;
      const x2 = Math.cos(phase * 1.3) * 30 * intensity;
      const y2 = Math.sin(phase * 0.9) * 30 * intensity;

      el.style.background = `radial-gradient(ellipse at ${50 + x}% ${50 + y}%, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 50%), radial-gradient(ellipse at ${50 + x2}% ${50 + y2}%, ${color}${Math.floor(opacity * 180).toString(16).padStart(2, '0')} 0%, transparent 60%)`;
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [effect, reducedMotion]);

  if (!effect.enabled || reducedMotion) return null;

  return <div ref={ref} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}
