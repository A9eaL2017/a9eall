import { useEffect, useRef, type ReactNode } from 'react';
import type { EffectConfig } from '@/types/config';

interface FloatingOrbsProps {
  effect: EffectConfig;
  reducedMotion: boolean;
}

export function FloatingOrbs({ effect, reducedMotion }: FloatingOrbsProps) {
  if (!effect.enabled || reducedMotion) return null;

  const orbCount = Math.floor(5 * (effect.intensity / 50));
  const orbs = Array.from({ length: orbCount }, (_, i) => i);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {orbs.map((i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${effect.size}px`,
            height: `${effect.size}px`,
            backgroundColor: effect.color,
            opacity: effect.opacity / 100,
            filter: `blur(${effect.size * 0.4}px)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float-orb ${10 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${15 / (effect.speed / 50)}s`,
          }}
        />
      ))}
    </div>
  );
}

interface TypingTextProps {
  text: string;
  effect: EffectConfig;
  className?: string;
}

export function TypingText({ text, effect, className }: TypingTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!effect.enabled) {
      if (ref.current) ref.current.textContent = text;
      return;
    }

    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const speed = 100 / (effect.speed / 50);

    const type = () => {
      if (ref.current) {
        ref.current.textContent = text.slice(0, i);
      }
      if (i < text.length) {
        i++;
        timeout = setTimeout(type, speed);
      } else {
        timeout = setTimeout(() => {
          i = 0;
          type();
        }, 3000);
      }
    };
    type();

    return () => clearTimeout(timeout);
  }, [text, effect]);

  return (
    <span ref={ref} className={className}>
      {effect.enabled ? '' : text}
    </span>
  );
}

interface GlowTextProps {
  children: ReactNode;
  effect: EffectConfig;
  className?: string;
}

export function GlowText({ children, effect, className }: GlowTextProps) {
  if (!effect.enabled) return <span className={className}>{children}</span>;

  return (
    <span
      className={className}
      style={{
        textShadow: `0 0 ${effect.size}px ${effect.color}, 0 0 ${effect.size * 2}px ${effect.color}`,
        opacity: effect.opacity / 100,
        animation: `text-glow-pulse ${3 / (effect.speed / 50)}s ease-in-out infinite`,
      }}
    >
      {children}
    </span>
  );
}
