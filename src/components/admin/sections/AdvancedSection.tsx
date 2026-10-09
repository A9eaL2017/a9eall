import { useConfig } from '@/context/ConfigContext';
import { AdminCard, AdminField, AdminInput, AdminTextarea, AdminToggle, AdminButton } from '../AdminUI';
import { Download, Upload, RotateCcw } from 'lucide-react';
import { useRef } from 'react';
import { defaultConfig } from '@/lib/defaultConfig';
import type { SiteConfig } from '@/types/config';

export function AdvancedSection() {
  const { draft, updateDraft, resetToDefault } = useConfig();
  const fileRef = useRef<HTMLInputElement>(null);
  if (!draft) return null;

  const adv = draft.advanced;

  const exportConfig = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'profile-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target?.result as string) as SiteConfig;
        updateDraft(() => imported);
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const confirmReset = () => {
    if (confirm('Reset all settings to default? This cannot be undone after saving.')) {
      resetToDefault();
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-1">Advanced Settings</h2>
      <p className="text-sm text-white/40 mb-6">SEO, intro screen, and configuration management</p>

      <AdminCard title="Browser Tab">
        <AdminField label="Browser Tab Title">
          <AdminInput value={adv.browserTitle} onChange={e => updateDraft(d => { d.advanced.browserTitle = e.target.value; return d; })} />
        </AdminField>
        <AdminField label="Favicon URL" hint="A square image URL for the browser tab icon">
          <AdminInput value={adv.favicon} onChange={e => updateDraft(d => { d.advanced.favicon = e.target.value; return d; })} placeholder="https://..." />
        </AdminField>
      </AdminCard>

      <AdminCard title="SEO">
        <AdminField label="SEO Title">
          <AdminInput value={adv.seoTitle} onChange={e => updateDraft(d => { d.advanced.seoTitle = e.target.value; return d; })} />
        </AdminField>
        <AdminField label="SEO Description">
          <AdminTextarea rows={2} value={adv.seoDescription} onChange={e => updateDraft(d => { d.advanced.seoDescription = e.target.value; return d; })} />
        </AdminField>
      </AdminCard>

      <AdminCard title="Intro Screen">
        <AdminToggle label="Enable Intro Screen" checked={adv.introSettings.enabled} onChange={v => updateDraft(d => { d.advanced.introSettings.enabled = v; return d; })} />
        {adv.introSettings.enabled && (
          <>
            <AdminField label="Intro Text">
              <AdminInput value={adv.introSettings.text} onChange={e => updateDraft(d => { d.advanced.introSettings.text = e.target.value; return d; })} />
            </AdminField>
            <AdminField label="Subtitle">
              <AdminInput value={adv.introSettings.subtitle} onChange={e => updateDraft(d => { d.advanced.introSettings.subtitle = e.target.value; return d; })} />
            </AdminField>
            <AdminToggle label="Sound Effects" checked={adv.introSettings.soundEnabled} onChange={v => updateDraft(d => { d.advanced.introSettings.soundEnabled = v; return d; })} />
          </>
        )}
      </AdminCard>

      <AdminCard title="Accessibility">
        <AdminToggle label="Reduced Motion" checked={adv.reducedMotion} onChange={v => updateDraft(d => { d.advanced.reducedMotion = v; return d; })} hint="Disables all animations and effects" />
      </AdminCard>

      <AdminCard title="Configuration" description="Export, import, or reset your entire configuration">
        <div className="flex flex-wrap gap-2">
          <AdminButton variant="ghost" onClick={exportConfig}>
            <Download size={14} /> Export JSON
          </AdminButton>
          <AdminButton variant="ghost" onClick={() => fileRef.current?.click()}>
            <Upload size={14} /> Import JSON
          </AdminButton>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={importConfig} />
          <AdminButton variant="danger" onClick={confirmReset}>
            <RotateCcw size={14} /> Reset to Default
          </AdminButton>
        </div>
      </AdminCard>
    </div>
  );
}
