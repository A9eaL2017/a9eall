import type { ReactNode } from 'react';
import { Save, X, RotateCcw, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useConfig } from '@/context/ConfigContext';

export function AdminCard({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5 mb-4">
      <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
      {description && <p className="text-xs text-white/40 mb-4">{description}</p>}
      {children}
    </div>
  );
}

export function AdminField({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div className="mb-4">
      <label className="text-xs text-white/50 mb-1.5 block font-medium">{label}</label>
      {children}
      {hint && <p className="text-xs text-white/30 mt-1">{hint}</p>}
    </div>
  );
}

export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#80dfff]/50 transition-colors placeholder:text-white/20"
    />
  );
}

export function AdminTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#80dfff]/50 transition-colors placeholder:text-white/20 resize-none"
    />
  );
}

export function AdminToggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <span className="text-sm text-white/80">{label}</span>
        {hint && <p className="text-xs text-white/30 mt-0.5">{hint}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
        style={{
          backgroundColor: checked ? 'rgba(128, 223, 255, 0.3)' : 'rgba(255,255,255,0.1)',
        }}
      >
        <div
          className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
          style={{
            left: checked ? '22px' : '2px',
            backgroundColor: checked ? '#80dfff' : 'rgba(255,255,255,0.4)',
            boxShadow: checked ? '0 0 8px rgba(128, 223, 255, 0.5)' : 'none',
          }}
        />
      </button>
    </div>
  );
}

export function AdminSlider({ label, value, min, max, step, onChange, unit }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; unit?: string }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1.5">
        <label className="text-xs text-white/50 font-medium">{label}</label>
        <span className="text-xs text-white/40">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step || 1}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #80dfff ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%)`,
        }}
      />
    </div>
  );
}

export function AdminColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-4">
      <label className="text-xs text-white/50 mb-1.5 block font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-white/10"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-mono"
        />
      </div>
    </div>
  );
}

export function AdminButton({ children, onClick, variant, disabled, type }: { children: ReactNode; onClick?: () => void; variant?: 'primary' | 'danger' | 'ghost'; disabled?: boolean; type?: 'button' | 'submit' }) {
  const styles = {
    primary: 'bg-[#80dfff]/10 border-[#80dfff]/30 text-[#80dfff] hover:bg-[#80dfff]/20',
    danger: 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20',
    ghost: 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10',
  };
  return (
    <button
      type={type || 'button'}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 ${styles[variant || 'ghost']}`}
    >
      {children}
    </button>
  );
}

export function SaveBar() {
  const { saveDraft, cancelDraft, resetToDefault, saveStatus, error } = useConfig();

  return (
    <div className="sticky bottom-0 z-20 bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-white/5 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <Check size={14} /> Changes saved
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle size={14} /> {error || 'Failed to save'}
            </span>
          )}
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1.5 text-xs text-white/50">
              <Loader2 size={14} className="animate-spin" /> Saving...
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetToDefault}
            className="px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            onClick={cancelDraft}
            className="px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors flex items-center gap-1.5"
          >
            <X size={14} /> Cancel
          </button>
          <button
            onClick={saveDraft}
            disabled={saveStatus === 'saving'}
            className="px-4 py-2 rounded-lg text-xs bg-[#80dfff]/15 border border-[#80dfff]/30 text-[#80dfff] hover:bg-[#80dfff]/25 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save size={14} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
