import { motion } from 'framer-motion';
import { Home, Sparkles } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#80dfff]/10 border border-[#80dfff]/20 flex items-center justify-center mx-auto mb-6">
          <Sparkles size={28} className="text-[#80dfff]" />
        </div>
        <h1 className="text-6xl font-bold text-white mb-2">404</h1>
        <p className="text-white/40 mb-6">This page doesn't exist</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#80dfff]/10 border border-[#80dfff]/30 text-[#80dfff] text-sm font-medium hover:bg-[#80dfff]/20 transition-colors"
        >
          <Home size={16} /> Back to Profile
        </a>
      </motion.div>
    </div>
  );
}
