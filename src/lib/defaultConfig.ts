import type { SiteConfig } from '@/types/config';

export const defaultConfig: SiteConfig = {
  profile: {
    avatarUrl: '',
    displayName: 'Your Name',
    username: '@username',
    bio: 'Welcome to my personal space on the web.',
    verified: false,
    status: 'Online',
    statusEnabled: true,
    typingEnabled: false,
    badges: [],
    footerText: '© 2026 Your Name. All rights reserved.',
    liveClockEnabled: false,
    clockTimezone: 'UTC',
    pageViewCounter: false,
  },
  appearance: {
    accentColor: '#80dfff',
    backgroundColor: '#0a0a0a',
    glowIntensity: 50,
    blur: 12,
    shadow: 20,
    transparency: 15,
    fontFamily: 'Inter',
    borderRadius: 16,
    preset: 'Ice',
  },
  background: {
    type: 'gradient',
    imageUrl: '',
    videoUrl: '',
    solidColor: '#0a0a0a',
    gradientFrom: '#0a0a0a',
    gradientTo: '#111827',
    gradientAngle: 135,
    blur: 0,
    brightness: 100,
    overlay: true,
    overlayOpacity: 40,
  },
  musicPlayer: {
    enabled: true,
    tracks: [],
    defaultTrackId: null,
    initialVolume: 60,
    showVisualizer: true,
    layout: 'compact',
    accentColor: '#80dfff',
    autoplay: false,
    shuffle: false,
    repeat: 'off',
  },
  effects: {
    masterEnabled: true,
    preset: 'Cinematic',
    background: {
      particles: { enabled: true, intensity: 50, speed: 30, size: 3, opacity: 60, color: '#80dfff' },
      stars: { enabled: true, intensity: 60, speed: 20, size: 2, opacity: 70, color: '#80dfff' },
      snowfall: { enabled: false, intensity: 50, speed: 30, size: 4, opacity: 80, color: '#ffffff' },
      gradient: { enabled: true, intensity: 40, speed: 20, size: 100, opacity: 30, color: '#80dfff' },
      aurora: { enabled: true, intensity: 50, speed: 15, size: 100, opacity: 25, color: '#80dfff' },
      dust: { enabled: false, intensity: 40, speed: 10, size: 2, opacity: 50, color: '#80dfff' },
    },
    profile: {
      glowingBorder: { enabled: true, intensity: 50, speed: 30, size: 4, opacity: 80, color: '#80dfff' },
      gradientBorder: { enabled: true, intensity: 60, speed: 40, size: 2, opacity: 90, color: '#80dfff' },
      neonGlow: { enabled: true, intensity: 40, speed: 20, size: 20, opacity: 50, color: '#80dfff' },
      entranceAnimation: { enabled: true, intensity: 50, speed: 50, size: 100, opacity: 100, color: '#80dfff' },
      floatingOrbs: { enabled: false, intensity: 40, speed: 20, size: 30, opacity: 40, color: '#80dfff' },
      textGlow: { enabled: true, intensity: 40, speed: 20, size: 10, opacity: 60, color: '#80dfff' },
      typingAnimation: { enabled: false, intensity: 50, speed: 50, size: 100, opacity: 100, color: '#80dfff' },
      hoverTilt: { enabled: true, intensity: 30, speed: 50, size: 100, opacity: 100, color: '#80dfff' },
      socialHover: { enabled: true, intensity: 50, speed: 30, size: 100, opacity: 80, color: '#80dfff' },
    },
    cursor: {
      customCursor: { enabled: false, intensity: 50, speed: 50, size: 20, opacity: 100, color: '#80dfff' },
      cursorDot: { enabled: true, intensity: 50, speed: 50, size: 8, opacity: 80, color: '#80dfff' },
      cursorTrail: { enabled: false, intensity: 40, speed: 50, size: 6, opacity: 50, color: '#80dfff' },
      cursorParticles: { enabled: false, intensity: 40, speed: 30, size: 4, opacity: 60, color: '#80dfff' },
    },
    interface: {
      pageTransitions: { enabled: true, intensity: 50, speed: 50, size: 100, opacity: 100, color: '#80dfff' },
      fadeIn: { enabled: true, intensity: 50, speed: 50, size: 100, opacity: 100, color: '#80dfff' },
      buttonGlow: { enabled: true, intensity: 50, speed: 30, size: 100, opacity: 70, color: '#80dfff' },
      scaleHover: { enabled: true, intensity: 30, speed: 50, size: 100, opacity: 100, color: '#80dfff' },
      animatedBorders: { enabled: false, intensity: 40, speed: 30, size: 100, opacity: 60, color: '#80dfff' },
      glassmorphism: { enabled: true, intensity: 50, speed: 50, size: 100, opacity: 50, color: '#80dfff' },
      loadingAnimation: { enabled: true, intensity: 50, speed: 50, size: 100, opacity: 100, color: '#80dfff' },
    },
  },
  socialLinks: [
    { id: '1', platform: 'twitter', label: 'Twitter', url: 'https://twitter.com', icon: 'Twitter', color: '#1DA1F2' },
    { id: '2', platform: 'github', label: 'GitHub', url: 'https://github.com', icon: 'Github', color: '#ffffff' },
    { id: '3', platform: 'discord', label: 'Discord', url: 'https://discord.com', icon: 'MessageCircle', color: '#5865F2' },
  ],
  advanced: {
    browserTitle: 'My Profile',
    favicon: '',
    seoTitle: 'My Profile',
    seoDescription: 'My personal profile website.',
    reducedMotion: false,
    introSettings: {
      enabled: true,
      text: 'CLICK TO ENTER',
      subtitle: 'Welcome to my world',
      soundEnabled: true,
    },
  },
};

export const effectPresets: Record<string, { name: string; description: string; apply: (config: SiteConfig) => SiteConfig }> = {
  Minimal: {
    name: 'Minimal',
    description: 'Clean and simple with subtle effects',
    apply: (config) => {
      const c = structuredClone(config);
      c.effects.preset = 'Minimal';
      c.effects.background = {
        particles: { enabled: false, intensity: 30, speed: 20, size: 3, opacity: 40, color: c.appearance.accentColor },
        stars: { enabled: false, intensity: 30, speed: 15, size: 2, opacity: 50, color: c.appearance.accentColor },
        snowfall: { enabled: false, intensity: 30, speed: 20, size: 3, opacity: 60, color: '#ffffff' },
        gradient: { enabled: true, intensity: 20, speed: 10, size: 100, opacity: 15, color: c.appearance.accentColor },
        aurora: { enabled: false, intensity: 20, speed: 10, size: 100, opacity: 10, color: c.appearance.accentColor },
        dust: { enabled: false, intensity: 20, speed: 8, size: 2, opacity: 30, color: c.appearance.accentColor },
      };
      c.effects.profile = {
        glowingBorder: { enabled: false, intensity: 30, speed: 20, size: 3, opacity: 60, color: c.appearance.accentColor },
        gradientBorder: { enabled: false, intensity: 30, speed: 20, size: 2, opacity: 70, color: c.appearance.accentColor },
        neonGlow: { enabled: false, intensity: 20, speed: 15, size: 15, opacity: 40, color: c.appearance.accentColor },
        entranceAnimation: { enabled: true, intensity: 40, speed: 40, size: 100, opacity: 100, color: c.appearance.accentColor },
        floatingOrbs: { enabled: false, intensity: 20, speed: 15, size: 20, opacity: 30, color: c.appearance.accentColor },
        textGlow: { enabled: false, intensity: 20, speed: 15, size: 8, opacity: 40, color: c.appearance.accentColor },
        typingAnimation: { enabled: false, intensity: 40, speed: 40, size: 100, opacity: 100, color: c.appearance.accentColor },
        hoverTilt: { enabled: false, intensity: 20, speed: 40, size: 100, opacity: 100, color: c.appearance.accentColor },
        socialHover: { enabled: true, intensity: 30, speed: 20, size: 100, opacity: 60, color: c.appearance.accentColor },
      };
      c.effects.cursor = {
        customCursor: { enabled: false, intensity: 30, speed: 40, size: 15, opacity: 80, color: c.appearance.accentColor },
        cursorDot: { enabled: false, intensity: 30, speed: 40, size: 6, opacity: 60, color: c.appearance.accentColor },
        cursorTrail: { enabled: false, intensity: 20, speed: 40, size: 5, opacity: 40, color: c.appearance.accentColor },
        cursorParticles: { enabled: false, intensity: 20, speed: 20, size: 3, opacity: 40, color: c.appearance.accentColor },
      };
      return c;
    },
  },
  Ice: {
    name: 'Ice',
    description: 'Cool blue tones with crisp glows',
    apply: (config) => {
      const c = structuredClone(config);
      c.appearance.accentColor = '#80dfff';
      c.effects.preset = 'Ice';
      return c;
    },
  },
  Neon: {
    name: 'Neon',
    description: 'Vibrant glows and bold effects',
    apply: (config) => {
      const c = structuredClone(config);
      c.appearance.accentColor = '#00ff88';
      c.effects.preset = 'Neon';
      c.effects.background.particles.enabled = true;
      c.effects.background.particles.intensity = 70;
      c.effects.background.aurora.enabled = true;
      c.effects.background.aurora.intensity = 60;
      c.effects.profile.neonGlow.enabled = true;
      c.effects.profile.neonGlow.intensity = 70;
      c.effects.profile.gradientBorder.enabled = true;
      c.effects.profile.gradientBorder.intensity = 80;
      c.effects.profile.textGlow.enabled = true;
      c.effects.profile.textGlow.intensity = 60;
      return c;
    },
  },
  Aurora: {
    name: 'Aurora',
    description: 'Flowing colorful background waves',
    apply: (config) => {
      const c = structuredClone(config);
      c.appearance.accentColor = '#80dfff';
      c.effects.preset = 'Aurora';
      c.effects.background.aurora.enabled = true;
      c.effects.background.aurora.intensity = 70;
      c.effects.background.aurora.opacity = 40;
      c.effects.background.gradient.enabled = true;
      c.effects.background.gradient.intensity = 50;
      c.effects.background.dust.enabled = true;
      return c;
    },
  },
  Cinematic: {
    name: 'Cinematic',
    description: 'Dramatic and immersive full experience',
    apply: (config) => {
      const c = structuredClone(config);
      c.appearance.accentColor = '#80dfff';
      c.effects.preset = 'Cinematic';
      c.effects.background.particles.enabled = true;
      c.effects.background.stars.enabled = true;
      c.effects.background.aurora.enabled = true;
      c.effects.profile.glowingBorder.enabled = true;
      c.effects.profile.gradientBorder.enabled = true;
      c.effects.profile.neonGlow.enabled = true;
      c.effects.profile.entranceAnimation.enabled = true;
      c.effects.profile.hoverTilt.enabled = true;
      c.effects.profile.textGlow.enabled = true;
      c.effects.cursor.cursorDot.enabled = true;
      return c;
    },
  },
};

export const appearancePresets: Record<string, { name: string; apply: (config: SiteConfig) => Partial<SiteConfig['appearance']> }> = {
  Ice: {
    name: 'Ice',
    apply: () => ({
      accentColor: '#80dfff',
      backgroundColor: '#0a0a0a',
      glowIntensity: 50,
      blur: 12,
      shadow: 20,
      transparency: 15,
      borderRadius: 16,
      preset: 'Ice',
    }),
  },
  Neon: {
    name: 'Neon',
    apply: () => ({
      accentColor: '#00ff88',
      backgroundColor: '#080808',
      glowIntensity: 70,
      blur: 8,
      shadow: 30,
      transparency: 10,
      borderRadius: 12,
      preset: 'Neon',
    }),
  },
  Aurora: {
    name: 'Aurora',
    apply: () => ({
      accentColor: '#80dfff',
      backgroundColor: '#0a0a12',
      glowIntensity: 40,
      blur: 16,
      shadow: 15,
      transparency: 20,
      borderRadius: 20,
      preset: 'Aurora',
    }),
  },
  Minimal: {
    name: 'Minimal',
    apply: () => ({
      accentColor: '#80dfff',
      backgroundColor: '#0c0c0c',
      glowIntensity: 20,
      blur: 8,
      shadow: 10,
      transparency: 10,
      borderRadius: 8,
      preset: 'Minimal',
    }),
  },
  Cinematic: {
    name: 'Cinematic',
    apply: () => ({
      accentColor: '#80dfff',
      backgroundColor: '#080808',
      glowIntensity: 60,
      blur: 14,
      shadow: 25,
      transparency: 18,
      borderRadius: 16,
      preset: 'Cinematic',
    }),
  },
};
