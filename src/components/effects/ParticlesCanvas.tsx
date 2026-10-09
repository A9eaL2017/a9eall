import { useEffect, useRef, useCallback } from 'react';
import type { EffectConfig } from '@/types/config';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
}

interface ParticlesCanvasProps {
  effect: EffectConfig;
  variant: 'particles' | 'stars' | 'snowfall' | 'dust';
  reducedMotion: boolean;
}

export function ParticlesCanvas({ effect, variant, reducedMotion }: ParticlesCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  const createParticle = useCallback((): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, vx: 0, vy: 0, size: 0, opacity: 0, life: 0 };

    const sizeMult = effect.size / 50;
    const speedMult = effect.speed / 50;
    const opacityVal = effect.opacity / 100;
    const intensityCount = effect.intensity / 50;

    if (variant === 'stars') {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2 * speedMult,
        vy: (Math.random() - 0.5) * 0.2 * speedMult,
        size: Math.random() * sizeMult * 1.5 + 0.5,
        opacity: Math.random() * opacityVal + 0.2,
        life: Math.random() * 200 + 100,
      };
    }
    if (variant === 'snowfall') {
      return {
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 0.5 * speedMult,
        vy: (Math.random() * 0.5 + 0.5) * speedMult * 1.5,
        size: Math.random() * sizeMult * 2 + 1,
        opacity: Math.random() * opacityVal + 0.3,
        life: -1,
      };
    }
    if (variant === 'dust') {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3 * speedMult,
        vy: (Math.random() - 0.5) * 0.3 * speedMult,
        size: Math.random() * sizeMult * 1 + 0.3,
        opacity: Math.random() * opacityVal + 0.1,
        life: -1,
      };
    }
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1 * speedMult,
      vy: (Math.random() - 0.5) * 1 * speedMult,
      size: Math.random() * sizeMult * 2 + 1,
      opacity: Math.random() * opacityVal + 0.2,
      life: -1,
    };
  }, [effect, variant]);

  useEffect(() => {
    if (!effect.enabled || reducedMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isVisible = true;
    const handleVisibility = () => { isVisible = !document.hidden; };
    document.addEventListener('visibilitychange', handleVisibility);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particleCount = Math.floor(80 * (effect.intensity / 50));
    particlesRef.current = Array.from({ length: particleCount }, createParticle);

    const color = effect.color;

    const animate = () => {
      if (!isVisible) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (variant === 'stars') {
          const twinkle = Math.sin(Date.now() * 0.002 + i) * 0.3 + 0.7;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = p.opacity * twinkle;
          ctx.shadowBlur = p.size * 3;
          ctx.shadowColor = color;
          ctx.fill();
        } else if (variant === 'snowfall') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
          if (p.y > canvas.height + 10) {
            particlesRef.current[i] = createParticle();
            particlesRef.current[i].y = -10;
          }
        } else if (variant === 'dust') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = p.opacity;
          ctx.shadowBlur = p.size * 2;
          ctx.shadowColor = color;
          ctx.fill();
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        }
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [effect, variant, reducedMotion, createParticle]);

  if (!effect.enabled || reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
