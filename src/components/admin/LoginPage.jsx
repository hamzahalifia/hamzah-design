import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  if (!isDev) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 font-sans text-center">
        <div className="w-full max-w-[440px] p-8 rounded-2xl bg-card border shadow-2xl space-y-6">
          <div className="w-12 h-12 mx-auto rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
            <Icon icon="lucide:shield-alert" className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight">403 - Forbidden Access</h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The administrator dashboard and login gateway are restricted and can only be accessed from a local development environment.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex w-full items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground border font-semibold text-xs transition-all active:scale-[0.98]"
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
    <div className="min-h-screen flex items-center justify-center bg-background px-4 font-sans">
      <div className="w-full max-w-[400px] space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary border">
            <Icon icon="solar:lock-password-bold-duotone" className="w-6 h-6 text-foreground/70" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Admin Access
          </h2>
          <p className="text-sm text-muted-foreground">
            Sign in to manage your portfolio
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border rounded-2xl shadow-sm p-6 space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Username
              </label>
              <div className="relative">
                <Icon 
                  icon="solar:user-linear" 
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                  className="w-full h-10 pl-10 pr-4 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password with Show/Hide Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Icon 
                  icon="solar:lock-password-linear" 
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full h-10 pl-10 pr-10 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <div className="relative w-4 h-4">
                    <Icon 
                      icon="solar:eye-linear" 
                      className={`absolute inset-0 w-4 h-4 transition-all duration-200 ${
                        showPassword ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
                      }`}
                    />
                    <Icon 
                      icon="solar:eye-closed-linear" 
                      className={`absolute inset-0 w-4 h-4 transition-all duration-200 ${
                        showPassword ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
                      }`}
                    />
                  </div>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2.5">
                <Icon icon="solar:danger-triangle-bold" className="w-4 h-4 text-destructive flex-shrink-0" />
                <span className="text-sm text-destructive font-medium">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <Icon icon="svg-spinners:180-ring" className="w-4 h-4" />
              ) : (
                <>
                  <span>Sign In</span>
                  <Icon icon="solar:arrow-right-linear" className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-1">
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}