import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function ExplorationEditor() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [keywords, setKeywords] = useState('');
  const [isHighlighted, setIsHighlighted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  // Image upload state
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

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
      const response = await fetch(`/api/admin/explorations?id=${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch data.');

      const exp = await response.json();
      if (!exp) throw new Error('Exploration not found.');

      setTitle(exp.title);
      setDescription(exp.description || '');
      setImage(exp.image);
      setImagePreview(exp.image || '');
      setAspectRatio(exp.aspect_ratio || '1:1');
      setKeywords(exp.keywords || '');
      setIsHighlighted(!!exp.is_highlighted);
    } catch (err) {
      setError(err.message || 'An error occurred while loading data.');
    } finally {
      setFetching(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const objectUrl = URL.createObjectURL(file);
      const mockPath = `/images/exploration/${file.name}`;
      setImagePreview(objectUrl);
      setImage(mockPath);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!title || !image) {
      setError('Title and Image are required.');
      setLoading(false);
      return;
    }

    const payload = {
      title,
      category: '',
      description,
      image,
      aspect_ratio: aspectRatio,
      keywords,
      is_highlighted: isHighlighted,
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
        navigate('/admin/explorations');
      } else {
        setError(resData.error || 'Failed to save data.');
      }
    } catch {
      setError('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Icon icon="svg-spinners:180-ring" className="w-8 h-8" />
          <span className="text-sm font-medium">Loading data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <form onSubmit={handleSave} className="flex flex-col h-screen">

        {/* ─── TOP HEADER BAR ─── */}
        <header className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-b bg-card/80 backdrop-blur shrink-0 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              to="/admin/explorations"
              className="flex items-center justify-center w-8 h-8 rounded-lg border hover:bg-muted transition-all cursor-pointer shrink-0 text-muted-foreground"
              aria-label="Back to Exploration Management"
            >
              <Icon icon="lucide:arrow-left" className="w-5 h-5" />
            </Link>
            <span className="text-xs text-muted-foreground font-medium">
              {isEdit ? 'Edit Exploration' : 'New Exploration'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/admin/explorations"
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

        {/* ─── MAIN CONTENT ─── */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-[700px] mx-auto space-y-6">

            {/* Image — Upload + URL */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Image</label>
              
              {/* Preview / Upload area */}
              {imagePreview ? (
                <div className="relative group rounded-xl border overflow-hidden bg-muted/30">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all cursor-pointer"
                      title="Replace image"
                    >
                      <Icon icon="lucide:image-up" className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => { setImagePreview(''); setImage(''); }}
                      className="p-2 rounded-lg bg-white/20 text-red-300 hover:bg-red-500/60 hover:text-white transition-all cursor-pointer"
                      title="Remove image"
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
                  className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-2 bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                >
                  <Icon icon="lucide:image-up" className="w-8 h-8 text-muted-foreground/60" />
                  <span className="text-xs text-muted-foreground text-center">
                    Drop image or click to upload
                  </span>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* URL Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-muted-foreground">Or paste image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => { setImage(e.target.value); setImagePreview(e.target.value); }}
                  placeholder="https://images.unsplash.com/... or /images/exploration/..."
                  className="w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all font-mono text-xs"
                />
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Aspect Ratio</label>
              <select
                value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all cursor-pointer">
                <option value="1:1">1:1 (Square)</option>
                <option value="16:9">16:9 (Horizontal)</option>
                <option value="9:16">9:16 (Vertical)</option>
              </select>
            </div>

            {/* Keywords */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Keywords</label>
              <input
                type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)}
                placeholder="Website, UI, Landing Page, Design (comma separated)"
                className="w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
              <p className="text-xs text-muted-foreground">Separate keywords with commas.</p>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</label>
              <textarea
                required rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description of the design exploration..."
                className="w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-y min-h-[100px]" />
            </div>

            {/* Highlight Toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Show as Highlight</label>
              <button
                type="button"
                onClick={() => setIsHighlighted(!isHighlighted)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  isHighlighted
                    ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400'
                    : 'bg-card border text-muted-foreground hover:border-amber-200 dark:hover:border-amber-800/50'
                }`}
              >
                <Icon icon={isHighlighted ? 'lucide:star' : 'lucide:star'} className={`w-4 h-4 ${isHighlighted ? 'fill-amber-500' : ''}`} />
                {isHighlighted ? 'Featured on main page' : 'Not featured (max 4)'}
              </button>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}