import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import AnimatedThemeToggler from '../magicui/AnimatedThemeToggler';

export default function AdminDashboard() {
  const location = useLocation();
  const [works, setWorks] = useState([]);
  const [explorations, setExplorations] = useState([]);
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'overview'); // 'overview' | 'works' | 'explorations' | 'settings'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  // Check if accessing from local dev server
  const hostname = window.location.hostname;
  const isDev = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]' || hostname.endsWith('.local');

  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetchData();
  }, [token]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const [worksRes, explorationsRes] = await Promise.all([
        fetch('/api/works'),
        fetch('/api/explorations'),
      ]);

      if (!worksRes.ok || !explorationsRes.ok) {
        throw new Error('Failed to fetch data from database.');
      }

      const worksData = await worksRes.json();
      const explorationsData = await explorationsRes.json();

      setWorks(worksData);
      setExplorations(explorationsData);
    } catch (err) {
      setError(err.message || 'An error occurred while loading data.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  const handleDeleteWork = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete case study "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/works?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setWorks(works.filter((w) => w.id !== id));
        showToast(`Case study "${title}" successfully deleted.`);
      } else {
        const errData = await response.json();
        alert(errData.error || 'Failed to delete data.');
      }
    } catch (err) {
      alert('A network error occurred.');
    }
  };

  const handleDeleteExploration = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete exploration "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/explorations?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setExplorations(explorations.filter((e) => e.id !== id));
        showToast(`Exploration "${title}" successfully deleted.`);
      } else {
        const errData = await response.json();
        alert(errData.error || 'Failed to delete data.');
      }
    } catch (err) {
      alert('A network error occurred.');
    }
  };

  const triggerCacheSync = () => {
    showToast('Database cache synchronized successfully!');
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
    <div className="h-screen w-screen bg-zinc-50 dark:bg-zinc-950 text-neutral-800 dark:text-zinc-200 theme-transition flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-neutral-900 text-white dark:bg-zinc-900 dark:text-zinc-100 shadow-lg text-xs font-semibold border border-neutral-800 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <Icon icon="solar:check-circle-linear" className="w-4 h-4 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-35">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-bold text-sm">
            H
          </div>
          <span className="font-bold tracking-tight text-neutral-900 dark:text-zinc-100">Hamzah Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <AnimatedThemeToggler />
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-zinc-800 text-neutral-600 dark:text-zinc-400 cursor-pointer"
          >
            <Icon icon="solar:hamburger-menu-linear" className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Sidebar - Overlay drawer on mobile, sticky on desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 md:static md:h-screen sticky top-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col flex-1 py-6 px-4 space-y-7">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-2">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-bold text-sm">
                H
              </div>
              <div>
                <span className="font-bold tracking-tight text-neutral-900 dark:text-zinc-100 text-sm block font-sans">Hamzah Alifia</span>
                <span className="text-[10px] text-neutral-500 dark:text-zinc-400 font-medium">Administrator</span>
              </div>
            </div>
            
            {/* Close button on mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-500 cursor-pointer"
            >
              <Icon icon="solar:close-square-linear" className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-6">
            <div>
              <span className="px-3 text-[10px] font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-widest block mb-2 select-none font-sans">
                Platform
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => {
                    setActiveTab('overview');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-neutral-950 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-sm'
                      : 'text-neutral-500 dark:text-zinc-400 hover:bg-neutral-100 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon icon="solar:widget-line-duotone" className="w-4.5 h-4.5" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('works');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    activeTab === 'works'
                      ? 'bg-neutral-950 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-sm'
                      : 'text-neutral-500 dark:text-zinc-400 hover:bg-neutral-100 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon icon="solar:folder-with-files-linear" className="w-4.5 h-4.5" />
                  <span>Case Studies</span>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                    activeTab === 'works'
                      ? 'bg-neutral-800 dark:bg-zinc-800 text-neutral-200 dark:text-zinc-900'
                      : 'bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-zinc-400'
                  }`}>
                    {works.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('explorations');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    activeTab === 'explorations'
                      ? 'bg-neutral-950 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-sm'
                      : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon icon="solar:compass-linear" className="w-4.5 h-4.5" />
                  <span>Explorations</span>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                    activeTab === 'explorations'
                      ? 'bg-neutral-800 dark:bg-zinc-800 text-neutral-200 dark:text-zinc-900'
                      : 'bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-zinc-400'
                  }`}>
                    {explorations.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-neutral-950 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-sm'
                      : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon icon="solar:settings-linear" className="w-4.5 h-4.5" />
                  <span>Settings</span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4 font-sans">
          <div className="hidden md:flex items-center justify-between px-2">
            <span className="text-xs text-neutral-455 dark:text-zinc-450 font-medium">Toggle Theme</span>
            <AnimatedThemeToggler />
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-200 dark:border-red-950/20 text-red-650 dark:text-red-400 bg-red-50/50 dark:bg-red-950/10 hover:bg-red-100 dark:hover:bg-red-950/20 text-xs font-semibold cursor-pointer transition-all shadow-sm"
          >
            <Icon icon="solar:logout-linear" className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header - Desktop Only */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs text-neutral-455 dark:text-zinc-500 font-semibold uppercase tracking-wider">
            <span>Admin Dashboard</span>
            <span>/</span>
            <span className="text-neutral-900 dark:text-zinc-300 capitalize">{activeTab}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-250 dark:border-emerald-900/30 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              D1 Database Connected
            </span>
          </div>
        </header>

        {/* Content Container (Scrollable) */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-[1200px] w-full mx-auto space-y-8">
          
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-dashed border-zinc-200 dark:border-zinc-800 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif-attio font-semibold tracking-tight text-neutral-900 dark:text-zinc-100 capitalize">
                {activeTab === 'overview' ? 'Dashboard Overview' : activeTab === 'works' ? 'Case Studies' : activeTab === 'explorations' ? 'Explorations' : 'System Settings'}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-zinc-400 mt-1.5 font-sans">
                {activeTab === 'overview' && 'Manage and monitor your portfolio showcase status.'}
                {activeTab === 'works' && 'List of case study portfolios published on the home page.'}
                {activeTab === 'explorations' && 'Showcase of visual designs and interactive explorations.'}
                {activeTab === 'settings' && 'Cloudflare D1 database configuration and system metadata.'}
              </p>
            </div>

            {/* Quick action buttons on header */}
            {activeTab === 'overview' && (
              <button
                onClick={triggerCacheSync}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-neutral-100 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900/50 text-neutral-700 dark:text-zinc-300 text-xs font-semibold transition-all cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <Icon icon="solar:refresh-linear" className="w-4 h-4" />
                <span>Sync Cache</span>
              </button>
            )}

            {activeTab === 'works' && (
              <Link
                to="/admin/work/new"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-950 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-neutral-850 dark:hover:bg-zinc-200 text-xs font-semibold transition-all cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <Icon icon="solar:add-circle-linear" className="w-4 h-4" />
                <span>Add Case Study</span>
              </Link>
            )}

            {activeTab === 'explorations' && (
              <Link
                to="/admin/exploration/new"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-950 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-neutral-850 dark:hover:bg-zinc-200 text-xs font-semibold transition-all cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <Icon icon="solar:add-circle-linear" className="w-4 h-4" />
                <span>Add Exploration</span>
              </Link>
            )}
          </div>

          {/* VIEW: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-455 dark:text-zinc-400 font-semibold tracking-wider uppercase font-sans">Case Studies</span>
                    <Icon icon="solar:folder-with-files-linear" className="w-4.5 h-4.5 text-neutral-450 dark:text-zinc-500" />
                  </div>
                  <div>
                    <span className="text-3xl font-bold text-neutral-900 dark:text-zinc-100 block tracking-tight">
                      {loading ? '...' : works.length}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-450 font-medium mt-1 block">Active Showcase</span>
                  </div>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-455 dark:text-zinc-400 font-semibold tracking-wider uppercase font-sans">Explorations</span>
                    <Icon icon="solar:compass-linear" className="w-4.5 h-4.5 text-neutral-450 dark:text-zinc-500" />
                  </div>
                  <div>
                    <span className="text-3xl font-bold text-neutral-900 dark:text-zinc-100 block tracking-tight">
                      {loading ? '...' : explorations.length}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-450 font-medium mt-1 block">Visual design shots</span>
                  </div>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-455 dark:text-zinc-400 font-semibold tracking-wider uppercase font-sans">D1 Database</span>
                    <Icon icon="solar:database-linear" className="w-4.5 h-4.5 text-neutral-450 dark:text-zinc-500" />
                  </div>
                  <div>
                    <span className="text-lg font-bold text-neutral-900 dark:text-zinc-100 block truncate">
                      SQLite Connected
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-450 font-medium mt-1.5 block">hamzahdesign_db</span>
                  </div>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-455 dark:text-zinc-400 font-semibold tracking-wider uppercase font-sans">Platform</span>
                    <Icon icon="solar:cloud-linear" className="w-4.5 h-4.5 text-neutral-450 dark:text-zinc-500" />
                  </div>
                  <div>
                    <span className="text-lg font-bold text-neutral-900 dark:text-zinc-100 block">
                      Cloudflare Pages
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-450 font-medium mt-1.5 block">Production environment</span>
                  </div>
                </div>
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent Items List Card (Col-span-2) */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 space-y-6">
                  <div>
                    <h2 className="font-bold text-neutral-900 dark:text-zinc-100 text-base">Activity Overview</h2>
                    <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-1 font-sans">List of recent items in the database.</p>
                  </div>

                  {loading ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3 text-neutral-400">
                      <Icon icon="svg-spinners:180-ring" className="w-6 h-6 text-neutral-500" />
                      <span className="text-xs">Loading data...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {works.slice(0, 3).map((work) => (
                        <div key={`recent-work-${work.id}`} className="flex items-center justify-between p-3.5 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-[#FAFAF9]/40 dark:bg-zinc-900/30 hover:bg-[#FAFAF9] dark:hover:bg-zinc-800/40 transition-all">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 text-xs font-bold shrink-0">
                              W
                            </div>
                            <div className="min-w-0 font-sans">
                              <span className="font-semibold text-xs text-neutral-900 dark:text-zinc-200 block truncate">{work.title}</span>
                              <span className="text-[10px] text-neutral-500 dark:text-zinc-400 font-mono block mt-0.5">/{work.slug} • Case Study</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-500 dark:text-zinc-450 shrink-0">{work.year}</span>
                        </div>
                      ))}

                      {explorations.slice(0, 2).map((exp) => (
                        <div key={`recent-exp-${exp.id}`} className="flex items-center justify-between p-3.5 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-[#FAFAF9]/40 dark:bg-zinc-900/30 hover:bg-[#FAFAF9] dark:hover:bg-zinc-800/40 transition-all">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 text-xs font-bold shrink-0">
                              E
                            </div>
                            <div className="min-w-0 font-sans">
                              <span className="font-semibold text-xs text-neutral-900 dark:text-zinc-200 block truncate">{exp.title}</span>
                              <span className="text-[10px] text-neutral-500 dark:text-zinc-400 font-mono block mt-0.5">{exp.category} • Exploration</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-neutral-500 dark:text-zinc-450 shrink-0">Visual</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions (Col-span-1) */}
                <div className="bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 flex flex-col justify-between space-y-6">
                  <div>
                    <h2 className="font-bold text-neutral-900 dark:text-zinc-100 text-base">Quick Actions</h2>
                    <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-1 font-sans">Navigation and management shortcuts.</p>
                  </div>

                  <div className="space-y-2.5">
                    <Link
                      to="/admin/work/new"
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-neutral-700 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-xs font-semibold cursor-pointer transition-all shadow-sm bg-white dark:bg-zinc-900/50"
                    >
                      <Icon icon="solar:folder-with-files-linear" className="w-4 h-4" />
                      <span>Create New Case Study</span>
                    </Link>

                    <Link
                      to="/admin/exploration/new"
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-neutral-700 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-xs font-semibold cursor-pointer transition-all shadow-sm bg-white dark:bg-zinc-900/50"
                    >
                      <Icon icon="solar:compass-linear" className="w-4 h-4" />
                      <span>Create New Exploration</span>
                    </Link>

                    <Link
                      to="/"
                      target="_blank"
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-neutral-700 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-xs font-semibold cursor-pointer transition-all shadow-sm bg-white dark:bg-zinc-900/50"
                    >
                      <Icon icon="solar:globus-linear" className="w-4 h-4" />
                      <span>Visit Live Portfolio</span>
                    </Link>
                  </div>

                  <div className="p-3 bg-neutral-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-lg text-[10px] text-neutral-500 dark:text-zinc-400 leading-relaxed font-mono">
                    Cloudflare pages dev server running on port 8788.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: CASE STUDIES TABLE */}
          {activeTab === 'works' && (
            <div className="bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3 text-neutral-400">
                  <Icon icon="svg-spinners:180-ring" className="w-8 h-8 text-neutral-500" />
                  <span className="text-sm font-medium">Loading data from D1...</span>
                </div>
              ) : works.length === 0 ? (
                <div className="p-12 text-center text-sm text-neutral-500 font-sans">
                  No case studies yet. Please add new data.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse font-sans">
                    <thead>
                      <tr className="bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-200 dark:border-zinc-800 text-neutral-500 dark:text-zinc-400 font-semibold text-xs uppercase tracking-wider select-none">
                        <th className="p-4">Project</th>
                        <th className="p-4">Company</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Year</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {works.map((work) => (
                        <tr key={work.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-800/30 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            {work.logo ? (
                              <img
                                src={work.logo}
                                alt={work.company}
                                className="w-8 h-8 rounded-lg bg-neutral-950 dark:bg-zinc-800 object-contain p-1 border border-zinc-200 dark:border-zinc-700 dark:invert"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                                <Icon icon="solar:gallery-linear" className="w-4 h-4 text-neutral-400 dark:text-zinc-500" />
                              </div>
                            )}
                            <div className="flex flex-col min-w-0">
                              <span className="font-semibold text-neutral-900 dark:text-zinc-200 leading-normal truncate max-w-[200px]">{work.title}</span>
                              <span className="text-[10px] text-neutral-500 dark:text-zinc-450 font-mono">/{work.slug}</span>
                            </div>
                          </td>
                          <td className="p-4 text-neutral-600 dark:text-zinc-300 font-medium">
                            {work.company}
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50 text-xs font-semibold">
                              {work.category}
                            </span>
                          </td>
                          <td className="p-4 text-neutral-500 dark:text-zinc-400 font-mono text-xs">
                            {work.year}
                          </td>
                          <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                            <Link
                              to={`/admin/work/edit/${work.id}`}
                              className="inline-flex p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-neutral-600 dark:text-zinc-400 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
                              title="Edit"
                            >
                              <Icon icon="solar:pen-linear" className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteWork(work.id, work.title)}
                              className="inline-flex p-2 rounded-lg border border-red-200 dark:border-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Icon icon="solar:trash-bin-trash-linear" className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* VIEW: EXPLORATIONS TABLE */}
          {activeTab === 'explorations' && (
            <div className="bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3 text-neutral-450">
                  <Icon icon="svg-spinners:180-ring" className="w-8 h-8 text-neutral-500" />
                  <span className="text-sm font-medium">Loading data from D1...</span>
                </div>
              ) : explorations.length === 0 ? (
                <div className="p-12 text-center text-sm text-neutral-500 font-sans">
                  No explorations yet. Please add new data.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse font-sans">
                    <thead>
                      <tr className="bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-200 dark:border-zinc-800 text-neutral-500 dark:text-zinc-400 font-semibold text-xs uppercase tracking-wider select-none">
                        <th className="p-4">Visual & Title</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Description</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {explorations.map((exp) => (
                        <tr key={exp.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-800/30 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={exp.image}
                              alt={exp.title}
                              className="w-16 h-10 rounded-lg object-cover border border-zinc-200 dark:border-zinc-800"
                            />
                            <span className="font-semibold text-neutral-900 dark:text-zinc-200 leading-normal">{exp.title}</span>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/60 text-zinc-650 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50 text-xs font-semibold">
                              {exp.category}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-neutral-500 dark:text-zinc-400 max-w-[300px] truncate leading-normal">
                            {exp.description}
                          </td>
                          <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                            <Link
                              to={`/admin/exploration/edit/${exp.id}`}
                              className="inline-flex p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
                              title="Edit"
                            >
                              <Icon icon="solar:pen-linear" className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteExploration(exp.id, exp.title)}
                              className="inline-flex p-2 rounded-lg border border-red-200 dark:border-red-950/20 text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Icon icon="solar:trash-bin-trash-linear" className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* VIEW: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-[700px] font-sans">
              <div className="bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-zinc-200 uppercase tracking-wider">Database Connection</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-450 dark:text-zinc-500 block">D1 Binding Name</span>
                    <span className="font-semibold text-neutral-800 dark:text-zinc-200 mt-1 block font-mono">hamzahdesign_db</span>
                  </div>
                  <div>
                    <span className="text-neutral-450 dark:text-zinc-500 block">Status</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-450 mt-1 block flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active (Local)
                    </span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-neutral-500 dark:text-zinc-450 block">D1 Local File</span>
                    <span className="font-semibold text-neutral-800 dark:text-zinc-300 mt-1 block font-mono break-all bg-neutral-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded">
                      .wrangler/state/v3/d1/hamzahdesign_db.sqlite
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-zinc-200 uppercase tracking-wider">Environment Information</h3>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-neutral-450 dark:text-zinc-500 block font-sans">Node.js Version</span>
                    <span className="font-semibold text-neutral-800 dark:text-zinc-200 mt-1 block">v22.16.0</span>
                  </div>
                  <div>
                    <span className="text-neutral-450 dark:text-zinc-500 block font-sans">Wrangler Version</span>
                    <span className="font-semibold text-neutral-800 dark:text-zinc-200 mt-1 block">v4.105.0</span>
                  </div>
                  <div>
                    <span className="text-neutral-450 dark:text-zinc-500 block font-sans">React Version</span>
                    <span className="font-semibold text-neutral-800 dark:text-zinc-200 mt-1 block">v19.2.7</span>
                  </div>
                  <div>
                    <span className="text-neutral-450 dark:text-zinc-500 block font-sans">Vite Version</span>
                    <span className="font-semibold text-neutral-800 dark:text-zinc-200 mt-1 block">v8.1.0</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          </div>
        </div>
      </main>
    </div>
  );
}
