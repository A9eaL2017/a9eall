import { Eye, Music, Palette, Sparkles, Image, Link as LinkIcon, Settings, User } from 'lucide-react';
import { useConfig } from '@/context/ConfigContext';

const sectionIcons = {
  profile: User,
  appearance: Palette,
  background: Image,
  music: Music,
  effects: Sparkles,
  social: LinkIcon,
  advanced: Settings,
};

export function AdminOverview({ onNavigate }: { onNavigate: (section: string) => void }) {
  const { draft, saveStatus } = useConfig();
  if (!draft) return null;

  const accent = draft.appearance.accentColor;
  const sections = [
    { id: 'profile', label: 'Profile Editor', desc: 'Name, bio, avatar, status' },
    { id: 'appearance', label: 'Appearance', desc: 'Colors, fonts, theme presets' },
    { id: 'background', label: 'Background', desc: 'Images, video, gradients' },
    { id: 'music', label: 'Music Player', desc: 'Tracks, playlists, settings' },
    { id: 'effects', label: 'Visual Effects', desc: 'Particles, cursor, animations' },
    { id: 'social', label: 'Social Links', desc: 'Add, edit, reorder links' },
    { id: 'advanced', label: 'Advanced Settings', desc: 'SEO, intro, clock, reset' },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-1">Overview</h2>
      <p className="text-sm text-white/40 mb-6">A quick look at your profile configuration</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Palette size={16} style={{ color: accent }} />
            <span className="text-xs text-white/50">Current Theme</span>
          </div>
          <p className="text-lg font-semibold text-white">{draft.appearance.preset}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }} />
            <span className="text-xs text-white/40 font-mono">{accent}</span>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Music size={16} style={{ color: accent }} />
            <span className="text-xs text-white/50">Music Player</span>
          </div>
          <p className="text-lg font-semibold text-white">{draft.musicPlayer.enabled ? 'Enabled' : 'Disabled'}</p>
          <p className="text-xs text-white/40 mt-1">
            {draft.musicPlayer.tracks.length} track{draft.musicPlayer.tracks.length !== 1 ? 's' : ''}
            {draft.musicPlayer.showVisualizer ? ' • Visualizer on' : ''}
          </p>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} style={{ color: accent }} />
            <span className="text-xs text-white/50">Visual Effects</span>
          </div>
          <p className="text-lg font-semibold text-white">{draft.effects.preset}</p>
          <p className="text-xs text-white/40 mt-1">
            {draft.effects.masterEnabled ? 'Active' : 'All effects disabled'}
          </p>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Live Preview</h3>
          <a
            href="/"
            target="_blank"
            className="text-xs flex items-center gap-1.5 hover:text-white/80 transition-colors"
            style={{ color: accent }}
          >
            <Eye size={14} /> Open Profile
          </a>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-black/30">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-2"
            style={{ borderColor: `${accent}40`, backgroundColor: `${accent}15`, color: accent }}>
            {draft.profile.displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white">{draft.profile.displayName}</span>
              {draft.profile.verified && <span className="text-xs" style={{ color: accent }}>✓</span>}
            </div>
            <span className="text-xs text-white/40">{draft.profile.username}</span>
            <p className="text-xs text-white/50 mt-1">{draft.profile.bio}</p>
          </div>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-white mb-3">Quick Links</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sections.map((s) => {
          const Icon = sectionIcons[s.id as keyof typeof sectionIcons] || Settings;
          return (
            <button
              key={s.id}
              onClick={() => onNavigate(s.id)}
              className="glass rounded-xl p-4 text-left hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${accent}10` }}>
                  <Icon size={18} style={{ color: accent }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-white">{s.label}</p>
                  <p className="text-xs text-white/40">{s.desc}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-white/30">
        Save status: {saveStatus === 'idle' ? 'No unsaved changes' : saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'All changes saved' : 'Error saving'}
      </div>
    </div>
  );
}
