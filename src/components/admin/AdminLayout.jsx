import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import AnimatedThemeToggler from '../magicui/AnimatedThemeToggler';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'lucide:layout-dashboard', path: '/admin' },
  { id: 'works', label: 'Works', icon: 'lucide:folder', path: '/admin/works' },
  { id: 'explorations', label: 'Explorations', icon: 'lucide:compass', path: '/admin/explorations' },
  { id: 'settings', label: 'Settings', icon: 'lucide:settings', path: '/admin/settings' },
];

export default function AdminLayout({ children, activeTab = 'dashboard' }) {
  const navigate = useNavigate();
  const hostname = window.location.hostname;
  const isDev = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]' || hostname.endsWith('.local');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  if (!isDev) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-4 font-sans text-center">
        <div className="w-full max-w-[440px] p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 shadow-2xl space-y-6">
          <div className="w-12 h-12 mx-auto rounded-xl bg-red-950/30 border border-red-900/30 flex items-center justify-center text-red-500">
            <Icon icon="lucide:shield-alert" className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">403 - Forbidden Access</h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The administrator dashboard and login gateway are restricted and can only be accessed from a local development environment.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex w-full items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 border border-zinc-800 font-semibold text-xs transition-all active:scale-98"
            >
              <Icon icon="lucide:arrow-left" className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-neutral-800 dark:text-zinc-200 theme-transition font-sans flex flex-col">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to="/admin" className="flex items-center gap-2.5">
              <img 
                src="/images/general/logo-dark.svg" 
                alt="Alifia Hamzah" 
                className="h-7 w-auto dark:invert"
              />
            </Link>
          </div>

          {/* Center: Pill Tab Navigation — visible on md+ */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center bg-muted/50 border rounded-full p-1 shadow-sm">
            {TABS.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon icon={tab.icon} className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{tab.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right: Theme + Logout */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <AnimatedThemeToggler />
            
            {/* Hamburger menu button — visible on mobile only */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg border hover:bg-muted transition-colors cursor-pointer text-muted-foreground"
              aria-label="Toggle menu"
            >
              <Icon icon={menuOpen ? 'lucide:x' : 'lucide:menu'} className="w-4 h-4" />
            </button>

            <span className="w-px h-5 bg-zinc-200 dark:bg-zinc-700 hidden sm:block" />
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
              title="Sign Out"
            >
              <Icon icon="lucide:log-out" className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 space-y-1.5">
            {TABS.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon icon={tab.icon} className="w-4 h-4 flex-shrink-0" />
                <span>{tab.label}</span>
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer w-full"
              >
                <Icon icon="lucide:log-out" className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}