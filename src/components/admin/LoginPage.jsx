import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if accessing from local dev server
  const hostname = window.location.hostname;
  const isDev = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]' || hostname.endsWith('.local');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('admin_token', data.token);
        navigate('/admin');
      } else {
        setError(data.error || 'Invalid username or password!');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  // Render 403 Forbidden Access Page if accessed on production
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
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 font-sans">
      <div className="w-full max-w-[400px] p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
            <Icon icon="lucide:lock" className="w-5 h-5 text-zinc-100" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-zinc-100">
            Admin Area
          </h2>
          <p className="text-xs text-zinc-400">
            Sign in to manage your portfolio showcase
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="hamzah"
                className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-650 transition-all text-xs font-sans"
              />
              <Icon 
                icon="lucide:user" 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-650 transition-all text-xs font-sans"
              />
              <Icon 
                icon="lucide:key" 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 text-xs font-medium text-red-400 bg-red-950/20 rounded-lg flex items-center gap-2 border border-red-950/30">
              <Icon icon="lucide:alert-triangle" className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <Icon icon="svg-spinners:180-ring" className="w-4 h-4" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <Icon icon="lucide:arrow-right" className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
