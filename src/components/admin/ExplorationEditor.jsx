import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import AnimatedThemeToggler from '../magicui/AnimatedThemeToggler';

export default function ExplorationEditor() {
  const { id } = useParams(); // undefined for 'new'
  const isEdit = !!id;
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (isEdit) {
      fetchExplorationDetail();
    }
  }, [id, token]);

  const fetchExplorationDetail = async () => {
    setFetching(true);
    setError('');

    try {
      const response = await fetch('/api/explorations');
      if (!response.ok) throw new Error('Failed to fetch data.');

      const data = await response.json();
      const exp = data.find((e) => e.id === parseInt(id));

      if (!exp) {
        throw new Error('Exploration not found.');
      }

      setTitle(exp.title);
      setCategory(exp.category);
      setDescription(exp.description);
      setImage(exp.image);
    } catch (err) {
      setError(err.message || 'An error occurred while loading data.');
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      title,
      category,
      description,
      image,
    };

    if (isEdit) {
      payload.id = parseInt(id);
    }

    try {
      const response = await fetch('/api/admin/explorations', {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        navigate('/admin', { state: { tab: 'explorations' } });
      } else {
        setError(resData.error || 'Failed to save data.');
      }
    } catch (err) {
      setError('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center justify-center gap-3 text-neutral-450 dark:text-zinc-500 font-sans">
          <Icon icon="svg-spinners:180-ring" className="w-8 h-8 text-neutral-500" />
          <span className="text-sm font-medium font-sans">Loading data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-zinc-50 dark:bg-zinc-950 text-neutral-800 dark:text-zinc-200 theme-transition flex flex-col md:flex-row font-sans overflow-hidden">
      
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
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-zinc-800 text-neutral-600 dark:text-neutral-400 cursor-pointer"
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
                <span className="text-[10px] text-neutral-450 dark:text-zinc-500 font-medium">Administrator</span>
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
                Showcase Management
              </span>
              <nav className="space-y-1">
                <Link
                  to="/admin"
                  state={{ tab: 'works' }}
                  onClick={() => setSidebarOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-zinc-800/50"
                >
                  <Icon icon="solar:folder-with-files-linear" className="w-4.5 h-4.5" />
                  <span>Case Studies</span>
                </Link>

                <Link
                  to="/admin"
                  state={{ tab: 'explorations' }}
                  onClick={() => setSidebarOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all bg-neutral-950 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-sm"
                >
                  <Icon icon="solar:compass-linear" className="w-4.5 h-4.5" />
                  <span>Explorations</span>
                </Link>
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
            onClick={() => {
              localStorage.removeItem('admin_token');
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-200 dark:border-red-950/20 text-red-605 dark:text-red-400 bg-red-50/50 dark:bg-red-950/10 hover:bg-red-100 dark:hover:bg-red-950/20 text-xs font-semibold cursor-pointer transition-all shadow-sm"
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
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden font-sans">
        {/* Top Header - Desktop Only */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs text-neutral-455 dark:text-zinc-500 font-semibold uppercase tracking-wider">
            <Link to="/admin" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Admin Dashboard</Link>
            <span>/</span>
            <Link to="/admin" state={{ tab: 'explorations' }} className="hover:text-neutral-900 dark:hover:text-white transition-colors">Explorations</Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-zinc-300">{isEdit ? 'Edit Exploration' : 'Add New'}</span>
          </div>
        </header>

        {/* Content Container (Scrollable) */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-[1200px] w-full mx-auto space-y-8">
            {/* Header Row */}
          <div className="flex items-center gap-3 border-b border-dashed border-zinc-200 dark:border-zinc-800 pb-6">
            <Link
              to="/admin"
              state={{ tab: 'explorations' }}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-zinc-900 text-neutral-700 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-all border border-zinc-200 dark:border-zinc-800 cursor-pointer shadow-sm"
            >
              <Icon icon="solar:alt-arrow-left-linear" className="w-4.5 h-4.5" />
            </Link>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-neutral-400 dark:text-zinc-500 uppercase select-none block mb-1">
                Exploration Editor
              </span>
              <h1 className="font-serif-attio text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-zinc-100">
                {isEdit ? 'Edit Exploration' : 'Add New Exploration'}
              </h1>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30 flex items-center gap-2 text-sm">
              <Icon icon="solar:danger-triangle-linear" className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-white dark:bg-zinc-900/50 p-6 sm:p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm max-w-[700px]">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider">Exploration Title</label>
                <input
                  type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="AI Prompt Flow Canvas"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-zinc-950 text-neutral-900 dark:text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-650 transition-all font-sans"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider">Category</label>
                <input
                  type="text" required value={category} onChange={(e) => setCategory(e.target.value)}
                  placeholder="Generative UI & Graph Nodes"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-zinc-950 text-neutral-900 dark:text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-650 transition-all font-sans"
                />
              </div>

              {/* Image */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider">Image URL</label>
                <input
                  type="text" required value={image} onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... or local link"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-zinc-950 text-neutral-900 dark:text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-650 transition-all font-sans"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider">Description</label>
                <textarea
                  required rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of the design exploration..."
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-zinc-950 text-neutral-900 dark:text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-650 transition-all font-sans"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-6 font-sans">
                <Link
                  to="/admin"
                  state={{ tab: 'explorations' }}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-neutral-600 dark:text-zinc-350 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-xs font-semibold transition-all"
                >
                  Cancel
                </Link>
                <button
                  type="submit" disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-neutral-950 dark:bg-zinc-100 text-white dark:text-zinc-950 font-semibold text-xs transition-all active:scale-98 flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50 hover:bg-neutral-850 dark:hover:bg-zinc-200"
                >
                  {loading && <Icon icon="svg-spinners:180-ring" className="w-4 h-4" />}
                  <span>Save Exploration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
  );
}
