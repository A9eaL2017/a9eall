import { useConfig } from '@/context/ConfigContext';
import { AdminCard, AdminField, AdminInput, AdminSlider, AdminToggle, AdminButton } from '../AdminUI';
import { Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function BackgroundSection() {
  const { draft, updateDraft } = useConfig();
  if (!draft) return null;

  const bg = draft.background;

  const uploadBackground = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop();
    const fileName = `backgrounds/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('profile-assets').upload(fileName, file);
    if (error) {
      console.error('Upload error:', error.message);
      return;
    }
    const { data } = supabase.storage.from('profile-assets').getPublicUrl(fileName);
    updateDraft(d => { d.background.imageUrl = data.publicUrl; d.background.type = 'image'; return d; });
  };

  const types: { value: typeof bg.type; label: string }[] = [
    { value: 'gradient', label: 'Gradient' },
    { value: 'solid', label: 'Solid Color' },
    { value: 'image', label: 'Image' },
    { value: 'video', label: 'Video' },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-1">Background</h2>
      <p className="text-sm text-white/40 mb-6">Configure your profile background</p>

      <AdminCard title="Background Type">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {types.map(t => (
            <button
              key={t.value}
              onClick={() => updateDraft(d => { d.background.type = t.value; return d; })}
              className="px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors"
              style={{
                borderColor: bg.type === t.value ? '#80dfff' : 'rgba(255,255,255,0.08)',
                backgroundColor: bg.type === t.value ? 'rgba(128,223,255,0.1)' : 'rgba(255,255,255,0.03)',
                color: bg.type === t.value ? '#80dfff' : 'rgba(255,255,255,0.7)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {bg.type === 'solid' && (
          <AdminField label="Solid Color">
            <div className="flex items-center gap-2">
              <input type="color" value={bg.solidColor} onChange={e => updateDraft(d => { d.background.solidColor = e.target.value; return d; })}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-white/10" />
              <AdminInput value={bg.solidColor} onChange={e => updateDraft(d => { d.background.solidColor = e.target.value; return d; })} />
            </div>
          </AdminField>
        )}

        {bg.type === 'gradient' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <AdminField label="Gradient From">
                <div className="flex items-center gap-2">
                  <input type="color" value={bg.gradientFrom} onChange={e => updateDraft(d => { d.background.gradientFrom = e.target.value; return d; })}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-white/10" />
                  <AdminInput value={bg.gradientFrom} onChange={e => updateDraft(d => { d.background.gradientFrom = e.target.value; return d; })} />
                </div>
              </AdminField>
              <AdminField label="Gradient To">
                <div className="flex items-center gap-2">
                  <input type="color" value={bg.gradientTo} onChange={e => updateDraft(d => { d.background.gradientTo = e.target.value; return d; })}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-white/10" />
                  <AdminInput value={bg.gradientTo} onChange={e => updateDraft(d => { d.background.gradientTo = e.target.value; return d; })} />
                </div>
              </AdminField>
            </div>
            <AdminSlider label="Gradient Angle" value={bg.gradientAngle} min={0} max={360} unit="°" onChange={v => updateDraft(d => { d.background.gradientAngle = v; return d; })} />
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { from: '#0a0a0a', to: '#111827' },
                { from: '#0a0a12', to: '#1a0a2e' },
                { from: '#0c1a0c', to: '#0a2a1a' },
                { from: '#1a0a0a', to: '#2e0a1a' },
                { from: '#0a0a1a', to: '#0a1a3e' },
                { from: '#1a1a0a', to: '#2e2a0a' },
              ].map((g, i) => (
                <button key={i} onClick={() => updateDraft(d => { d.background.gradientFrom = g.from; d.background.gradientTo = g.to; return d; })}
                  className="h-12 rounded-xl border border-white/10"
                  style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }} />
              ))}
            </div>
          </>
        )}

        {bg.type === 'image' && (
          <>
            <AdminField label="Image URL">
              <AdminInput value={bg.imageUrl} onChange={e => updateDraft(d => { d.background.imageUrl = e.target.value; return d; })} placeholder="https://..." />
            </AdminField>
            <label className="cursor-pointer block mb-3">
              <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 transition-colors flex items-center gap-2 w-fit">
                <Upload size={14} /> Upload Image
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={uploadBackground} />
            </label>
            {bg.imageUrl && <img src={bg.imageUrl} alt="" className="w-full h-32 rounded-xl object-cover" />}
          </>
        )}

        {bg.type === 'video' && (
          <AdminField label="Video URL">
            <AdminInput value={bg.videoUrl} onChange={e => updateDraft(d => { d.background.videoUrl = e.target.value; return d; })} placeholder="https://..." />
          </AdminField>
        )}
      </AdminCard>

      {(bg.type === 'image' || bg.type === 'video') && (
        <AdminCard title="Adjustments">
          <AdminSlider label="Blur" value={bg.blur} min={0} max={20} unit="px" onChange={v => updateDraft(d => { d.background.blur = v; return d; })} />
          <AdminSlider label="Brightness" value={bg.brightness} min={20} max={200} unit="%" onChange={v => updateDraft(d => { d.background.brightness = v; return d; })} />
        </AdminCard>
      )}

      <AdminCard title="Overlay" description="Dark overlay for better text readability">
        <AdminToggle label="Enable Overlay" checked={bg.overlay} onChange={v => updateDraft(d => { d.background.overlay = v; return d; })} />
        {bg.overlay && (
          <AdminSlider label="Overlay Opacity" value={bg.overlayOpacity} min={0} max={90} unit="%" onChange={v => updateDraft(d => { d.background.overlayOpacity = v; return d; })} />
        )}
      </AdminCard>
    </div>
  );
}
