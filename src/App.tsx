import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ConfigProvider, useConfig } from '@/context/ConfigContext';
import { ProfilePage } from '@/components/ProfilePage';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { NotFoundPage } from '@/components/NotFoundPage';
import { defaultConfig } from '@/lib/defaultConfig';

function getRoute(): string {
  const path = window.location.pathname;
  if (path === '/admin' || path.startsWith('/admin/')) return 'admin';
  if (path === '/') return 'home';
  return '404';
}

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { config, loading: configLoading } = useConfig();
  const route = getRoute();

  // Update document title from config
  useEffect(() => {
    if (config?.advanced.browserTitle) {
      document.title = config.advanced.browserTitle;
    }
  }, [config?.advanced.browserTitle]);

  if (route === '404') {
    return <NotFoundPage />;
  }

  if (route === 'admin') {
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
          <div className="text-white/30 text-sm">Loading...</div>
        </div>
      );
    }
    if (!user) {
      return <AdminLogin />;
    }
    return <AdminDashboard />;
  }

  // Home route - public profile
  if (configLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div
          className="w-10 h-10 rounded-full border-2 border-white/10"
          style={{
            borderTopColor: '#80dfff',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
    );
  }

  const displayConfig = config ?? defaultConfig;

  return <ProfilePage config={displayConfig} />;
}

export default function App() {
  return (
    <AuthProvider>
      <ConfigProvider>
        <AppContent />
      </ConfigProvider>
    </AuthProvider>
  );
}
