import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { SiteConfig } from '@/types/config';
import { defaultConfig } from '@/lib/defaultConfig';
import { supabase } from '@/lib/supabase';

interface ConfigContextValue {
  config: SiteConfig | null;
  draft: SiteConfig | null;
  loading: boolean;
  error: string | null;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  hasExistingConfig: boolean;
  updateDraft: (updater: (draft: SiteConfig) => SiteConfig) => void;
  saveDraft: () => Promise<void>;
  cancelDraft: () => void;
  resetToDefault: () => void;
  loadConfig: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [draft, setDraft] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const loadConfig = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!supabase) {
      setConfig(null);
      setDraft(structuredClone(defaultConfig));
      setLoading(false);
      return;
    }

    try {
      const { data, error: queryError } = await supabase
        .from('site_config')
        .select('config')
        .eq('id', 1)
        .maybeSingle();

      if (queryError) throw queryError;

      if (data?.config) {
        const loadedConfig = data.config as SiteConfig;
        setConfig(loadedConfig);
        setDraft(structuredClone(loadedConfig));
      } else {
        setConfig(null);
        setDraft(structuredClone(defaultConfig));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load configuration';
      setError(msg);
      setConfig(defaultConfig);
      setDraft(structuredClone(defaultConfig));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const updateDraft = useCallback((updater: (draft: SiteConfig) => SiteConfig) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return updater(structuredClone(prev));
    });
    setSaveStatus('idle');
  }, []);

  const saveDraft = useCallback(async () => {
    if (!draft) return;
    setSaveStatus('saving');
    setError(null);

    if (!supabase) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify to save configuration changes.');
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      return;
    }

    try {
      const { data: existing } = await supabase
        .from('site_config')
        .select('id')
        .eq('id', 1)
        .maybeSingle();

      if (existing) {
        const { error: updateError } = await supabase
          .from('site_config')
          .update({ config: draft })
          .eq('id', 1);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('site_config')
          .insert({ id: 1, config: draft });
        if (insertError) throw insertError;
      }

      setConfig(structuredClone(draft));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save configuration';
      setError(msg);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [draft]);

  const cancelDraft = useCallback(() => {
    if (config) {
      setDraft(structuredClone(config));
    } else {
      setDraft(structuredClone(defaultConfig));
    }
    setSaveStatus('idle');
  }, [config]);

  const resetToDefault = useCallback(() => {
    setDraft(structuredClone(defaultConfig));
    setSaveStatus('idle');
  }, []);

  const value: ConfigContextValue = {
    config,
    draft,
    loading,
    error,
    saveStatus,
    hasExistingConfig: config !== null,
    updateDraft,
    saveDraft,
    cancelDraft,
    resetToDefault,
    loadConfig,
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig must be used within ConfigProvider');
  return ctx;
}
