import type { EffectsConfig } from '@/types/config';
import { ParticlesCanvas } from './ParticlesCanvas';
import { GradientBackground } from './GradientBackground';
import { AuroraBackground } from './AuroraBackground';
import { CursorEffects } from './CursorEffects';

interface EffectsRendererProps {
  effects: EffectsConfig;
  reducedMotion: boolean;
}

export function EffectsRenderer({ effects, reducedMotion }: EffectsRendererProps) {
  if (!effects.masterEnabled || reducedMotion) {
    return (
      <CursorEffects
        dot={effects.cursor.cursorDot}
        trail={effects.cursor.cursorTrail}
        particles={effects.cursor.cursorParticles}
        customCursor={effects.cursor.customCursor}
        reducedMotion={true}
      />
    );
  }

  return (
    <>
      <GradientBackground effect={effects.background.gradient} reducedMotion={reducedMotion} />
      <AuroraBackground effect={effects.background.aurora} reducedMotion={reducedMotion} />
      <ParticlesCanvas effect={effects.background.particles} variant="particles" reducedMotion={reducedMotion} />
      <ParticlesCanvas effect={effects.background.stars} variant="stars" reducedMotion={reducedMotion} />
      <ParticlesCanvas effect={effects.background.snowfall} variant="snowfall" reducedMotion={reducedMotion} />
      <ParticlesCanvas effect={effects.background.dust} variant="dust" reducedMotion={reducedMotion} />
      <CursorEffects
        dot={effects.cursor.cursorDot}
        trail={effects.cursor.cursorTrail}
        particles={effects.cursor.cursorParticles}
        customCursor={effects.cursor.customCursor}
        reducedMotion={reducedMotion}
      />
    </>
  );
}
