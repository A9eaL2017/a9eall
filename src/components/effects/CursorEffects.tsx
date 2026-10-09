import { useEffect, useRef } from 'react';
import type { EffectConfig } from '@/types/config';

interface CursorEffectsProps {
  dot: EffectConfig;
  trail: EffectConfig;
  particles: EffectConfig;
  customCursor: EffectConfig;
  reducedMotion: boolean;
}

export function CursorEffects({ dot, trail, particles, customCursor, reducedMotion }: CursorEffectsProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const trailPointsRef = useRef<{ x: number; y: number; age: number }[]>([]);
  const cursorParticlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; size: number }[]>([]);

  useEffect(() => {
    const anyEnabled = (dot.enabled || trail.enabled || particles.enabled || customCursor.enabled) && !reducedMotion;
    if (!anyEnabled) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let raf = 0;
    let isVisible = true;
    const handleVisibility = () => { isVisible = !document.hidden; };
    document.addEventListener('visibilitychange', handleVisibility);

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dot.enabled && dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }

      if (trail.enabled) {
        trailPointsRef.current.push({ x: mouseX, y: mouseY, age: 0 });
        if (trailPointsRef.current.length > 30) trailPointsRef.current.shift();
      }

      if (particles.enabled) {
        const count = Math.floor(particles.intensity / 20);
        for (let i = 0; i < count; i++) {
          cursorParticlesRef.current.push({
            x: mouseX + (Math.random() - 0.5) * 10,
            y: mouseY + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 2 * (particles.speed / 50),
            vy: (Math.random() - 0.5) * 2 * (particles.speed / 50),
            life: 1,
            size: Math.random() * (particles.size / 50) * 3 + 1,
          });
        }
      }
    };

    window.addEventListener('mousemove', onMove);

    if (customCursor.enabled) {
      document.body.style.cursor = 'none';
    }

    const animate = () => {
      if (!isVisible) {
        raf = requestAnimationFrame(animate);
        return;
      }

      if (trail.enabled && trailCanvasRef.current) {
        const canvas = trailCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
          }
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const points = trailPointsRef.current;
          const trailColor = trail.color;
          const trailOpacity = trail.opacity / 100;
          const trailSize = trail.size / 50;

          for (let i = 0; i < points.length; i++) {
            const p = points[i];
            p.age++;
            const lifeRatio = 1 - p.age / 30;
            if (lifeRatio <= 0) continue;
            ctx.beginPath();
            ctx.arc(p.x, p.y, trailSize * 3 * lifeRatio, 0, Math.PI * 2);
            ctx.fillStyle = trailColor;
            ctx.globalAlpha = trailOpacity * lifeRatio;
            ctx.fill();
          }
          trailPointsRef.current = points.filter(p => p.age < 30);
        }
      }

      if (particles.enabled && particleCanvasRef.current) {
        const canvas = particleCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
          }
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const pColor = particles.color;
          const pOpacity = particles.opacity / 100;

          cursorParticlesRef.current = cursorParticlesRef.current.filter(p => p.life > 0);
          cursorParticlesRef.current.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05;
            p.life -= 0.02;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = pColor;
            ctx.globalAlpha = pOpacity * p.life;
            ctx.fill();
          });
        }
      }

      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (customCursor.enabled) {
        document.body.style.cursor = '';
      }
    };
  }, [dot, trail, particles, customCursor, reducedMotion]);

  const anyEnabled = (dot.enabled || trail.enabled || particles.enabled || customCursor.enabled) && !reducedMotion;
  if (!anyEnabled) return null;

  return (
    <>
      {dot.enabled && (
        <div
          ref={dotRef}
          className="fixed pointer-events-none rounded-full"
          style={{
            zIndex: 99999,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            backgroundColor: dot.color,
            opacity: dot.opacity / 100,
            boxShadow: `0 0 ${dot.size * 2}px ${dot.color}`,
            transition: 'transform 0.05s linear',
          }}
        />
      )}
      {trail.enabled && (
        <canvas
          ref={trailCanvasRef}
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 99998 }}
        />
      )}
      {particles.enabled && (
        <canvas
          ref={particleCanvasRef}
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 99997 }}
        />
      )}
    </>
  );
}
