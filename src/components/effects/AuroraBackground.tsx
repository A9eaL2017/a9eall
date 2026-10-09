import { useEffect, useRef } from 'react';
import type { EffectConfig } from '@/types/config';

interface AuroraBackgroundProps {
  effect: EffectConfig;
  reducedMotion: boolean;
}

export function AuroraBackground({ effect, reducedMotion }: AuroraBackgroundProps) {
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
    const opacity = effect.opacity / 100;
    const color = effect.color;
    const intensity = effect.intensity / 100;

    let phase = 0;
    const animate = () => {
      if (!isVisible) {
        raf = requestAnimationFrame(animate);
        return;
      }
      phase += 0.003 * speed;
      const a1 = Math.sin(phase) * 40 * intensity;
      const a2 = Math.cos(phase * 0.8) * 40 * intensity;
      const a3 = Math.sin(phase * 1.2) * 40 * intensity;

      el.style.background = `
        radial-gradient(ellipse 60% 40% at ${30 + a1}% ${40 + a2}%, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%),
        radial-gradient(ellipse 50% 35% at ${70 + a2}% ${60 + a3}%, ${color}${Math.floor(opacity * 200).toString(16).padStart(2, '0')} 0%, transparent 70%),
        radial-gradient(ellipse 40% 30% at ${50 + a3}% ${30 + a1}%, ${color}${Math.floor(opacity * 150).toString(16).padStart(2, '0')} 0%, transparent 70%)
      `;
      el.style.filter = `blur(${40 + intensity * 40}px)`;
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
