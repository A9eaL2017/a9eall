import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Shield, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useConfig } from '@/context/ConfigContext';

export function AdminLogin() {
  const { signIn, signUp } = useAuth();
  const { hasExistingConfig } = useConfig();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'setup'>('login');

  useEffect(() => {
    setMode(hasExistingConfig ? 'login' : 'setup');
  }, [hasExistingConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === 'setup') {
      const { error: signUpError } = await signUp(email, password);
      if (signUpError) {
        setError(signUpError);
        setLoading(false);
        return;
      }
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError);
      }
    } else {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        <div className="glass-strong rounded-2xl p-8">
          <div className="text-center mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{
                backgroundColor: 'rgba(128, 223, 255, 0.1)',
                border: '1px solid rgba(128, 223, 255, 0.2)',
              }}
            >
              <Shield size={24} className="text-[#80dfff]" />
            </div>
            <h1 className="text-xl font-bold text-white">
              {mode === 'setup' ? 'Create Owner Account' : 'Owner Login'}
            </h1>
            <p className="text-sm text-white/40 mt-1">
              {mode === 'setup'
                ? 'Set up your account to manage your profile'
                : 'Sign in to manage your profile'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#80dfff]/50 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#80dfff]/50 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#80dfff]/10 border border-[#80dfff]/30 text-[#80dfff] text-sm font-medium hover:bg-[#80dfff]/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  {mode === 'setup' ? 'Create Account' : 'Sign In'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {mode === 'login' && (
            <p className="text-xs text-white/30 text-center mt-4">
              This is a private dashboard. Only the owner can access it.
            </p>
          )}
          {mode === 'setup' && (
            <p className="text-xs text-white/30 text-center mt-4">
              This creates the single owner account. No public registration is available.
            </p>
          )}
        </div>

        <p className="text-center mt-4">
          <a href="/" className="text-xs text-white/30 hover:text-white/50 transition-colors">
            Back to profile
          </a>
        </p>
      </motion.div>
    </div>
  );
}
