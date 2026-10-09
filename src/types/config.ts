export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon: string;
  color: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverUrl: string;
  duration?: number;
}

export interface MusicPlayerConfig {
  enabled: boolean;
  tracks: MusicTrack[];
  defaultTrackId: string | null;
  initialVolume: number;
  showVisualizer: boolean;
  layout: 'compact' | 'expanded';
  accentColor: string;
  autoplay: boolean;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
}

export interface BackgroundConfig {
  type: 'image' | 'video' | 'gradient' | 'solid';
  imageUrl: string;
  videoUrl: string;
  solidColor: string;
  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;
  blur: number;
  brightness: number;
  overlay: boolean;
  overlayOpacity: number;
}

export interface EffectConfig {
  enabled: boolean;
  intensity: number;
  speed: number;
  size: number;
  opacity: number;
  color: string;
}

export interface EffectsConfig {
  masterEnabled: boolean;
  preset: string;
  background: {
    particles: EffectConfig;
    stars: EffectConfig;
    snowfall: EffectConfig;
    gradient: EffectConfig;
    aurora: EffectConfig;
    dust: EffectConfig;
  };
  profile: {
    glowingBorder: EffectConfig;
    gradientBorder: EffectConfig;
    neonGlow: EffectConfig;
    entranceAnimation: EffectConfig;
    floatingOrbs: EffectConfig;
    textGlow: EffectConfig;
    typingAnimation: EffectConfig;
    hoverTilt: EffectConfig;
    socialHover: EffectConfig;
  };
  cursor: {
    customCursor: EffectConfig;
    cursorDot: EffectConfig;
    cursorTrail: EffectConfig;
    cursorParticles: EffectConfig;
  };
  interface: {
    pageTransitions: EffectConfig;
    fadeIn: EffectConfig;
    buttonGlow: EffectConfig;
    scaleHover: EffectConfig;
    animatedBorders: EffectConfig;
    glassmorphism: EffectConfig;
    loadingAnimation: EffectConfig;
  };
}

export interface ProfileConfig {
  avatarUrl: string;
  displayName: string;
  username: string;
  bio: string;
  verified: boolean;
  status: string;
  statusEnabled: boolean;
  typingEnabled: boolean;
  badges: string[];
  footerText: string;
  liveClockEnabled: boolean;
  clockTimezone: string;
  pageViewCounter: boolean;
}

export interface AppearanceConfig {
  accentColor: string;
  backgroundColor: string;
  glowIntensity: number;
  blur: number;
  shadow: number;
  transparency: number;
  transparentCard: boolean;
  fontFamily: string;
  borderRadius: number;
  preset: string;
}

export interface IntroConfig {
  enabled: boolean;
  text: string;
  subtitle: string;
  soundEnabled: boolean;
}

export interface AdvancedConfig {
  browserTitle: string;
  favicon: string;
  seoTitle: string;
  seoDescription: string;
  reducedMotion: boolean;
  introSettings: IntroConfig;
}

export interface SiteConfig {
  profile: ProfileConfig;
  appearance: AppearanceConfig;
  background: BackgroundConfig;
  musicPlayer: MusicPlayerConfig;
  effects: EffectsConfig;
  socialLinks: SocialLink[];
  advanced: AdvancedConfig;
}
