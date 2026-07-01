import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import AdminLayout from './AdminLayout';
import ConfirmationModal from './ConfirmationModal';
import HighlightReplaceModal from './HighlightReplaceModal';

export default function WorksManagement() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const token = localStorage.getItem('admin_token');

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: '' });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [highlightReplace, setHighlightReplace] = useState({ isOpen: false, itemId: null, itemTitle: '', currentHighlighted: [] });
  const [highlightLoading, setHighlightLoading] = useState(false);

  useEffect(() => { if (token) fetchWorks(); }, [token]);

  const showToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(''), 3000); };

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/works', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed');
      setWorks(await res.json());
    } catch { showToast('Failed to fetch data.'); }
    finally { setLoading(false); }
  };

  const filtered = useMemo(() => {
    let result = works;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(w => w.title?.toLowerCase().includes(s) || w.company?.toLowerCase().includes(s) || w.category?.toLowerCase().includes(s) || w.slug?.toLowerCase().includes(s));
    }
    if (statusFilter !== 'all') result = result.filter(w => (w.status || 'draft') === statusFilter);
    return result;
  }, [works, search, statusFilter]);

  const statusColor = (s) => ({
    published: 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
    draft: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700',
    scheduled: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50',
  }[s] || 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700');

  const handleHighlightToggle = async (id, title) => {
    const item = works.find(w => w.id === id);
    if (!item) return;
    if (!item.is_highlighted) {
      if (works.filter(w => w.is_highlighted).length >= 3) { setHighlightReplace({ isOpen: true, itemId: id, itemTitle: title, currentHighlighted: works.filter(w => w.is_highlighted) }); return; }
      await performHighlight(id, title, true);
    } else {
      setHighlightLoading(true);
      try { await fetch('/api/admin/works', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ id, is_highlighted: 0, title }) }); showToast(`"${title}" removed.`); fetchWorks(); }
      catch { showToast('Network error.'); } finally { setHighlightLoading(false); }
    }
  };

  const handleReplaceSelect = async (oldItem) => {
    setHighlightLoading(true);
    try { await fetch('/api/admin/works', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ id: oldItem.id, is_highlighted: 0, title: oldItem.title }) }); } catch {}
    await performHighlight(highlightReplace.itemId, highlightReplace.itemTitle, true);
    setHighlightReplace({ ...highlightReplace, isOpen: false }); setHighlightLoading(false);
  };

  const performHighlight = async (id, title, value) => {
    setHighlightLoading(true);
    try {
      const res = await fetch('/api/admin/works', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ id, is_highlighted: value, title }) });
      if (res.ok) { showToast(`"${title}" ${value ? 'added to' : 'removed from'} highlights.`); fetchWorks(); }
      else { const d = await res.json(); showToast(d.message || 'Failed.'); fetchWorks(); }
    } catch { showToast('Network error.'); } finally { setHighlightLoading(false); }
  };

  const openDelete = (id, title) => setDeleteModal({ isOpen: true, id, title });
  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/works?id=${deleteModal.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { showToast(`"${deleteModal.title}" deleted.`); fetchWorks(); }
      else { const d = await res.json(); showToast(d.error || 'Failed.'); }
    } catch { showToast('Network error.'); }
    finally { setDeleteLoading(false); setDeleteModal({ isOpen: false, id: null, title: '' }); }
  };

  return (
    <AdminLayout activeTab="works">
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div><h1 className="text-2xl font-semibold tracking-tight text-foreground">Work Management</h1><p className="text-sm text-muted-foreground mt-1">Manage case studies displayed on your portfolio.</p></div>
          <Link to="/admin/work/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold transition-all shadow-sm self-start"><Icon icon="lucide:plus-circle" className="w-4 h-4" /> Add Case Study</Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Icon icon="lucide:search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-auto px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer min-h-[44px] sm:min-h-0">
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground"><Icon icon="svg-spinners:180-ring" className="w-8 h-8" /><span className="text-sm">Loading data...</span></div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">No results found.</div>
          ) : (
            <div className="overflow-x-auto relative">
              <table className="w-full text-left text-sm border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-muted border-b-2 border-border text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                    <th className="p-4 w-[44px] text-center">#</th>
                    <th className="p-4 min-w-[180px]">Project</th>
                    <th className="p-4 hidden md:table-cell min-w-[100px]">Company</th>
                    <th className="p-4 hidden md:table-cell min-w-[80px]">Category</th>
                    <th className="p-4 hidden md:table-cell min-w-[80px]">Status</th>
                    <th className="p-4 hidden md:table-cell min-w-[55px]">Year</th>
                    <th className="p-4 min-w-[100px]">Highlight</th>
                    <th className="p-4 text-right w-[100px] sticky right-0 z-20 bg-muted border-l border-border shadow-[-8px_0_15px_-3px_rgba(0,0,0,0.12)]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((work, idx) => (
                    <tr key={work.id} className="odd:bg-muted/20 even:bg-transparent hover:bg-muted/60 transition-colors">
                      <td className="p-4 text-center text-xs text-muted-foreground font-mono">{idx + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {work.logo ? <img src={work.logo} alt="" className="w-8 h-8 rounded-lg bg-background object-contain p-1 border dark:invert shrink-0" /> : <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center border shrink-0"><Icon icon="lucide:image" className="w-4 h-4 text-muted-foreground" /></div>}
                          <div className="flex flex-col min-w-0"><span className="font-semibold text-foreground truncate max-w-[180px]">{work.title}</span><span className="text-xs text-muted-foreground font-mono">/{work.slug}</span></div>
                        </div>
                      </td>
                      <td className="p-4 text-foreground/80 font-medium hidden md:table-cell">{work.company}</td>
                      <td className="p-4 hidden md:table-cell"><span className="px-2.5 py-1 rounded-md bg-muted text-muted-foreground text-xs font-semibold">{work.category}</span></td>
                      <td className="p-4 hidden md:table-cell"><span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold border ${statusColor(work.status)}`}>{(work.status || 'draft').charAt(0).toUpperCase() + (work.status || 'draft').slice(1)}</span></td>
                      <td className="p-4 text-muted-foreground font-mono text-xs hidden md:table-cell">{work.year}</td>
                      <td className="p-4">
                        <button onClick={() => handleHighlightToggle(work.id, work.title)} disabled={highlightLoading} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${work.is_highlighted ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400' : 'bg-background border text-muted-foreground hover:border-amber-200 dark:hover:border-amber-800/50'}`}><Icon icon={work.is_highlighted ? 'lucide:star' : 'lucide:star'} className={`w-3.5 h-3.5 ${work.is_highlighted ? 'fill-amber-500' : ''}`} />{work.is_highlighted ? 'Featured' : 'Feature'}</button>
                      </td>
                      <td className="p-4 text-right space-x-1 whitespace-nowrap sticky right-0 z-10 bg-card border-l border-border shadow-[-8px_0_15px_-3px_rgba(0,0,0,0.12)]">
                        <Link to={`/admin/work/edit/${work.id}`} className="inline-flex p-2 rounded-lg border text-muted-foreground hover:bg-muted transition-colors" title="Edit"><Icon icon="lucide:pen" className="w-4 h-4" /></Link>
                        <button onClick={() => openDelete(work.id, work.title)} className="inline-flex p-2 rounded-lg border border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors cursor-pointer" title="Delete"><Icon icon="lucide:trash-2" className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {toastMessage && (<div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-foreground text-background shadow-lg text-sm font-semibold animate-in fade-in slide-in-from-bottom-5 duration-300"><Icon icon="lucide:check-circle" className="w-4 h-4 text-emerald-500" /><span>{toastMessage}</span></div>)}
      <ConfirmationModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, id: null, title: '' })} onConfirm={handleDeleteConfirm} title="Delete Case Study" confirmLabel="Delete" variant="danger" loading={deleteLoading}><p>Are you sure you want to delete <strong className="text-foreground">"{deleteModal.title}"</strong>? This action cannot be undone.</p></ConfirmationModal>
      <HighlightReplaceModal isOpen={highlightReplace.isOpen} onClose={() => setHighlightReplace({ ...highlightReplace, isOpen: false })} onSelect={handleReplaceSelect} currentHighlighted={highlightReplace.currentHighlighted} type="work" title="Highlight Limit Reached" loading={highlightLoading} />
    </AdminLayout>
  );
}