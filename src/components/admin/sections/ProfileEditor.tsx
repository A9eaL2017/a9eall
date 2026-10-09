import { useState } from 'react';
import { useConfig } from '@/context/ConfigContext';
import { AdminCard, AdminField, AdminInput, AdminTextarea, AdminToggle } from '../AdminUI';
import { Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function ProfileEditor() {
  const { draft, updateDraft } = useConfig();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  if (!draft) return null;

  const p = draft.profile;

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);
    if (!allowedTypes.has(file.type)) throw new Error('Choose a JPG, PNG, WebP, GIF, or AVIF image.');
    if (file.size > 25 * 1024 * 1024) throw new Error('Image must be 25 MB or smaller.');
    if (!supabase) throw new Error('Image storage is not configured. Please contact the site owner.');

    const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'img';
    const fileName = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from('profile-assets').upload(fileName, file);
    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from('profile-assets').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadFile(file, 'avatars');
      updateDraft(d => { d.profile.avatarUrl = url; return d; });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Avatar upload failed. Please try again.');
    } finally {
      setUploading(false);
      input.value = '';
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-1">Profile Editor</h2>
      <p className="text-sm text-white/40 mb-6">Customize your profile information</p>

      <AdminCard title="Avatar" description="Upload a profile picture">
        <div className="flex items-center gap-4">
          {p.avatarUrl ? (
            <img src={p.avatarUrl} alt="" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 text-xl">
              {p.displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <label className="cursor-pointer">
            <span className={`px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 transition-colors flex items-center gap-2 ${uploading ? 'opacity-50' : ''}`}>
              <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload Image'}
            </span>
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
          </label>
          {uploadError && <p role="alert" className="text-xs text-red-400">{uploadError}</p>}
          </label>
        </div>
      </AdminCard>

      <AdminCard title="Identity">
        <AdminField label="Display Name">
          <AdminInput value={p.displayName} onChange={e => updateDraft(d => { d.profile.displayName = e.target.value; return d; })} />
        </AdminField>
        <AdminField label="Username">
          <AdminInput value={p.username} onChange={e => updateDraft(d => { d.profile.username = e.target.value; return d; })} />
        </AdminField>
        <AdminToggle label="Verified Badge" checked={p.verified} onChange={v => updateDraft(d => { d.profile.verified = v; return d; })} />
      </AdminCard>

      <AdminCard title="About">
        <AdminField label="Biography">
          <AdminTextarea rows={3} value={p.bio} onChange={e => updateDraft(d => { d.profile.bio = e.target.value; return d; })} />
        </AdminField>
        <AdminToggle label="Typing Animation" checked={p.typingEnabled} onChange={v => updateDraft(d => { d.profile.typingEnabled = v; return d; })} hint="Animate the bio with a typing effect" />
      </AdminCard>

      <AdminCard title="Status">
        <AdminToggle label="Show Status Indicator" checked={p.statusEnabled} onChange={v => updateDraft(d => { d.profile.statusEnabled = v; return d; })} />
        {p.statusEnabled && (
          <AdminField label="Status Text">
            <AdminInput value={p.status} onChange={e => updateDraft(d => { d.profile.status = e.target.value; return d; })} />
          </AdminField>
        )}
      </AdminCard>

      <AdminCard title="Badges" description="Add decorative text badges to your profile">
        <div className="space-y-2 mb-3">
          {p.badges.map((badge, i) => (
            <div key={i} className="flex items-center gap-2">
              <AdminInput value={badge} onChange={e => {
                const val = e.target.value;
                updateDraft(d => { d.profile.badges[i] = val; return d; });
              }} />
              <button onClick={() => updateDraft(d => { d.profile.badges.splice(i, 1); return d; })}
                className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-xs">
                Remove
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => updateDraft(d => { d.profile.badges.push('New Badge'); return d; })}
          className="text-xs text-[#80dfff] hover:underline">
          + Add Badge
        </button>
      </AdminCard>

      <AdminCard title="Live Clock">
        <AdminToggle label="Show Live Clock" checked={p.liveClockEnabled} onChange={v => updateDraft(d => { d.profile.liveClockEnabled = v; return d; })} />
        {p.liveClockEnabled && (
          <AdminField label="Timezone" hint="e.g. America/New_York, Europe/London, Asia/Tokyo">
            <AdminInput value={p.clockTimezone} onChange={e => updateDraft(d => { d.profile.clockTimezone = e.target.value; return d; })} />
          </AdminField>
        )}
      </AdminCard>

      <AdminCard title="Page View Counter">
        <AdminToggle label="Show View Counter" checked={p.pageViewCounter} onChange={v => updateDraft(d => { d.profile.pageViewCounter = v; return d; })} hint="Counts visits stored locally in the browser" />
      </AdminCard>

      <AdminCard title="Footer">
        <AdminField label="Footer Text">
          <AdminInput value={p.footerText} onChange={e => updateDraft(d => { d.profile.footerText = e.target.value; return d; })} />
        </AdminField>
      </AdminCard>
    </div>
  );
}
