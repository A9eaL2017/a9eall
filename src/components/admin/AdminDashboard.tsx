import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, User, Palette, Image, Music, Sparkles,
  Link as LinkIcon, Settings, LogOut, Eye, Menu, X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useConfig } from '@/context/ConfigContext';
import { SaveBar } from './AdminUI';
import { AdminOverview } from './sections/Overview';
import { ProfileEditor } from './sections/ProfileEditor';
import { AppearanceSection } from './sections/AppearanceSection';
import { BackgroundSection } from './sections/BackgroundSection';
import { MusicSection } from './sections/MusicSection';
import { EffectsSection } from './sections/EffectsSection';
import { SocialSection } from './sections/SocialSection';
import { AdvancedSection } from './sections/AdvancedSection';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile Editor', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'background', label: 'Background', icon: Image },
  { id: 'music', label: 'Music Player', icon: Music },
  { id: 'effects', label: 'Visual Effects', icon: Sparkles },
  { id: 'social', label: 'Social Links', icon: LinkIcon },
  { id: 'advanced', label: 'Advanced Settings', icon: Settings },
];

export function AdminDashboard() {
  const { signOut } = useAuth();
  const { draft, loading } = useConfig();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return <AdminOverview onNavigate={handleNavigate} />;
      case 'profile': return <ProfileEditor />;
      case 'appearance': return <AppearanceSection />;
      case 'background': return <BackgroundSection />;
      case 'music': return <MusicSection />;
      case 'effects': return <EffectsSection />;
      case 'social': return <SocialSection />;
      case 'advanced': return <AdvancedSection />;
      default: return <AdminOverview onNavigate={handleNavigate} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-white/30 text-sm">Loading configuration...</div>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="text-white/40 text-sm mb-2">No configuration found</div>
          <p className="text-white/30 text-xs">Save changes in any section to create your initial config</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-white/5 bg-[#0c0c0c] fixed h-full z-30">
        <div className="p-4 border-b border-white/5">
          <a href="/" className="text-sm font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#80dfff]/10 border border-[#80dfff]/20 flex items-center justify-center">
              <Sparkles size={16} className="text-[#80dfff]" />
            </div>
            Dashboard
          </a>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors mb-0.5"
                style={{
                  backgroundColor: activeSection === item.id ? 'rgba(128,223,255,0.08)' : 'transparent',
                  color: activeSection === item.id ? '#80dfff' : 'rgba(255,255,255,0.5)',
                }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-2 border-t border-white/5">
          <a href="/" target="_blank" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:bg-white/5 transition-colors">
            <Eye size={16} /> View Profile
          </a>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:bg-white/5 transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed left-0 top-0 bottom-0 w-60 bg-[#0c0c0c] border-r border-white/5 z-50 md:hidden flex flex-col"
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <span className="text-sm font-bold text-white">Dashboard</span>
                <button onClick={() => setSidebarOpen(false)} className="text-white/40 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-2">
                {navItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors mb-0.5"
                      style={{
                        backgroundColor: activeSection === item.id ? 'rgba(128,223,255,0.08)' : 'transparent',
                        color: activeSection === item.id ? '#80dfff' : 'rgba(255,255,255,0.5)',
                      }}
                    >
                      <Icon size={16} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
              <div className="p-2 border-t border-white/5">
                <a href="/" target="_blank" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:bg-white/5">
                  <Eye size={16} /> View Profile
                </a>
                <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:bg-white/5">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Mobile header */}
        <div className="md:hidden sticky top-0 z-20 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 p-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-white/60 hover:text-white">
            <Menu size={20} />
          </button>
          <span className="text-sm font-medium text-white">Dashboard</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>

        <SaveBar />
      </div>
    </div>
  );
}
