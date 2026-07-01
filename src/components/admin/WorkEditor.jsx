import React, { useState, useEffect, useRef, useCallback, useMemo, useReducer } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import RichTextEditor from './RichTextEditor';

// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_FORM = {
  title: '',
  slug: '',
  desc: '',
  content: '',
  company: '',
  category: '',
  readingTime: '',
  year: '',
  heroImage: '',
  logo: '',
  liveUrl: '',
  industryInput: '',
  isHighlighted: false,
  designStack: [],
  sections: [],
  status: 'draft',
  scheduledAt: '',
  contributors: [],
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'LOAD':
      return { ...state, ...action.payload };
    case 'RESET':
      return INITIAL_FORM;
    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ImageAssetField
// ─────────────────────────────────────────────────────────────────────────────
function ImageAssetField({ label, value, onChange, placeholder }) {
  const fileInputRef = useRef(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const objectUrl = URL.createObjectURL(file);
      const mockPath = `/images/work/${file.name}`;
      setPreview(objectUrl);
      onChange(mockPath);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [onChange]);

  const handleLinkSubmit = useCallback(() => {
    if (linkUrl.trim()) {
      onChange(linkUrl.trim());
      setPreview(linkUrl.trim());
      setLinkUrl('');
      setShowLinkInput(false);
    }
  }, [linkUrl, onChange]);

  const clearAsset = useCallback(() => {
    onChange('');
    setPreview('');
  }, [onChange]);

  useEffect(() => {
    if (value && value !== preview && !preview.startsWith('blob:')) {
      setPreview(value);
    }
  }, [value, preview]);

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </label>

      {preview ? (
        <div className="relative group rounded-lg border overflow-hidden bg-muted/30">
          <img
            src={preview}
            alt={label}
            className="w-full h-28 object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all cursor-pointer"
              title="Replace image"
              aria-label={`Replace ${label}`}
            >
              <Icon icon="lucide:image-up" className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={clearAsset}
              className="p-1.5 rounded-lg bg-white/20 text-red-300 hover:bg-red-500/60 hover:text-white transition-all cursor-pointer"
              title="Remove image"
              aria-label={`Remove ${label}`}
            >
              <Icon icon="lucide:trash-2" className="w-4 h-4" />
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
              <Icon icon="svg-spinners:180-ring" className="w-5 h-5 text-primary" />
            </div>
          )}
        </div>
      ) : (
        <div
          className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-1.5 bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer min-h-[80px]"
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label={`Upload ${label}`}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
        >
          <Icon icon="lucide:image-up" className="w-6 h-6 text-muted-foreground/60" />
          <span className="text-[10px] text-muted-foreground text-center leading-tight">
            Drop image or click<br />to upload
          </span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all font-mono text-xs"
        />
        <button
          type="button"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className={`shrink-0 p-2 rounded-lg border transition-all cursor-pointer ${showLinkInput ? 'bg-primary/10 border-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
          title="Insert from URL"
          aria-label="Insert image from URL"
        >
          <Icon icon="lucide:link" className="w-4 h-4" />
        </button>
      </div>

      {showLinkInput && (
        <div className="flex items-center gap-1.5 bg-muted/30 p-2 rounded-lg border">
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 px-2.5 py-1.5 rounded-md border bg-background text-xs focus:outline-none text-foreground"
            onKeyDown={(e) => { if (e.key === 'Enter') handleLinkSubmit(); }}
            autoFocus
          />
          <button
            type="button"
            onClick={handleLinkSubmit}
            className="px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground font-semibold text-xs cursor-pointer hover:bg-primary/90 shrink-0"
          >
            Insert
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TagChipInput
// ─────────────────────────────────────────────────────────────────────────────
function TagChipInput({ label, tags, onChange, placeholder }) {
  const [inputValue, setInputValue] = useState('');

  const addTag = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed]);
    setInputValue('');
  }, [inputValue, tags, onChange]);

  const removeTag = useCallback((idx) => {
    onChange(tags.filter((_, i) => i !== idx));
  }, [tags, onChange]);

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-lg border bg-background focus-within:ring-2 focus-within:ring-ring transition-all">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted border text-xs font-medium text-foreground"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
              aria-label={`Remove tag ${tag}`}
            >
              <Icon icon="lucide:x" className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); addTag(); }
            if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
              onChange(tags.slice(0, -1));
            }
          }}
          placeholder={tags.length === 0 ? placeholder : 'Add more...'}
          className="flex-1 min-w-[80px] bg-transparent outline-none text-xs text-foreground placeholder:text-muted-foreground/50"
        />
      </div>
      <p className="text-[10px] text-muted-foreground">Press Enter to add each tag</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WorkEditor — Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function WorkEditor() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const tokenRef = useRef(localStorage.getItem('admin_token'));
  const token = tokenRef.current;

  const [form, dispatch] = useReducer(formReducer, INITIAL_FORM);

  const [newStackName, setNewStackName] = useState('');
  const [newStackIcon, setNewStackIcon] = useState('');
  const [newStackColor, setNewStackColor] = useState('');

  const [newSectionId, setNewSectionId] = useState('');
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Contributor input
  const [contributorInput, setContributorInput] = useState('');

  const hasChanges = useRef(false);
  const savedRef = useRef(false);

  const setField = useCallback((field, value) => {
    hasChanges.current = true;
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges.current && !savedRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleSaveRef = useRef(null);
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSaveRef.current?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (isEdit) fetchWorkDetail();
  }, [id, token]);

  const fetchWorkDetail = async () => {
    setFetching(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/works?id=${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch data.');

      const work = await response.json();
      if (!work) throw new Error('Case study not found.');

      let industryTags = [];
      if (work.industry) {
        try {
          const arr = typeof work.industry === 'string' ? JSON.parse(work.industry) : work.industry;
          industryTags = Array.isArray(arr) ? arr : [];
        } catch { industryTags = []; }
      }

      let designStack = [];
      if (work.design_stack) {
        try { designStack = typeof work.design_stack === 'string' ? JSON.parse(work.design_stack) : work.design_stack; }
        catch { designStack = []; }
      }

      let sections = [];
      if (work.sections) {
        try { sections = typeof work.sections === 'string' ? JSON.parse(work.sections) : work.sections; }
        catch { sections = []; }
      }

      let contributors = [];
      if (work.contributors) {
        try { contributors = typeof work.contributors === 'string' ? JSON.parse(work.contributors) : work.contributors; }
        catch { contributors = []; }
      }

      dispatch({
        type: 'LOAD',
        payload: {
          title: work.title || '',
          slug: work.slug || '',
          desc: work.description || work.desc || '',
          content: work.content || '',
          company: work.company || '',
          category: work.category || '',
          readingTime: work.reading_time || work.readingTime || '',
          year: work.year || '',
          heroImage: work.hero_image || work.heroImage || '',
          logo: work.logo || '',
          liveUrl: work.live_url || work.liveUrl || '',
          industryInput: industryTags,
          isHighlighted: !!work.is_highlighted,
          designStack,
          sections,
          status: work.status || 'draft',
          scheduledAt: work.scheduled_at || '',
          contributors,
        },
      });
    } catch (err) {
      setError(err.message || 'An error occurred while loading data.');
    } finally {
      setFetching(false);
    }
  };

  const handleSave = useCallback(async (e) => {
    if (e?.preventDefault) e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      title: form.title,
      slug: form.slug,
      desc: form.desc,
      content: form.content,
      company: form.company,
      category: form.category,
      readingTime: form.readingTime,
      year: form.year,
      heroImage: form.heroImage,
      logo: form.logo || null,
      liveUrl: form.liveUrl || null,
      industry: Array.isArray(form.industryInput) ? form.industryInput : [],
      designStack: form.designStack,
      sections: form.sections,
      is_highlighted: form.isHighlighted,
      status: form.status,
      scheduled_at: form.status === 'scheduled' ? form.scheduledAt : null,
      contributors: form.contributors,
    };
    if (isEdit) payload.id = parseInt(id);

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
        savedRef.current = true;
        hasChanges.current = false;
        navigate('/admin/works');
      } else {
        setError(resData.error || 'Failed to save data.');
      }
    } catch {
      setError('A network error occurred. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [form, id, isEdit, token, navigate]);

  useEffect(() => {
    handleSaveRef.current = handleSave;
  }, [handleSave]);

  const addStack = useCallback(() => {
    if (!newStackName || !newStackIcon) return;
    setField('designStack', [
      ...form.designStack,
      { name: newStackName, icon: newStackIcon, color: newStackColor || null },
    ]);
    setNewStackName(''); setNewStackIcon(''); setNewStackColor('');
  }, [newStackName, newStackIcon, newStackColor, form.designStack, setField]);

  const removeStack = useCallback((i) => {
    setField('designStack', form.designStack.filter((_, idx) => idx !== i));
  }, [form.designStack, setField]);

  const addSection = useCallback(() => {
    if (!newSectionId || !newSectionTitle) return;
    setField('sections', [...form.sections, { id: newSectionId, title: newSectionTitle }]);
    setNewSectionId(''); setNewSectionTitle('');
  }, [newSectionId, newSectionTitle, form.sections, setField]);

  const removeSection = useCallback((i) => {
    setField('sections', form.sections.filter((_, idx) => idx !== i));
  }, [form.sections, setField]);

  const addContributor = useCallback(() => {
    const url = contributorInput.trim();
    if (!url) return;
    const username = url.replace(/\/$/, '').split('/').pop();
    setField('contributors', [...form.contributors, { linkedin: url, username }]);
    setContributorInput('');
  }, [contributorInput, form.contributors, setField]);

  const removeContributor = useCallback((i) => {
    setField('contributors', form.contributors.filter((_, idx) => idx !== i));
  }, [form.contributors, setField]);

  const autoGenerateTOC = useCallback(() => {
    if (!form.content) return;
    setTimeout(() => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(form.content, 'text/html');
      const h2Elements = doc.querySelectorAll('h2');
      const newSections = Array.from(h2Elements).map((h2) => {
        const t = h2.textContent || '';
        const sectionId = h2.getAttribute('id') ||
          t.toLowerCase().trim()
            .replace(/\s+/g, '-')
            .replace(/&/g, '-and-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');
        return { id: sectionId, title: t };
      });
      if (newSections.length > 0) setField('sections', newSections);
    }, 0);
  }, [form.content, setField]);

  const charCount = useMemo(
    () => form.content.replace(/<[^>]*>/g, '').length,
    [form.content]
  );

  const statusOptions = [
    { value: 'draft', label: 'Draft', color: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300' },
    { value: 'published', label: 'Published', color: 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' },
    { value: 'scheduled', label: 'Scheduled', color: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400' },
  ];

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Icon icon="svg-spinners:180-ring" className="w-8 h-8" />
          <span className="text-sm font-medium">Loading case study data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <form onSubmit={handleSave} className="h-screen flex flex-col">

        {/* ─── TOP HEADER BAR ─── */}
        <header className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-b bg-card/80 backdrop-blur shrink-0 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              to="/admin/works"
              className="flex items-center justify-center w-8 h-8 rounded-lg border hover:bg-muted transition-all cursor-pointer shrink-0 text-muted-foreground"
              aria-label="Back to Work Management"
            >
              <Icon icon="lucide:arrow-left" className="w-5 h-5" />
            </Link>
            <span className="text-xs text-muted-foreground font-medium">
              {isEdit ? 'Edit Case Study' : 'New Case Study'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Sidebar toggle — visible on < lg */}
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg border hover:bg-muted transition-colors cursor-pointer text-muted-foreground"
              aria-label="Toggle panel"
            >
              <Icon icon={sidebarOpen ? 'lucide:panel-right-close' : 'lucide:panel-right-open'} className="w-4 h-4" />
            </button>
            <Link
              to="/admin/works"
              className="px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm font-medium text-foreground hover:bg-muted transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 sm:px-5 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs sm:text-sm transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {loading && <Icon icon="svg-spinners:180-ring" className="w-4 h-4" />}
              {isEdit ? 'Update' : 'Publish'}
            </button>
          </div>
        </header>

        {error && (
          <div className="mx-4 sm:mx-6 mt-3 p-3 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive flex items-center gap-2 text-sm shrink-0">
            <Icon icon="lucide:triangle-alert" className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ─── MAIN CONTENT: Editor + Sidebar ─── */}
        <div className="flex-1 flex overflow-hidden relative">

          {/* ── LEFT: Editor Area ── */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:border-r">

            <div className="flex items-center gap-1 px-4 pt-3 pb-0 shrink-0">
              <button
                type="button"
                onClick={() => setPreviewMode(false)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-t-xl text-sm font-medium transition-all border-b-2 ${
                  !previewMode
                    ? 'text-foreground border-primary bg-card'
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                <Icon icon="lucide:pen-line" className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode(true)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-t-xl text-sm font-medium transition-all border-b-2 ${
                  previewMode
                    ? 'text-foreground border-primary bg-card'
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                <Icon icon="lucide:eye" className="w-4 h-4" />
                <span>Preview</span>
              </button>

              <div className="ml-auto text-xs text-muted-foreground mr-2">
                {charCount.toLocaleString()} chars
              </div>
            </div>

            <div className="flex-1 overflow-hidden rounded-tr-xl border-t bg-card mx-0">
              {previewMode ? (
                <div className="h-full overflow-y-auto p-6 sm:p-10">
                  <div className="max-w-[740px] mx-auto case-study-content">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: form.content || '<p class="text-muted-foreground italic text-center py-20">No content yet. Switch to Edit mode to start writing.</p>',
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full overflow-hidden">
                  <RichTextEditor
                    value={form.content}
                    onChange={(val) => setField('content', val)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Metadata Sidebar ── */}
          {/* Desktop: always visible, Mobile: overlay when toggled */}
          {sidebarOpen && <div className="lg:hidden fixed inset-0 z-10 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}
          <aside className={`flex-shrink-0 overflow-y-auto bg-card transition-all duration-300
            ${sidebarOpen ? 'fixed inset-y-0 right-0 z-20 w-full sm:w-[380px] shadow-2xl border-l' : 'hidden lg:block lg:relative lg:w-[380px]'}`}
          >
            {/* Close button on mobile overlay */}
            <div className="lg:hidden flex justify-end p-2">
              <button type="button" onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-muted cursor-pointer text-muted-foreground">
                <Icon icon="lucide:x" className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">

              {/* Post Settings */}
              <div className="bg-card rounded-xl border p-4 space-y-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Post Settings</h3>

                {/* Title — moved from navbar */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Title</label>
                  <textarea
                    required
                    value={form.title}
                    onChange={(e) => setField('title', e.target.value)}
                    placeholder="Case Study Title..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-y"
                    style={{ minHeight: '2.5rem', maxHeight: '6rem' }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Slug</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setField('slug', e.target.value)}
                    placeholder="case-study-slug"
                    className="w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all font-mono text-xs"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</label>
                  <div className="flex gap-1.5">
                    {statusOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setField('status', opt.value)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                          form.status === opt.value
                            ? `${opt.color} border-current/30`
                            : 'bg-background border text-muted-foreground hover:border-foreground/20'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {form.status === 'scheduled' && (
                    <input
                      type="datetime-local"
                      value={form.scheduledAt}
                      onChange={(e) => setField('scheduledAt', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Summary</label>
                  <textarea
                    required
                    rows={3}
                    value={form.desc}
                    onChange={(e) => setField('desc', e.target.value)}
                    placeholder="Brief description shown on cards..."
                    className="w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-y"
                    style={{ minHeight: '4.5rem', maxHeight: '10rem' }}
                  />
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-card rounded-xl border p-4 space-y-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Metadata</h3>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Company</label>
                  <input
                    type="text"
                    required
                    value={form.company}
                    onChange={(e) => setField('company', e.target.value)}
                    placeholder="Client name"
                    className="w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Category</label>
                    <input
                      type="text"
                      required
                      value={form.category}
                      onChange={(e) => setField('category', e.target.value)}
                      placeholder="Enterprise / SaaS"
                      className="w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Year</label>
                    <input
                      type="text"
                      required
                      value={form.year}
                      onChange={(e) => setField('year', e.target.value)}
                      placeholder="2025"
                      className="w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Read Time</label>
                  <input
                    type="text"
                    required
                    value={form.readingTime}
                    onChange={(e) => setField('readingTime', e.target.value)}
                    placeholder="10 min read"
                    className="w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  />
                </div>

                <TagChipInput
                  label="Industry"
                  tags={Array.isArray(form.industryInput) ? form.industryInput : []}
                  onChange={(tags) => setField('industryInput', tags)}
                  placeholder="HRMIS, B2B, Enterprise..."
                />
              </div>

              {/* Contributors */}
              <div className="bg-card rounded-xl border p-4 space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contributors</h3>
                <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                  {form.contributors.length === 0 ? (
                    <span className="text-xs text-muted-foreground italic">No contributors</span>
                  ) : (
                    form.contributors.map((c, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted border text-xs">
                        <Icon icon="lucide:linkedin" className="w-3 h-3 text-blue-600" />
                        <span className="text-foreground">{c.username}</span>
                        <button
                          type="button"
                          onClick={() => removeContributor(idx)}
                          className="text-muted-foreground hover:text-destructive cursor-pointer"
                        >
                          <Icon icon="lucide:x" className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={contributorInput}
                    onChange={(e) => setContributorInput(e.target.value)}
                    placeholder="LinkedIn URL (e.g. linkedin.com/in/username)"
                    className="flex-1 px-2.5 py-1.5 rounded-md border bg-background text-xs focus:outline-none text-foreground"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addContributor(); } }}
                  />
                  <button
                    type="button"
                    onClick={addContributor}
                    className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-semibold text-xs cursor-pointer hover:bg-primary/90"
                  >
                    Add
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground">Paste full LinkedIn profile URL</p>
              </div>

              {/* Assets */}
              <div className="bg-card rounded-xl border p-4 space-y-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assets</h3>
                <div className="space-y-4">
                  <ImageAssetField
                    label="Hero Image"
                    value={form.heroImage}
                    onChange={(val) => setField('heroImage', val)}
                    placeholder="/images/work/thumbnail.webp"
                  />
                  <ImageAssetField
                    label="Logo (Optional)"
                    value={form.logo}
                    onChange={(val) => setField('logo', val)}
                    placeholder="/images/client_logo/logo.svg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Live URL (Optional)</label>
                  <input
                    type="text"
                    value={form.liveUrl}
                    onChange={(e) => setField('liveUrl', e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  />
                </div>
              </div>

              {/* Highlight Toggle */}
              <div className="bg-card rounded-xl border p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Highlight</h3>
                <button
                  type="button"
                  onClick={() => setField('isHighlighted', !form.isHighlighted)}
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                    form.isHighlighted
                      ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400'
                      : 'bg-card border text-muted-foreground hover:border-amber-200 dark:hover:border-amber-800/50'
                  }`}
                >
                  <Icon icon={form.isHighlighted ? 'lucide:star' : 'lucide:star'} className={`w-4 h-4 ${form.isHighlighted ? 'fill-amber-500' : ''}`} />
                  {form.isHighlighted ? 'Featured (max 3)' : 'Feature on homepage'}
                </button>
              </div>

              {/* Design Stack */}
              <div className="bg-card rounded-xl border p-4 space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Design Stack</h3>
                <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                  {form.designStack.length === 0 ? (
                    <span className="text-xs text-muted-foreground italic">No items</span>
                  ) : (
                    form.designStack.map((tech, idx) => (
                      <div key={idx} className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted border text-xs">
                        <Icon icon={tech.icon} style={tech.color ? { color: tech.color } : undefined} className="w-3.5 h-3.5" />
                        <span>{tech.name}</span>
                        <button
                          type="button"
                          onClick={() => removeStack(idx)}
                          className="text-destructive hover:text-destructive/80 cursor-pointer"
                        >
                          <Icon icon="lucide:x" className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="grid grid-cols-1 gap-1.5 bg-muted/30 p-2.5 rounded-lg border">
                  <input
                    type="text"
                    value={newStackName}
                    onChange={(e) => setNewStackName(e.target.value)}
                    placeholder="Name (e.g. Figma)"
                    className="w-full px-2.5 py-1.5 rounded-md border bg-background text-xs focus:outline-none text-foreground"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addStack(); } }}
                  />
                  <input
                    type="text"
                    value={newStackIcon}
                    onChange={(e) => setNewStackIcon(e.target.value)}
                    placeholder="Iconify ID (e.g. logos:figma)"
                    className="w-full px-2.5 py-1.5 rounded-md border bg-background text-xs focus:outline-none text-foreground"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addStack(); } }}
                  />
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={newStackColor}
                      onChange={(e) => setNewStackColor(e.target.value)}
                      placeholder="Color (optional)"
                      className="flex-1 px-2.5 py-1.5 rounded-md border bg-background text-xs focus:outline-none text-foreground"
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addStack(); } }}
                    />
                    <button
                      type="button"
                      onClick={addStack}
                      className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-semibold text-xs cursor-pointer hover:bg-primary/90"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Sections / TOC */}
              <div className="bg-card rounded-xl border p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sections (TOC)</h3>
                  <button
                    type="button"
                    onClick={autoGenerateTOC}
                    className="text-[10px] font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                    title="Auto-detect h2 headings from content"
                  >
                    <Icon icon="lucide:refresh-cw" className="w-3 h-3" />
                    Auto-detect
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                  {form.sections.length === 0 ? (
                    <span className="text-xs text-muted-foreground italic">No sections</span>
                  ) : (
                    form.sections.map((sec, idx) => (
                      <div key={idx} className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted border text-xs">
                        <span className="font-mono text-muted-foreground">#{sec.id}</span>
                        <span className="text-foreground">{sec.title}</span>
                        <button
                          type="button"
                          onClick={() => removeSection(idx)}
                          className="text-destructive cursor-pointer"
                        >
                          <Icon icon="lucide:x" className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="grid grid-cols-1 gap-1.5 bg-muted/30 p-2.5 rounded-lg border">
                  <input
                    type="text"
                    value={newSectionId}
                    onChange={(e) => setNewSectionId(e.target.value)}
                    placeholder="ID (slug, e.g. the-problem)"
                    className="w-full px-2.5 py-1.5 rounded-md border bg-background text-xs focus:outline-none text-foreground"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSection(); } }}
                  />
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      placeholder="Title (e.g. The Problem)"
                      className="flex-1 px-2.5 py-1.5 rounded-md border bg-background text-xs focus:outline-none text-foreground"
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSection(); } }}
                    />
                    <button
                      type="button"
                      onClick={addSection}
                      className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-semibold text-xs cursor-pointer hover:bg-primary/90"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}