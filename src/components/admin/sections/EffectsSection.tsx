import { useConfig } from '@/context/ConfigContext';
import { AdminCard, AdminToggle, AdminSlider, AdminColorInput, AdminButton } from '../AdminUI';
import { effectPresets, defaultConfig } from '@/lib/defaultConfig';
import type { EffectConfig, EffectsConfig } from '@/types/config';

function EffectControls({ effect, onChange, showColor, showSize }: {
  effect: EffectConfig;
  onChange: (updater: (e: EffectConfig) => EffectConfig) => void;
  showColor?: boolean;
  showSize?: boolean;
}) {
  return (
    <>
      <AdminToggle label="Enabled" checked={effect.enabled} onChange={v => onChange(e => { e.enabled = v; return e; })} />
      {effect.enabled && (
        <>
          <AdminSlider label="Intensity" value={effect.intensity} min={0} max={100} unit="%" onChange={v => onChange(e => { e.intensity = v; return e; })} />
          <AdminSlider label="Speed" value={effect.speed} min={0} max={100} unit="%" onChange={v => onChange(e => { e.speed = v; return e; })} />
          {showSize && <AdminSlider label="Size" value={effect.size} min={1} max={100} unit="px" onChange={v => onChange(e => { e.size = v; return e; })} />}
          <AdminSlider label="Opacity" value={effect.opacity} min={0} max={100} unit="%" onChange={v => onChange(e => { e.opacity = v; return e; })} />
          {showColor && <AdminColorInput label="Color" value={effect.color} onChange={v => onChange(e => { e.color = v; return e; })} />}
        </>
      )}
    </>
  );
}

export function EffectsSection() {
  const { draft, updateDraft } = useConfig();
  if (!draft) return null;

  const fx = draft.effects;

  const updateEffect = (category: keyof EffectsConfig, name: string, updater: (e: EffectConfig) => EffectConfig) => {
    updateDraft(d => {
      const cat = d.effects[category] as unknown as Record<string, EffectConfig>;
      cat[name] = updater({ ...cat[name] });
      return d;
    });
  };

  const applyPreset = (presetName: string) => {
    const preset = effectPresets[presetName];
    if (preset) {
      updateDraft(d => preset.apply(d));
    }
  };

  const resetEffects = () => {
    updateDraft(d => {
      d.effects = structuredClone(defaultConfig.effects);
      return d;
    });
  };

  const bgEffects: { key: keyof typeof fx.background; label: string; showSize: boolean; showColor: boolean }[] = [
    { key: 'particles', label: 'Floating Particles', showSize: true, showColor: true },
    { key: 'stars', label: 'Stars / Glowing Dots', showSize: true, showColor: true },
    { key: 'snowfall', label: 'Snowfall', showSize: true, showColor: true },
    { key: 'gradient', label: 'Animated Gradient', showSize: false, showColor: true },
    { key: 'aurora', label: 'Aurora Glow', showSize: false, showColor: true },
    { key: 'dust', label: 'Floating Dust', showSize: true, showColor: true },
  ];

  const profileEffects: { key: keyof typeof fx.profile; label: string; showSize: boolean; showColor: boolean }[] = [
    { key: 'glowingBorder', label: 'Glowing Avatar Border', showSize: true, showColor: true },
    { key: 'gradientBorder', label: 'Animated Gradient Border', showSize: true, showColor: true },
    { key: 'neonGlow', label: 'Neon Card Glow', showSize: true, showColor: true },
    { key: 'entranceAnimation', label: 'Profile Entrance Animation', showSize: false, showColor: false },
    { key: 'floatingOrbs', label: 'Floating Orbs', showSize: true, showColor: true },
    { key: 'textGlow', label: 'Text Glow', showSize: true, showColor: true },
    { key: 'typingAnimation', label: 'Typing Animation', showSize: false, showColor: false },
    { key: 'hoverTilt', label: 'Hover Tilt', showSize: false, showColor: false },
    { key: 'socialHover', label: 'Social Icon Hover', showSize: false, showColor: false },
  ];

  const cursorEffects: { key: keyof typeof fx.cursor; label: string; showSize: boolean; showColor: boolean }[] = [
    { key: 'customCursor', label: 'Custom Cursor', showSize: true, showColor: true },
    { key: 'cursorDot', label: 'Cursor Dot', showSize: true, showColor: true },
    { key: 'cursorTrail', label: 'Cursor Trail', showSize: true, showColor: true },
    { key: 'cursorParticles', label: 'Cursor Particles', showSize: true, showColor: true },
  ];

  const interfaceEffects: { key: keyof typeof fx.interface; label: string; showSize: boolean; showColor: boolean }[] = [
    { key: 'pageTransitions', label: 'Page Transitions', showSize: false, showColor: false },
    { key: 'fadeIn', label: 'Fade-in Animations', showSize: false, showColor: false },
    { key: 'buttonGlow', label: 'Button Hover Glow', showSize: false, showColor: true },
    { key: 'scaleHover', label: 'Scale on Hover', showSize: false, showColor: false },
    { key: 'animatedBorders', label: 'Animated Borders', showSize: false, showColor: true },
    { key: 'glassmorphism', label: 'Glassmorphism', showSize: false, showColor: false },
    { key: 'loadingAnimation', label: 'Loading Animation', showSize: false, showColor: true },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-1">Visual Effects</h2>
      <p className="text-sm text-white/40 mb-6">Fine-tune every visual effect on your profile</p>

      <AdminCard title="Master Control">
        <AdminToggle label="Enable All Effects" checked={fx.masterEnabled} onChange={v => updateDraft(d => { d.effects.masterEnabled = v; return d; })} hint="Toggle all effects at once" />
      </AdminCard>

      <AdminCard title="Effect Presets" description="Apply a curated set of effects">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.values(effectPresets).map(preset => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset.name)}
              className="p-3 rounded-xl border text-sm font-medium transition-colors text-left"
              style={{
                borderColor: fx.preset === preset.name ? '#80dfff' : 'rgba(255,255,255,0.08)',
                backgroundColor: fx.preset === preset.name ? 'rgba(128,223,255,0.1)' : 'rgba(255,255,255,0.03)',
                color: fx.preset === preset.name ? '#80dfff' : 'rgba(255,255,255,0.7)',
              }}
            >
              <p className="font-medium">{preset.name}</p>
              <p className="text-xs opacity-60 mt-0.5">{preset.description}</p>
            </button>
          ))}
        </div>
        <div className="mt-3">
          <AdminButton variant="danger" onClick={resetEffects}>Reset Effects to Default</AdminButton>
        </div>
      </AdminCard>

      <AdminCard title="Background Effects">
        {bgEffects.map(e => (
          <div key={e.key} className="border-b border-white/5 last:border-0 pb-3 mb-3 last:pb-0 last:mb-0">
            <EffectControls
              effect={fx.background[e.key]}
              onChange={updater => updateEffect('background', e.key, updater)}
              showColor={e.showColor}
              showSize={e.showSize}
            />
          </div>
        ))}
      </AdminCard>

      <AdminCard title="Profile Effects">
        {profileEffects.map(e => (
          <div key={e.key} className="border-b border-white/5 last:border-0 pb-3 mb-3 last:pb-0 last:mb-0">
            <EffectControls
              effect={fx.profile[e.key]}
              onChange={updater => updateEffect('profile', e.key, updater)}
              showColor={e.showColor}
              showSize={e.showSize}
            />
          </div>
        ))}
      </AdminCard>

      <AdminCard title="Cursor Effects">
        {cursorEffects.map(e => (
          <div key={e.key} className="border-b border-white/5 last:border-0 pb-3 mb-3 last:pb-0 last:mb-0">
            <EffectControls
              effect={fx.cursor[e.key]}
              onChange={updater => updateEffect('cursor', e.key, updater)}
              showColor={e.showColor}
              showSize={e.showSize}
            />
          </div>
        ))}
      </AdminCard>

      <AdminCard title="Interface Effects">
        {interfaceEffects.map(e => (
          <div key={e.key} className="border-b border-white/5 last:border-0 pb-3 mb-3 last:pb-0 last:mb-0">
            <EffectControls
              effect={fx.interface[e.key]}
              onChange={updater => updateEffect('interface', e.key, updater)}
              showColor={e.showColor}
              showSize={e.showSize}
            />
          </div>
        ))}
      </AdminCard>
    </div>
  );
}
