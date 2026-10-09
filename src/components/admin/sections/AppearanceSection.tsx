import { useConfig } from '@/context/ConfigContext';
import { AdminCard, AdminField, AdminColorInput, AdminSlider, AdminButton, AdminToggle } from '../AdminUI';
import { appearancePresets } from '@/lib/defaultConfig';

export function AppearanceSection() {
  const { draft, updateDraft } = useConfig();
  if (!draft) return null;

  const a = draft.appearance;

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-1">Appearance</h2>
      <p className="text-sm text-white/40 mb-6">Customize colors, fonts, and visual style</p>

      <AdminCard title="Theme Presets" description="Quick-start with a curated theme">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.values(appearancePresets).map(preset => (
            <button
              key={preset.name}
              onClick={() => {
                const changes = preset.apply(draft);
                updateDraft(d => { d.appearance = { ...d.appearance, ...changes }; return d; });
              }}
              className="p-3 rounded-xl border text-sm font-medium transition-colors"
              style={{
                borderColor: a.preset === preset.name ? '#80dfff' : 'rgba(255,255,255,0.08)',
                backgroundColor: a.preset === preset.name ? 'rgba(128,223,255,0.1)' : 'rgba(255,255,255,0.03)',
                color: a.preset === preset.name ? '#80dfff' : 'rgba(255,255,255,0.7)',
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </AdminCard>

      <AdminCard title="Colors">
        <AdminColorInput label="Accent Color" value={a.accentColor} onChange={v => updateDraft(d => { d.appearance.accentColor = v; return d; })} />
        <AdminColorInput label="Background Color" value={a.backgroundColor} onChange={v => updateDraft(d => { d.appearance.backgroundColor = v; return d; })} />
      </AdminCard>

      <AdminCard title="Profile Card" description="Control the panel behind your name, avatar, and profile details">
        <AdminToggle
          label="Transparent Profile Card"
          checked={!!a.transparentCard}
          onChange={v => updateDraft(d => { d.appearance.transparentCard = v; return d; })}
        />
      </AdminCard>

      <AdminCard title="Visual Tuning">
        <AdminSlider label="Glow Intensity" value={a.glowIntensity} min={0} max={100} unit="%" onChange={v => updateDraft(d => { d.appearance.glowIntensity = v; return d; })} />
        <AdminSlider label="Blur" value={a.blur} min={0} max={30} unit="px" onChange={v => updateDraft(d => { d.appearance.blur = v; return d; })} />
        <AdminSlider label="Shadow" value={a.shadow} min={0} max={50} unit="px" onChange={v => updateDraft(d => { d.appearance.shadow = v; return d; })} />
        <AdminSlider label="Transparency" value={a.transparency} min={0} max={50} unit="%" onChange={v => updateDraft(d => { d.appearance.transparency = v; return d; })} />
        <AdminSlider label="Border Radius" value={a.borderRadius} min={0} max={32} unit="px" onChange={v => updateDraft(d => { d.appearance.borderRadius = v; return d; })} />
      </AdminCard>

      <AdminCard title="Typography">
        <AdminField label="Font Family">
          <select
            value={a.fontFamily}
            onChange={e => updateDraft(d => { d.appearance.fontFamily = e.target.value; return d; })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#80dfff]/50"
          >
            <option value="Inter" className="bg-[#1a1a1a]">Inter</option>
            <option value="system-ui" className="bg-[#1a1a1a]">System UI</option>
            <option value="Georgia" className="bg-[#1a1a1a]">Georgia</option>
            <option value="monospace" className="bg-[#1a1a1a]">Monospace</option>
          </select>
        </AdminField>
      </AdminCard>
    </div>
  );
}
