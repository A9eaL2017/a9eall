import { useState } from 'react';
import { useConfig } from '@/context/ConfigContext';
import { AdminCard, AdminField, AdminInput, AdminToggle, AdminSlider, AdminColorInput } from '../AdminUI';
import { Plus, Trash2, GripVertical, Upload, Music } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { MusicTrack } from '@/types/config';

export function MusicSection() {
  const { draft, updateDraft } = useConfig();
  const [uploadingTrackId, setUploadingTrackId] = useState<string | null>(null);
  const [trackUploadErrors, setTrackUploadErrors] = useState<Record<string, string>>({});
  if (!draft) return null;

  const mp = draft.musicPlayer;

  const addTrack = () => {
    const newTrack: MusicTrack = {
      id: crypto.randomUUID(),
      title: 'New Track',
      artist: 'Unknown Artist',
      url: '',
      coverUrl: '',
    };
    updateDraft(d => { d.musicPlayer.tracks.push(newTrack); return d; });
  };

  const removeTrack = (id: string) => {
    updateDraft(d => {
      d.musicPlayer.tracks = d.musicPlayer.tracks.filter(t => t.id !== id);
      if (d.musicPlayer.defaultTrackId === id) d.musicPlayer.defaultTrackId = null;
      return d;
    });
  };

  const moveTrack = (index: number, dir: 'up' | 'down') => {
    updateDraft(d => {
      const tracks = d.musicPlayer.tracks;
      const newIndex = dir === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= tracks.length) return d;
      [tracks[index], tracks[newIndex]] = [tracks[newIndex], tracks[index]];
      return d;
    });
  };

  const updateTrack = (id: string, field: keyof MusicTrack, value: string) => {
    updateDraft(d => {
      const track = d.musicPlayer.tracks.find(t => t.id === id);
      if (track) (track as any)[field] = value;
      return d;
    });
  };

  const uploadCover = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop();
    const fileName = `covers/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('profile-assets').upload(fileName, file);
    if (error) return;
    const { data } = supabase.storage.from('profile-assets').getPublicUrl(fileName);
    updateTrack(id, 'coverUrl', data.publicUrl);
  };

  const uploadAudio = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    setTrackUploadErrors(errors => ({ ...errors, [id]: '' }));
    if (!file.name.toLowerCase().endsWith('.mp3')) {
      setTrackUploadErrors(errors => ({ ...errors, [id]: 'Choose an MP3 audio file.' }));
      input.value = '';
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setTrackUploadErrors(errors => ({ ...errors, [id]: 'MP3 files must be 25 MB or smaller.' }));
      input.value = '';
      return;
    }
    if (!supabase) {
      setTrackUploadErrors(errors => ({ ...errors, [id]: 'Audio storage is not configured.' }));
      input.value = '';
      return;
    }

    setUploadingTrackId(id);
    try {
      const fileName = `tracks/${crypto.randomUUID()}.mp3`;
      const { error } = await supabase.storage.from('profile-assets').upload(fileName, file, {
        contentType: 'audio/mpeg',
      });
      if (error) throw new Error(error.message);

      const { data } = supabase.storage.from('profile-assets').getPublicUrl(fileName);
      updateTrack(id, 'url', data.publicUrl);
    } catch (err) {
      setTrackUploadErrors(errors => ({
        ...errors,
        [id]: err instanceof Error ? err.message : 'MP3 upload failed. Please try again.',
      }));
    } finally {
      setUploadingTrackId(null);
      input.value = '';
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-1">Music Player</h2>
      <p className="text-sm text-white/40 mb-6">Manage your playlist and player settings</p>

      <AdminCard title="Player Settings">
        <AdminToggle label="Enable Music Player" checked={mp.enabled} onChange={v => updateDraft(d => { d.musicPlayer.enabled = v; return d; })} />
        <AdminToggle label="Show Audio Visualizer" checked={mp.showVisualizer} onChange={v => updateDraft(d => { d.musicPlayer.showVisualizer = v; return d; })} />
        <AdminSlider label="Default Volume" value={mp.initialVolume} min={0} max={100} unit="%" onChange={v => updateDraft(d => { d.musicPlayer.initialVolume = v; return d; })} />
        <AdminColorInput label="Player Accent Color" value={mp.accentColor} onChange={v => updateDraft(d => { d.musicPlayer.accentColor = v; return d; })} />
        <AdminField label="Default Track">
          <select
            value={mp.defaultTrackId || ''}
            onChange={e => updateDraft(d => { d.musicPlayer.defaultTrackId = e.target.value || null; return d; })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
          >
            <option value="" className="bg-[#1a1a1a]">First track</option>
            {mp.tracks.map(t => (
              <option key={t.id} value={t.id} className="bg-[#1a1a1a]">{t.title}</option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Player Layout">
          <select
            value={mp.layout}
            onChange={e => updateDraft(d => { d.musicPlayer.layout = e.target.value as 'compact' | 'expanded'; return d; })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
          >
            <option value="compact" className="bg-[#1a1a1a]">Compact</option>
            <option value="expanded" className="bg-[#1a1a1a]">Expanded</option>
          </select>
        </AdminField>
      </AdminCard>

      <AdminCard title="Tracks" description="Add, edit, and reorder your music tracks">
        <div className="space-y-3 mb-3">
          {mp.tracks.length === 0 && (
            <div className="text-center py-8 text-white/30">
              <Music size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No tracks yet. Add your first track below.</p>
            </div>
          )}
          {mp.tracks.map((track, i) => (
            <div key={track.id} className="rounded-xl bg-white/3 border border-white/8 p-3">
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-0.5 pt-1">
                  <button onClick={() => moveTrack(i, 'up')} disabled={i === 0}
                    className="text-white/30 hover:text-white/60 disabled:opacity-20 transition-colors">
                    <GripVertical size={14} className="rotate-180" />
                  </button>
                  <button onClick={() => moveTrack(i, 'down')} disabled={i === mp.tracks.length - 1}
                    className="text-white/30 hover:text-white/60 disabled:opacity-20 transition-colors">
                    <GripVertical size={14} />
                  </button>
                </div>

                <div className="relative flex-shrink-0">
                  {track.coverUrl ? (
                    <img src={track.coverUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                      <Music size={18} className="text-white/30" />
                    </div>
                  )}
                  <label className="absolute inset-0 rounded-lg bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition-opacity">
                    <Upload size={14} className="text-white" />
                    <input type="file" accept="image/*" className="hidden" onChange={e => uploadCover(track.id, e)} />
                  </label>
                </div>

                <div className="flex-1 space-y-2">
                  <AdminInput value={track.title} onChange={e => updateTrack(track.id, 'title', e.target.value)} placeholder="Track title" />
                  <AdminInput value={track.artist} onChange={e => updateTrack(track.id, 'artist', e.target.value)} placeholder="Artist name" />
                  <AdminInput value={track.url} onChange={e => updateTrack(track.id, 'url', e.target.value)} placeholder="Audio URL (https://...)" />
                  <div className="flex items-center gap-3">
                    <label className={`cursor-pointer inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10 ${uploadingTrackId ? 'opacity-50 pointer-events-none' : ''}`}>
                      <Upload size={13} />
                      {uploadingTrackId === track.id ? 'Uploading…' : 'Upload MP3'}
                      <input
                        type="file"
                        accept=".mp3,audio/mpeg"
                        className="hidden"
                        onChange={e => uploadAudio(track.id, e)}
                        disabled={uploadingTrackId !== null}
                      />
                    </label>
                    <span className="text-[10px] text-white/30">MP3, up to 25 MB</span>
                  </div>
                  {trackUploadErrors[track.id] && (
                    <p role="alert" className="text-xs text-red-400">{trackUploadErrors[track.id]}</p>
                  )}
                </div>

                <button onClick={() => removeTrack(track.id)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addTrack}
          className="w-full py-2.5 rounded-xl border border-dashed border-white/15 text-sm text-white/50 hover:text-white/80 hover:border-white/30 transition-colors flex items-center justify-center gap-2">
          <Plus size={16} /> Add Track
        </button>
      </AdminCard>
    </div>
  );
}
