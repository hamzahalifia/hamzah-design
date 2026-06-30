import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import LexicalEditor from './LexicalEditor';
import AnimatedThemeToggler from '../magicui/AnimatedThemeToggler';

export default function WorkEditor() {
  const { id } = useParams(); // undefined for 'new'
  const isEdit = !!id;
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [desc, setDesc] = useState('');
  const [content, setContent] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('');
  const [readingTime, setReadingTime] = useState('');
  const [year, setYear] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [logo, setLogo] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [industryInput, setIndustryInput] = useState('');

  // Complex array states
  const [designStack, setDesignStack] = useState([]);
  const [sections, setSections] = useState([]);

  // Temp states for adding items
  const [newStackName, setNewStackName] = useState('');
  const [newStackIcon, setNewStackIcon] = useState('');
  const [newStackColor, setNewStackColor] = useState('');
  const [newSectionId, setNewSectionId] = useState('');
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (isEdit) {
      fetchWorkDetail();
    }
  }, [id, token]);

  const fetchWorkDetail = async () => {
    setFetching(true);
    setError('');

    try {
      const response = await fetch('/api/works');
      if (!response.ok) throw new Error('Failed to fetch data.');

      const data = await response.json();
      const work = data.find((w) => w.id === parseInt(id));

      if (!work) {
        throw new Error('Case study not found.');
      }

      setTitle(work.title);
      setSlug(work.slug);
      setDesc(work.description);
      setContent(work.content || '');
      setCompany(work.company);
      setCategory(work.category);
      setReadingTime(work.readingTime);
      setYear(work.year);
      setHeroImage(work.heroImage);
      setLogo(work.logo || '');
      setLiveUrl(work.liveUrl || '');
      setIndustryInput(work.industry ? work.industry.join(', ') : '');

      if (work.designStack) {
        setDesignStack(work.designStack);
      }
      if (work.sections) {
        setSections(work.sections);
      }
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

    const industries = industryInput
      ? industryInput.split(',').map((item) => item.trim()).filter(Boolean)
      : [];

    const payload = {
      title,
      slug,
      description: desc,
      content,
      company,
      category,
      reading_time: readingTime,
      year,
      hero_image: heroImage,
      logo: logo || null,
      live_url: liveUrl || null,
      industry: industries,
      design_stack: designStack,
      sections: sections,
    };

    if (isEdit) {
      payload.id = parseInt(id);
    }

    try {
      const response = await fetch('/api/admin/works', {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        navigate('/admin', { state: { tab: 'works' } });
      } else {
        setError(resData.error || 'Failed to save data.');
      }
    } catch (err) {
      setError('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const addStack = () => {
    if (!newStackName || !newStackIcon) return;
    setDesignStack([
      ...designStack,
      {
        name: newStackName,
        icon: newStackIcon,
        color: newStackColor || null,
      },
    ]);
    setNewStackName('');
    setNewStackIcon('');
    setNewStackColor('');
  };

  const removeStack = (index) => {
    setDesignStack(designStack.filter((_, idx) => idx !== index));
  };

  const addSection = () => {
    if (!newSectionId || !newSectionTitle) return;
    setSections([
      ...sections,
      {
        id: newSectionId,
        title: newSectionTitle,
      },
    ]);
    setNewSectionId('');
    setNewSectionTitle('');
  };

  const removeSection = (index) => {
    setSections(sections.filter((_, idx) => idx !== index));
  };

  const autoGenerateTOC = () => {
    if (!content) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const h2Elements = doc.querySelectorAll('h2');
    
    const newSections = Array.from(h2Elements).map((h2) => {
      const title = h2.textContent || '';
      const id = h2.getAttribute('id') || title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/&/g, '-and-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
      return { id, title };
    });

    if (newSections.length > 0) {
      setSections(newSections);
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
    <div className="h-screen w-screen bg-zinc-50 dark:bg-zinc-950 text-neutral-800 dark:text-zinc-200 theme-transition flex flex-col md:flex-row overflow-hidden">
      
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
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all bg-neutral-950 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-sm"
                >
                  <Icon icon="solar:folder-with-files-linear" className="w-4.5 h-4.5" />
                  <span>Case Studies</span>
                </Link>

                <Link
                  to="/admin"
                  state={{ tab: 'explorations' }}
                  onClick={() => setSidebarOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-zinc-800/50"
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
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden font-sans">
        {/* Top Header - Desktop Only */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs text-neutral-455 dark:text-zinc-500 font-semibold uppercase tracking-wider">
            <Link to="/admin" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Admin Dashboard</Link>
            <span>/</span>
            <Link to="/admin" state={{ tab: 'works' }} className="hover:text-neutral-900 dark:hover:text-white transition-colors">Case Studies</Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-zinc-300">{isEdit ? 'Edit Case Study' : 'Add New'}</span>
          </div>
        </header>

        {/* Content Container (Scrollable) */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-[1200px] w-full mx-auto space-y-8">
            {/* Header Row */}
          <div className="flex items-center gap-3 border-b border-dashed border-zinc-200 dark:border-zinc-800 pb-6">
            <Link
              to="/admin"
              state={{ tab: 'works' }}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-zinc-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-all border border-zinc-200 dark:border-zinc-800 cursor-pointer shadow-sm"
            >
              <Icon icon="solar:alt-arrow-left-linear" className="w-4.5 h-4.5" />
            </Link>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-neutral-400 dark:text-zinc-500 uppercase select-none block mb-1">
                Case Study Editor
              </span>
              <h1 className="font-serif-attio text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-zinc-100">
                {isEdit ? 'Edit Case Study' : 'Add New Case Study'}
              </h1>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30 flex items-center gap-2 text-sm">
              <Icon icon="solar:danger-triangle-linear" className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Side: Main content editors (col-span-2) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
                <h3 className="font-bold text-neutral-900 dark:text-zinc-200 text-xs pb-3 border-b border-zinc-100 dark:border-zinc-800/80 uppercase tracking-wider select-none">Main Content</h3>
                
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider">Case Study Title</label>
                  <input
                    type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="Resolving a 40% Efficiency Loss..."
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-zinc-950 text-neutral-900 dark:text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-650 transition-all font-sans"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider">Slug URL (Unique)</label>
                  <input
                    type="text" required value={slug} onChange={(e) => setSlug(e.target.value)}
                    placeholder="resolving-40-percent"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-zinc-950 text-neutral-900 dark:text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-650 transition-all font-sans"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider">Short Description (Summary)</label>
                  <textarea
                    required rows={3} value={desc} onChange={(e) => setDesc(e.target.value)}
                    placeholder="Short description of the case study shown on portfolio list cards..."
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-zinc-950 text-neutral-900 dark:text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-650 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Lexical Rich Content Editor */}
              <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                <label className="text-sm font-bold text-neutral-900 dark:text-zinc-200 uppercase tracking-wider block">Detailed Content (Rich HTML)</label>
                <LexicalEditor value={content} onChange={setContent} />
              </div>
            </div>

            {/* Right Side: Meta and side assets (col-span-1) */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
                 <h3 className="font-bold text-neutral-900 dark:text-zinc-200 text-xs pb-3 border-b border-zinc-100 dark:border-zinc-800/80 uppercase tracking-wider select-none">Metadata</h3>
                
                {/* Company */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider">Company / Client</label>
                  <input
                    type="text" required value={company} onChange={(e) => setCompany(e.target.value)}
                    placeholder="PT Neuronworks Indonesia"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-zinc-950 text-neutral-900 dark:text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-650 transition-all font-sans"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider">Category</label>
                  <input
                    type="text" required value={category} onChange={(e) => setCategory(e.target.value)}
                    placeholder="DOOR V3 / Enterprise Dashboard"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-zinc-950 text-neutral-900 dark:text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-650 transition-all font-sans"
                  />
                </div>

                {/* Reading Time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider">Reading Time</label>
                  <input
                    type="text" required value={readingTime} onChange={(e) => setReadingTime(e.target.value)}
                    placeholder="10 min read"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-zinc-950 text-neutral-900 dark:text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-650 transition-all font-sans"
                  />
                </div>

                {/* Year */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider">Year</label>
                  <input
                    type="text" required value={year} onChange={(e) => setYear(e.target.value)}
                    placeholder="2025"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-zinc-950 text-neutral-900 dark:text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-650 transition-all font-sans"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
                <h3 className="font-bold text-neutral-900 dark:text-zinc-200 text-xs pb-3 border-b border-zinc-100 dark:border-zinc-800/80 uppercase tracking-wider select-none">Assets & Links</h3>

                {/* Hero Image */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider">Hero Image URL</label>
                  <input
                    type="text" required value={heroImage} onChange={(e) => setHeroImage(e.target.value)}
                    placeholder="/images/work/thumbnail.webp"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-zinc-950 text-neutral-900 dark:text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-650 transition-all font-sans"
                  />
                </div>

                {/* Logo */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider">Logo URL (Optional)</label>
                  <input
                    type="text" value={logo} onChange={(e) => setLogo(e.target.value)}
                    placeholder="/images/client_logo/logo.svg"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-zinc-950 text-neutral-900 dark:text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-650 transition-all font-sans"
                  />
                </div>

                {/* Live URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider">Live URL (Optional)</label>
                  <input
                    type="text" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://live-site.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-zinc-950 text-neutral-900 dark:text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-650 transition-all font-sans"
                  />
                </div>

                {/* Industry */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider">Industry (Separate with commas)</label>
                  <input
                    type="text" value={industryInput} onChange={(e) => setIndustryInput(e.target.value)}
                    placeholder="HRMIS, B2B SaaS, Enterprise"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-zinc-950 text-neutral-900 dark:text-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-650 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Design Stack Section */}
              <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                <h3 className="font-bold text-neutral-900 dark:text-zinc-200 text-xs pb-3 border-b border-zinc-100 dark:border-zinc-800/80 uppercase tracking-wider select-none">Design Stack</h3>
                
                <div className="flex flex-wrap gap-2 min-h-8">
                  {designStack.length === 0 ? (
                    <span className="text-xs text-neutral-400 italic font-sans">No tech stack added.</span>
                  ) : (
                    designStack.map((tech, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-sans">
                        <Icon icon={tech.icon} style={tech.color ? { color: tech.color } : undefined} className="w-4 h-4" />
                        <span className="font-medium">{tech.name}</span>
                        <button type="button" onClick={() => removeStack(idx)} className="text-red-500 hover:text-red-700 ml-1 cursor-pointer">
                          <Icon icon="solar:close-circle-bold" className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2.5 bg-neutral-50/50 dark:bg-zinc-900/30 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <input
                    type="text" value={newStackName} onChange={(e) => setNewStackName(e.target.value)}
                    placeholder="Name (Figma, React)"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-zinc-950 text-xs font-sans focus:outline-none dark:text-zinc-200"
                  />
                  <input
                    type="text" value={newStackIcon} onChange={(e) => setNewStackIcon(e.target.value)}
                    placeholder="Iconify ID (devicon:figma)"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-zinc-950 text-xs font-sans focus:outline-none dark:text-zinc-200"
                  />
                  <div className="flex gap-2 items-center">
                    <input
                      type="text" value={newStackColor} onChange={(e) => setNewStackColor(e.target.value)}
                      placeholder="Hex color (#FF0000)"
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-zinc-950 text-xs font-sans focus:outline-none dark:text-zinc-200"
                    />
                    <button
                      type="button" onClick={addStack}
                      className="px-3 py-2 rounded-lg bg-neutral-950 dark:bg-zinc-100 text-white dark:text-zinc-950 font-semibold text-xs cursor-pointer flex-shrink-0 hover:bg-neutral-850 dark:hover:bg-zinc-200 font-sans"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800/80 select-none">
                  <h3 className="font-bold text-neutral-900 dark:text-zinc-200 text-xs uppercase tracking-wider">Sections (TOC)</h3>
                  <button
                    type="button"
                    onClick={autoGenerateTOC}
                    className="text-[10px] font-bold text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                    title="Automatically detect H2 from editor"
                  >
                    <Icon icon="lucide:refresh-cw" className="w-3 h-3" />
                    <span>Auto-Detect</span>
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 min-h-8">
                  {sections.length === 0 ? (
                    <span className="text-xs text-neutral-400 italic font-sans">No TOC sections.</span>
                  ) : (
                    sections.map((sec, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-sans">
                        <span className="font-mono font-bold text-neutral-400">#{sec.id}</span>
                        <span className="font-medium">{sec.title}</span>
                        <button type="button" onClick={() => removeSection(idx)} className="text-red-500 hover:text-red-700 ml-1 cursor-pointer">
                          <Icon icon="solar:close-circle-bold" className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2.5 bg-neutral-50/50 dark:bg-zinc-900/30 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <input
                    type="text" value={newSectionId} onChange={(e) => setNewSectionId(e.target.value)}
                    placeholder="ID (it-started-here)"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-zinc-950 text-xs font-sans focus:outline-none dark:text-zinc-200"
                  />
                  <div className="flex gap-2 items-center">
                    <input
                      type="text" value={newSectionTitle} onChange={(e) => setNewSectionTitle(e.target.value)}
                      placeholder="Section Title (It Started Here...)"
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-zinc-950 text-xs font-sans focus:outline-none dark:text-zinc-200"
                    />
                    <button
                      type="button" onClick={addSection}
                      className="px-3 py-2 rounded-lg bg-neutral-950 dark:bg-zinc-100 text-white dark:text-zinc-950 font-semibold text-xs cursor-pointer flex-shrink-0 hover:bg-neutral-850 dark:hover:bg-zinc-200 font-sans"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Actions Card */}
              <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between gap-4">
                <Link
                  to="/admin"
                  state={{ tab: 'works' }}
                  className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-neutral-600 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-xs font-semibold transition-all font-sans"
                >
                  Cancel
                </Link>
                
                <button
                  type="submit" disabled={loading}
                  className="px-5 py-2 rounded-lg bg-neutral-950 dark:bg-zinc-100 text-white dark:text-zinc-950 font-semibold text-xs transition-all active:scale-98 flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50 hover:bg-neutral-850 dark:hover:bg-zinc-200 font-sans"
                >
                  {loading && <Icon icon="svg-spinners:180-ring" className="w-4 h-4" />}
                  <span>Save Case Study</span>
                </button>
              </div>

            </div>
          </form>
          </div>
        </div>
      </main>
    </div>
  );
}
