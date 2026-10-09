import { useConfig } from '@/context/ConfigContext';
import { AdminCard, AdminField, AdminInput, AdminColorInput } from '../AdminUI';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { SocialLink } from '@/types/config';

const iconOptions = [
  'Twitter', 'Github', 'Instagram', 'Youtube', 'Linkedin', 'Globe',
  'Mail', 'MessageCircle', 'Twitch', 'Send', 'BookOpen', 'Dribbble', 'Headphones',
];

export function SocialSection() {
  const { draft, updateDraft } = useConfig();
  if (!draft) return null;

  const links = draft.socialLinks;

  const addLink = () => {
    const newLink: SocialLink = {
      id: crypto.randomUUID(),
      platform: 'globe',
      label: 'New Link',
      url: 'https://',
      icon: 'Globe',
      color: '#80dfff',
    };
    updateDraft(d => { d.socialLinks.push(newLink); return d; });
  };

  const removeLink = (id: string) => {
    updateDraft(d => { d.socialLinks = d.socialLinks.filter(l => l.id !== id); return d; });
  };

  const updateLink = (id: string, field: keyof SocialLink, value: string) => {
    updateDraft(d => {
      const link = d.socialLinks.find(l => l.id === id);
      if (link) (link as any)[field] = value;
      return d;
    });
  };

  const moveLink = (index: number, dir: 'up' | 'down') => {
    updateDraft(d => {
      const arr = d.socialLinks;
      const newIndex = dir === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= arr.length) return d;
      [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      return d;
    });
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-1">Social Links</h2>
      <p className="text-sm text-white/40 mb-6">Manage the social icons on your profile</p>

      <AdminCard title="Links">
        <div className="space-y-3 mb-3">
          {links.map((link, i) => (
            <div key={link.id} className="rounded-xl bg-white/3 border border-white/8 p-3">
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-0.5 pt-1">
                  <button onClick={() => moveLink(i, 'up')} disabled={i === 0}
                    className="text-white/30 hover:text-white/60 disabled:opacity-20 transition-colors">
                    <GripVertical size={14} className="rotate-180" />
                  </button>
                  <button onClick={() => moveLink(i, 'down')} disabled={i === links.length - 1}
                    className="text-white/30 hover:text-white/60 disabled:opacity-20 transition-colors">
                    <GripVertical size={14} />
                  </button>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-2">
                  <AdminField label="Label">
                    <AdminInput value={link.label} onChange={e => updateLink(link.id, 'label', e.target.value)} />
                  </AdminField>
                  <AdminField label="URL">
                    <AdminInput value={link.url} onChange={e => updateLink(link.id, 'url', e.target.value)} />
                  </AdminField>
                  <AdminField label="Icon">
                    <select
                      value={link.icon}
                      onChange={e => updateLink(link.id, 'icon', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                    >
                      {iconOptions.map(ic => (
                        <option key={ic} value={ic} className="bg-[#1a1a1a]">{ic}</option>
                      ))}
                    </select>
                  </AdminField>
                  <AdminField label="Color">
                    <div className="flex items-center gap-2">
                      <input type="color" value={link.color} onChange={e => updateLink(link.id, 'color', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-white/10" />
                      <AdminInput value={link.color} onChange={e => updateLink(link.id, 'color', e.target.value)} />
                    </div>
                  </AdminField>
                </div>

                <button onClick={() => removeLink(link.id)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addLink}
          className="w-full py-2.5 rounded-xl border border-dashed border-white/15 text-sm text-white/50 hover:text-white/80 hover:border-white/30 transition-colors flex items-center justify-center gap-2">
          <Plus size={16} /> Add Link
        </button>
      </AdminCard>
    </div>
  );
}
