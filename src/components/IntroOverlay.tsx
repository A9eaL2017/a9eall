import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { IntroConfig } from '@/types/config';

interface IntroOverlayProps {
  config: IntroConfig;
  accentColor: string;
  onEnter: () => void;
}

export function IntroOverlay({ config, accentColor, onEnter }: IntroOverlayProps) {
  const [exiting, setExiting] = useState(false);

  if (!config.enabled) {
    return null;
  }

  const handleEnter = () => {
    setExiting(true);
    if (config.soundEnabled) {
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } catch {
        // Audio not available
      }
    }
    setTimeout(onEnter, 800);
  };

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer"
          style={{
            background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #050505 100%)',
          }}
          onClick={handleEnter}
        >
          <div className="text-center relative">
            <motion.div
              className="absolute inset-0 -m-20 rounded-full"
              style={{
                background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.p
              className="text-sm font-light tracking-[0.4em] uppercase mb-4 relative"
              style={{ color: 'rgba(255,255,255,0.3)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              {config.subtitle}
            </motion.p>
            <motion.h1
              className="text-3xl md:text-5xl font-bold tracking-[0.2em] relative"
              style={{
                color: 'rgba(255,255,255,0.9)',
                textShadow: `0 0 30px ${accentColor}40, 0 0 60px ${accentColor}20`,
              }}
              initial={{ opacity: 0, filter: 'blur(20px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
            >
              {config.text}
            </motion.h1>
            <motion.div
              className="mt-8 flex justify-center relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <div
                className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
                style={{
                  borderColor: `${accentColor}40`,
                  animation: 'pulse-glow 2s ease-in-out infinite',
                }}
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
