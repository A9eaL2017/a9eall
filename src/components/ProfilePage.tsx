import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Twitter, Github, Instagram, Youtube, Linkedin, Globe, Mail,
  MessageCircle, Twitch, Send, BookOpen, Dribbble, Headphones,
  BadgeCheck, Clock, Eye, ChevronDown
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { SiteConfig } from '@/types/config';
import { EffectsRenderer } from '@/components/effects/EffectsRenderer';
import { CursorEffects } from '@/components/effects/CursorEffects';
import { FloatingOrbs, TypingText } from '@/components/effects/ProfileEffects';
import { MusicPlayer } from '@/components/MusicPlayer';
import { IntroOverlay } from '@/components/IntroOverlay';

const iconMap: Record<string, LucideIcon> = {
  Twitter, Github, Instagram, Youtube, Linkedin, Globe, Mail,
  MessageCircle, Twitch, Send, BookOpen, Dribbble, Headphones,
};

interface ProfilePageProps {
  config: SiteConfig;
}

export function ProfilePage({ config }: ProfilePageProps) {
  const [entered, setEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clock, setClock] = useState('');
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const audioRef = useRef<HTMLAudioElement>(null);

  const { profile, appearance, background, musicPlayer, effects, socialLinks, advanced } = config;
  const accentColor = appearance.accentColor;
  const reducedMotion = advanced.reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    document.title = advanced.browserTitle || 'Profile';
    if (advanced.seoDescription) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', advanced.seoDescription);
    }
    if (advanced.seoTitle) {
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', advanced.seoTitle);
    }
  }, [advanced.browserTitle, advanced.seoDescription, advanced.seoTitle]);

  useEffect(() => {
    if (!profile.liveClockEnabled || !entered) return;
    const updateClock = () => {
      try {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', {
          timeZone: profile.clockTimezone || 'UTC',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        setClock(timeStr);
      } catch {
        setClock(new Date().toLocaleTimeString());
      }
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [profile.liveClockEnabled, profile.clockTimezone, entered]);

  useEffect(() => {
    if (!profile.pageViewCounter || !entered) return;
    const key = 'profile_view_count';
    const current = parseInt(localStorage.getItem(key) || '0', 10);
    const newCount = current + 1;
    localStorage.setItem(key, newCount.toString());
    setViewCount(newCount);
  }, [profile.pageViewCounter, entered]);

  const handleTogglePlay = useCallback(() => {
    if (!audioRef.current || musicPlayer.tracks.length === 0) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        // Autoplay might be blocked
      });
    }
  }, [isPlaying, musicPlayer.tracks.length]);

  const handleEnter = useCallback(() => {
    setEntered(true);
    if (musicPlayer.enabled && musicPlayer.tracks.length > 0 && audioRef.current) {
      audioRef.current.volume = musicPlayer.initialVolume / 100;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        // Autoplay might still be blocked despite user interaction
      });
    }
  }, [musicPlayer]);

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!effects.profile.hoverTilt.enabled || reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const intensity = effects.profile.hoverTilt.intensity / 100 * 10;
    setTilt({ x: -y * intensity, y: x * intensity });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  const bgStyle: React.CSSProperties = {};
  if (background.type === 'solid') {
    bgStyle.backgroundColor = background.solidColor;
  } else if (background.type === 'gradient') {
    bgStyle.background = `linear-gradient(${background.gradientAngle}deg, ${background.gradientFrom}, ${background.gradientTo})`;
  } else if (background.type === 'image' && background.imageUrl) {
    bgStyle.backgroundImage = `url(${background.imageUrl})`;
    bgStyle.backgroundSize = 'cover';
    bgStyle.backgroundPosition = 'center';
    bgStyle.filter = `blur(${background.blur}px) brightness(${background.brightness}%)`;
  }

  const showBorderGlow = effects.profile.glowingBorder.enabled && !reducedMotion;
  const showGradientBorder = effects.profile.gradientBorder.enabled && !reducedMotion;
  const showNeonGlow = effects.profile.neonGlow.enabled && !reducedMotion;
  const showGlassmorphism = effects.interface.glassmorphism.enabled;

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: appearance.backgroundColor }}>
      <audio ref={audioRef} />

      {/* Background layer */}
      <div className="fixed inset-0" style={{ zIndex: 0, ...bgStyle }} />
      {background.type === 'video' && background.videoUrl && (
        <video
          className="fixed inset-0 w-full h-full object-cover"
          style={{ zIndex: 0, filter: `blur(${background.blur}px) brightness(${background.brightness}%)` }}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={background.videoUrl} />
        </video>
      )}
      {background.overlay && (
        <div
          className="fixed inset-0"
          style={{
            zIndex: 0,
            backgroundColor: `rgba(0,0,0,${background.overlayOpacity / 100})`,
          }}
        />
      )}

      {/* Effects layer */}
      <EffectsRenderer effects={effects} reducedMotion={reducedMotion} />

      {/* Intro overlay */}
      {!entered && advanced.introSettings.enabled && (
        <IntroOverlay
          config={advanced.introSettings}
          accentColor={accentColor}
          onEnter={handleEnter}
        />
      )}

      {/* Main content */}
      {(entered || !advanced.introSettings.enabled) && (
        <motion.div
          className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8"
          initial={effects.profile.entranceAnimation.enabled && !reducedMotion ? { opacity: 0, y: 30 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Floating orbs */}
          <FloatingOrbs effect={effects.profile.floatingOrbs} reducedMotion={reducedMotion} />

          <div
            className="relative w-full max-w-md"
            onMouseMove={handleTilt}
            onMouseLeave={resetTilt}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.1s ease-out',
            }}
          >
            {/* Gradient border effect */}
            {showGradientBorder && (
              <div
                className="absolute -inset-px rounded-3xl overflow-hidden"
                style={{ zIndex: -1 }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `conic-gradient(from 0deg, ${accentColor}, transparent, ${accentColor}, transparent, ${accentColor})`,
                    animation: `gradient-border-spin ${10 / (effects.profile.gradientBorder.speed / 50)}s linear infinite`,
                  }}
                />
              </div>
            )}

            <div
              className={`relative rounded-3xl overflow-hidden ${showGlassmorphism ? 'glass-strong' : ''}`}
              style={{
                backgroundColor: showGlassmorphism ? undefined : `rgba(15,15,15,${0.85 - appearance.transparency / 100})`,
                border: `1px solid ${showBorderGlow ? accentColor + '30' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: `${appearance.borderRadius}px`,
                boxShadow: showNeonGlow
                  ? `0 0 ${effects.profile.neonGlow.size}px ${accentColor}30, 0 8px 32px rgba(0,0,0,0.5)`
                  : `0 8px 32px rgba(0,0,0,0.5)`,
              }}
            >
              <div className="p-6 md:p-8">
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    {showBorderGlow && (
                      <div
                        className="absolute -inset-1 rounded-full"
                        style={{
                          background: `radial-gradient(circle, ${accentColor}${Math.floor(effects.profile.glowingBorder.opacity * 2.55).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
                          animation: 'pulse-glow 2s ease-in-out infinite',
                        }}
                      />
                    )}
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.displayName}
                        className="relative w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2"
                        style={{
                          borderColor: `${accentColor}40`,
                          boxShadow: showBorderGlow ? `0 0 15px ${accentColor}60` : undefined,
                        }}
                      />
                    ) : (
                      <div
                        className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-2xl font-bold border-2"
                        style={{
                          borderColor: `${accentColor}40`,
                          backgroundColor: `${accentColor}15`,
                          color: accentColor,
                          boxShadow: showBorderGlow ? `0 0 15px ${accentColor}60` : undefined,
                        }}
                      >
                        {profile.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Name + verified */}
                <div className="text-center mb-1">
                  <div className="flex items-center justify-center gap-2">
                    <h1
                      className="text-xl md:text-2xl font-bold text-white"
                      style={effects.profile.textGlow.enabled && !reducedMotion ? {
                        textShadow: `0 0 ${effects.profile.textGlow.size}px ${accentColor}`,
                      } : undefined}
                    >
                      {profile.displayName}
                    </h1>
                    {profile.verified && (
                      <BadgeCheck size={20} style={{ color: accentColor }} className="flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-white/40 mt-0.5">{profile.username}</p>
                </div>

                {/* Status */}
                {profile.statusEnabled && (
                  <div className="flex justify-center mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-white/50">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: accentColor,
                          boxShadow: `0 0 6px ${accentColor}`,
                          animation: 'pulse-glow 2s ease-in-out infinite',
                        }}
                      />
                      {profile.status}
                    </div>
                  </div>
                )}

                {/* Bio */}
                <p className="text-center text-sm text-white/60 mb-4 leading-relaxed px-2">
                  {profile.typingEnabled ? (
                    <TypingText
                      text={profile.bio}
                      effect={effects.profile.typingAnimation}
                    />
                  ) : profile.bio}
                </p>

                {/* Badges */}
                {profile.badges.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {profile.badges.map((badge, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: `${accentColor}15`,
                          color: accentColor,
                          border: `1px solid ${accentColor}30`,
                        }}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                {/* Social links */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {socialLinks.map((link) => {
                    const Icon = iconMap[link.icon] || Globe;
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative p-2.5 rounded-xl transition-all duration-300 hover:scale-110"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                        onMouseEnter={(e) => {
                          if (effects.profile.socialHover.enabled && !reducedMotion) {
                            e.currentTarget.style.boxShadow = `0 0 15px ${link.color || accentColor}60`;
                            e.currentTarget.style.borderColor = `${link.color || accentColor}40`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                        }}
                        title={link.label}
                      >
                        <Icon
                          size={18}
                          className="text-white/60 group-hover:text-white transition-colors"
                          style={{ '--group-hover-color': link.color } as React.CSSProperties}
                        />
                      </a>
                    );
                  })}
                </div>

                {/* Live clock + view counter */}
                <div className="flex items-center justify-center gap-4 mb-2">
                  {profile.liveClockEnabled && clock && (
                    <div className="flex items-center gap-1.5 text-xs text-white/40">
                      <Clock size={12} />
                      <span>{clock}</span>
                    </div>
                  )}
                  {profile.pageViewCounter && viewCount !== null && (
                    <div className="flex items-center gap-1.5 text-xs text-white/40">
                      <Eye size={12} />
                      <span>{viewCount} views</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              {profile.footerText && (
                <div
                  className="px-6 py-3 border-t text-center"
                  style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                >
                  <p className="text-xs text-white/30">{profile.footerText}</p>
                </div>
              )}
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-8 text-white/20"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      )}

      {/* Music player */}
      {entered && musicPlayer.enabled && musicPlayer.tracks.length > 0 && (
        <MusicPlayer
          config={musicPlayer}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          audioElement={audioRef.current}
        />
      )}

      {/* Cursor effects (always rendered, respects enable flags) */}
      <CursorEffects
        dot={effects.cursor.cursorDot}
        trail={effects.cursor.cursorTrail}
        particles={effects.cursor.cursorParticles}
        customCursor={effects.cursor.customCursor}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}
