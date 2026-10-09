import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Shuffle, Repeat, Repeat1, ChevronUp, ChevronDown, Music, Loader2 } from 'lucide-react';
import type { MusicPlayerConfig, MusicTrack } from '@/types/config';

function getYouTubeVideoId(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    let videoId: string | null = null;

    if (host === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0] ?? null;
    } else if (['youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com'].includes(host)) {
      if (url.pathname === '/watch') {
        videoId = url.searchParams.get('v');
      } else {
        videoId = url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] ?? null;
      }
    }

    return videoId && /^[A-Za-z0-9_-]{11}$/.test(videoId) ? videoId : null;
  } catch {
    return null;
  }
}

interface MusicPlayerProps {
  config: MusicPlayerConfig;
  isPlaying: boolean;
  onTogglePlay: () => void;
  audioElement: HTMLAudioElement | null;
}

export function MusicPlayer({ config, isPlaying, onTogglePlay, audioElement }: MusicPlayerProps) {
  const [expanded, setExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(config.initialVolume / 100);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(config.shuffle);
  const [repeat, setRepeat] = useState(config.repeat);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(config.defaultTrackId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(Array(24).fill(2));
  const [seeking, setSeeking] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(audioElement);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const visualizerRaf = useRef<number>(0);

  const tracks = config.tracks;
  const currentTrack = tracks.find(t => t.id === currentTrackId) ?? tracks[0] ?? null;
  const youtubeVideoId = currentTrack ? getYouTubeVideoId(currentTrack.url) : null;
  const currentIndex = tracks.findIndex(t => t.id === currentTrackId);

  useEffect(() => {
    if (audioElement) {
      audioRef.current = audioElement;
    }
  }, [audioElement]);

  useEffect(() => {
    setVolume(config.initialVolume / 100);
    setShuffle(config.shuffle);
    setRepeat(config.repeat);
    if (config.defaultTrackId && tracks.find(t => t.id === config.defaultTrackId)) {
      setCurrentTrackId(config.defaultTrackId);
    } else if (tracks.length > 0 && !currentTrackId) {
      setCurrentTrackId(tracks[0].id);
    }
  }, [config.initialVolume, config.shuffle, config.repeat, config.defaultTrackId]);

  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;

    if (getYouTubeVideoId(currentTrack.url)) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
      setCurrentTime(0);
      setDuration(0);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    audioRef.current.src = currentTrack.url;
    audioRef.current.volume = muted ? 0 : volume;

    const onLoaded = () => {
      setDuration(audioRef.current?.duration || 0);
      setIsLoading(false);
      if (isPlaying) {
        audioRef.current?.play().catch(() => {
          setError('Unable to play this track.');
          setIsLoading(false);
        });
      }
    };

    const onTimeUpdate = () => {
      if (!seeking) setCurrentTime(audioRef.current?.currentTime || 0);
    };

    const onEnded = () => handleNext();
    const onError = () => {
      const mediaErrorCode = audioRef.current?.error?.code;
      setError(
        mediaErrorCode === 4
          ? 'This link is not a playable audio file. Use a direct MP3 or other supported audio URL.'
          : 'Could not load this audio file. Check that the link is public and try again.'
      );
      setIsLoading(false);
    };

    audioRef.current.addEventListener('loadedmetadata', onLoaded);
    audioRef.current.addEventListener('timeupdate', onTimeUpdate);
    audioRef.current.addEventListener('ended', onEnded);
    audioRef.current.addEventListener('error', onError);

    return () => {
      audioRef.current?.removeEventListener('loadedmetadata', onLoaded);
      audioRef.current?.removeEventListener('timeupdate', onTimeUpdate);
      audioRef.current?.removeEventListener('ended', onEnded);
      audioRef.current?.removeEventListener('error', onError);
    };
  }, [currentTrack?.id, currentTrack?.url]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  useEffect(() => {
    if (isPlaying && config.showVisualizer && !reducedMotionCheck()) {
      const bars = 24;
      const animate = () => {
        setVisualizerBars(Array.from({ length: bars }, () => Math.random() * 20 + 2));
        visualizerRaf.current = requestAnimationFrame(animate);
      };
      const interval = setInterval(animate, 100);
      return () => clearInterval(interval);
    } else {
      setVisualizerBars(Array(24).fill(2));
    }
  }, [isPlaying, config.showVisualizer]);

  useEffect(() => {
    return () => cancelAnimationFrame(visualizerRaf.current);
  }, []);

  const handleNext = useCallback(() => {
    if (tracks.length === 0) return;
    if (repeat === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }
    let nextIndex: number;
    if (shuffle) {
      do {
        nextIndex = Math.floor(Math.random() * tracks.length);
      } while (tracks.length > 1 && nextIndex === currentIndex);
    } else {
      nextIndex = (currentIndex + 1) % tracks.length;
      if (nextIndex === 0 && repeat === 'off') {
        return;
      }
    }
    setCurrentTrackId(tracks[nextIndex].id);
  }, [tracks, shuffle, repeat, currentIndex]);

  const handlePrev = useCallback(() => {
    if (tracks.length === 0) return;
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    const prevIndex = currentIndex <= 0 ? tracks.length - 1 : currentIndex - 1;
    setCurrentTrackId(tracks[prevIndex].id);
  }, [tracks, currentIndex]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  const toggleRepeat = () => {
    setRepeat(prev => prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off');
  };

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!config.enabled || tracks.length === 0) {
    if (!config.enabled) return null;
    if (tracks.length === 0) return null;
  }

  if (!config.enabled) return null;

  const accentColor = config.accentColor;

  if (youtubeVideoId && currentTrack) {
    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
        style={{ width: '480px', maxWidth: 'calc(100vw - 24px)' }}
      >
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0f0f0f] shadow-2xl">
          <iframe
            key={youtubeVideoId}
            src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?playsinline=1&rel=0`}
            title={currentTrack.title || 'YouTube audio'}
            className="block w-full h-[270px] bg-black"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
          <div className="p-3">
            <p className="text-sm font-medium text-white/90 truncate">{currentTrack.title || 'Now playing'}</p>
            <p className="text-xs text-white/40 truncate">{currentTrack.artist || 'YouTube'}</p>
            {tracks.length > 1 && (
              <select
                aria-label="Choose a track"
                value={currentTrack.id}
                onChange={(event) => setCurrentTrackId(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white"
              >
                {tracks.map((track) => (
                  <option key={track.id} value={track.id}>{track.title} — {track.artist}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 backdrop-blur-md"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setExpanded(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
        style={{ width: expanded ? '420px' : '340px', maxWidth: 'calc(100vw - 24px)' }}
      >
        <div
          className="rounded-2xl backdrop-blur-xl border overflow-hidden"
          style={{
            backgroundColor: `rgba(15, 15, 15, ${0.85 + config.accentColor ? 0 : 0})`,
            borderColor: `rgba(255,255,255,0.08)`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${accentColor}20`,
          }}
        >
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 flex items-center justify-between border-b border-white/5">
                <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Playlist</span>
                <span className="text-xs text-white/40">{tracks.length} tracks</span>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {tracks.map((track, i) => (
                  <button
                    key={track.id}
                    onClick={() => { setCurrentTrackId(track.id); onTogglePlay(); }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors text-left"
                    style={{
                      backgroundColor: track.id === currentTrackId ? `${accentColor}10` : undefined,
                    }}
                  >
                    <span className="text-xs text-white/30 w-5">{i + 1}</span>
                    {track.coverUrl ? (
                      <img src={track.coverUrl} alt="" className="w-8 h-8 rounded object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
                        <Music size={14} style={{ color: accentColor }} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/90 truncate">{track.title}</p>
                      <p className="text-xs text-white/40 truncate">{track.artist}</p>
                    </div>
                    {track.id === currentTrackId && isPlaying && (
                      <div className="flex items-end gap-0.5 h-4">
                        {[3, 6, 4].map((h, idx) => (
                          <div
                            key={idx}
                            className="w-1 rounded-full"
                            style={{
                              height: `${h * 3}px`,
                              backgroundColor: accentColor,
                              animation: `visualizer-bar 0.6s ease-in-out infinite`,
                              animationDelay: `${idx * 0.15}s`,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <div className="p-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                {currentTrack?.coverUrl ? (
                  <motion.img
                    src={currentTrack.coverUrl}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover"
                    animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                    transition={isPlaying ? { duration: 8, repeat: Infinity, ease: 'linear' } : { duration: 0 }}
                  />
                ) : (
                  <motion.div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${accentColor}20` }}
                    animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                    transition={isPlaying ? { duration: 8, repeat: Infinity, ease: 'linear' } : { duration: 0 }}
                  >
                    <Music size={20} style={{ color: accentColor }} />
                  </motion.div>
                )}
                {isPlaying && (
                  <div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      boxShadow: `0 0 15px ${accentColor}60`,
                      animation: 'pulse-glow 2s ease-in-out infinite',
                    }}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/90 truncate">
                  {currentTrack?.title || 'No track'}
                </p>
                <p className="text-xs text-white/40 truncate">
                  {currentTrack?.artist || 'Unknown artist'}
                </p>
              </div>

              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/50 hover:text-white/80"
              >
                {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
            </div>

            <div className="mt-3">
              <div
                ref={progressBarRef}
                className="relative h-1.5 rounded-full cursor-pointer group"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                onClick={handleSeek}
              >
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all"
                  style={{
                    width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                    backgroundColor: accentColor,
                    boxShadow: `0 0 6px ${accentColor}`,
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    left: `${duration ? (currentTime / duration) * 100 : 0}%`,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: accentColor,
                    boxShadow: `0 0 8px ${accentColor}`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-white/30">{formatTime(currentTime)}</span>
                <span className="text-[10px] text-white/30">{formatTime(duration)}</span>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 mt-2 text-center">{error}</p>
            )}

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShuffle(!shuffle)}
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  style={{ color: shuffle ? accentColor : 'rgba(255,255,255,0.4)' }}
                >
                  <Shuffle size={14} />
                </button>
                <button
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/60 hover:text-white/90"
                >
                  <SkipBack size={16} />
                </button>
                <button
                  onClick={onTogglePlay}
                  className="p-2.5 rounded-full transition-all hover:scale-105"
                  style={{
                    backgroundColor: `${accentColor}20`,
                    color: accentColor,
                    boxShadow: `0 0 12px ${accentColor}40`,
                  }}
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : isPlaying ? (
                    <Pause size={18} />
                  ) : (
                    <Play size={18} className="ml-0.5" />
                  )}
                </button>
                <button
                  onClick={handleNext}
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/60 hover:text-white/90"
                >
                  <SkipForward size={16} />
                </button>
                <button
                  onClick={toggleRepeat}
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  style={{ color: repeat !== 'off' ? accentColor : 'rgba(255,255,255,0.4)' }}
                >
                  {repeat === 'one' ? <Repeat1 size={14} /> : <Repeat size={14} />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                {config.showVisualizer && isPlaying && (
                  <div className="flex items-end gap-0.5 h-4 mr-1">
                    {visualizerBars.slice(0, 8).map((h, i) => (
                      <div
                        key={i}
                        className="w-0.5 rounded-full transition-all"
                        style={{
                          height: `${h}px`,
                          backgroundColor: accentColor,
                          opacity: 0.6,
                        }}
                      />
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setMuted(!muted)}
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/50 hover:text-white/80"
                >
                  {muted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
                  className="w-16 h-1 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${accentColor} ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) ${(muted ? 0 : volume) * 100}%)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function reducedMotionCheck() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
