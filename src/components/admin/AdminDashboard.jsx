import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import AdminLayout from './AdminLayout';
import ConfirmationModal from './ConfirmationModal';
import HighlightReplaceModal from './HighlightReplaceModal';

export default function AdminDashboard() {
  const [works, setWorks] = useState([]);
  const [explorations, setExplorations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const token = localStorage.getItem('admin_token');

  // Delete confirmation state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: '', type: '' });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Highlight replace state
  const [highlightReplace, setHighlightReplace] = useState({
    isOpen: false,
    itemId: null,
    itemTitle: '',
    type: '',
    currentHighlighted: [],
    onResolve: null,
  });
  const [highlightLoading, setHighlightLoading] = useState(false);

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [worksRes, explorationsRes] = await Promise.all([
        fetch('/api/works'),
        fetch('/api/explorations'),
      ]);
      if (!worksRes.ok || !explorationsRes.ok) throw new Error('Failed to fetch data.');
      setWorks(await worksRes.json());
      setExplorations(await explorationsRes.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHighlightToggle = async (id, title, type) => {
    const list = type === 'work' ? works : explorations;
    const item = list.find((i) => i.id === id);
    if (!item) return;

    const newValue = item.is_highlighted ? 0 : 1;

    if (!newValue) {
      setHighlightLoading(true);
      try {
        const endpoint = type === 'work' ? '/api/admin/works' : '/api/admin/explorations';
        const res = await fetch(endpoint, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ id, is_highlighted: 0, title }),
        });
        const data = await res.json();
        if (res.ok) {
          showToast(`"${title}" removed from highlights.`);
          fetchData();
        } else {
          showToast(data.error || 'Failed to update.');
        }
      } catch {
        showToast('Network error.');
      } finally {
        setHighlightLoading(false);
      }
      return;
    }

    const max = type === 'work' ? 3 : 4;
    const currentCount = list.filter((i) => i.is_highlighted).length;

    if (currentCount >= max) {
      const highlighted = list.filter((i) => i.is_highlighted);
      setHighlightReplace({
        isOpen: true,
        itemId: id,
        itemTitle: title,
        type,
        currentHighlighted: highlighted,
      });
      return;
    }

    await performHighlight(id, title, type, true);
  };

  const handleReplaceSelect = async (oldItem) => {
    setHighlightLoading(true);
    try {
      const endpoint = highlightReplace.type === 'work' ? '/api/admin/works' : '/api/admin/explorations';
      await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id: oldItem.id, is_highlighted: 0, title: oldItem.title }),
      });
    } catch { /* ignore */ }

    await performHighlight(highlightReplace.itemId, highlightReplace.itemTitle, highlightReplace.type, true);
    setHighlightReplace({ ...highlightReplace, isOpen: false });
    setHighlightLoading(false);
  };

  const performHighlight = async (id, title, type, value) => {
    setHighlightLoading(true);
    try {
      const endpoint = type === 'work' ? '/api/admin/works' : '/api/admin/explorations';
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id, is_highlighted: value, title }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`"${title}" ${value ? 'added to' : 'removed from'} highlights.`);
        fetchData();
      } else {
        showToast(data.error || data.message || 'Failed to update.');
        fetchData();
      }
    } catch {
      showToast('Network error.');
    } finally {
      setHighlightLoading(false);
    }
  };

  const openDeleteModal = (id, title, type) => {
    setDeleteModal({ isOpen: true, id, title, type });
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      const endpoint = deleteModal.type === 'work' ? '/api/admin/works' : '/api/admin/explorations';
      const res = await fetch(`${endpoint}?id=${deleteModal.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        showToast(`"${deleteModal.title}" successfully deleted.`);
        fetchData();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to delete.');
      }
    } catch {
      showToast('Network error.');
    } finally {
      setDeleteLoading(false);
      setDeleteModal({ isOpen: false, id: null, title: '', type: '' });
    }
  };

  // Build real data from fetched items
  const totalItems = works.length + explorations.length;
  const highlightedCount = works.filter(w => w.is_highlighted).length + explorations.filter(e => e.is_highlighted).length;

  // Content per year bar data (real — from works)
  const yearCounts = {};
  works.forEach(w => {
    if (w.year) {
      yearCounts[w.year] = (yearCounts[w.year] || 0) + 1;
    }
  });
  const yearData = Object.entries(yearCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([year, count]) => ({ year, count }));

  const chartConfig = {
    'Case Studies': { label: 'Case Studies', color: 'var(--chart-1)' },
    Explorations: { label: 'Explorations', color: 'var(--chart-2)' },
    count: { label: 'Count', color: 'var(--chart-1)' },
  };

  // Content distribution pie data
  const contentDistData = [
    { name: 'Case Studies', value: works.length, fill: 'var(--chart-1)' },
    { name: 'Explorations', value: explorations.length, fill: 'var(--chart-2)' },
  ];

  return (
    <AdminLayout activeTab="dashboard">
      <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and monitor your portfolio showcase status.</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-card rounded-xl border shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-semibold uppercase font-sans">Case Studies</span>
              <Icon icon="lucide:folder" className="w-4.5 h-4.5 text-muted-foreground" />
            </div>
            <div>
              <span className="text-3xl font-bold text-foreground block tracking-tight">{loading ? '...' : works.length}</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">Active Showcase</span>
            </div>
          </div>
          <div className="p-6 bg-card rounded-xl border shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-semibold uppercase font-sans">Explorations</span>
              <Icon icon="lucide:compass" className="w-4.5 h-4.5 text-muted-foreground" />
            </div>
            <div>
              <span className="text-3xl font-bold text-foreground block tracking-tight">{loading ? '...' : explorations.length}</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">Visual shots</span>
            </div>
          </div>
          <div className="p-6 bg-card rounded-xl border shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-semibold uppercase font-sans">Highlights</span>
              <Icon icon="lucide:star" className="w-4.5 h-4.5 text-muted-foreground" />
            </div>
            <div>
              <span className="text-3xl font-bold text-foreground block tracking-tight">
                {loading ? '...' : highlightedCount}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">Featured on main page</span>
            </div>
          </div>
          <div className="p-6 bg-card rounded-xl border shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-semibold uppercase font-sans">Total Content</span>
              <Icon icon="lucide:file-text" className="w-4.5 h-4.5 text-muted-foreground" />
            </div>
            <div>
              <span className="text-3xl font-bold text-foreground block tracking-tight">{loading ? '...' : totalItems}</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">All items</span>
            </div>
          </div>
        </div>

        {/* Analytics Charts — Real Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Content Distribution Pie Chart */}
          <div className="bg-card rounded-xl border shadow-sm p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-foreground text-sm">Content Distribution</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Case Studies vs Explorations</p>
            </div>
            {totalItems === 0 ? (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
                No content yet — add items to see distribution.
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="aspect-[4/3] min-h-[200px]">
                <PieChart margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <Pie
                    data={contentDistData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="var(--background)"
                    strokeWidth={2}
                  >
                    <Cell fill="var(--chart-1)" />
                    <Cell fill="var(--chart-2)" />
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            )}
          </div>

          {/* Content Per Year Bar Chart */}
          <div className="bg-card rounded-xl border shadow-sm p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-foreground text-sm">Case Studies by Year</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Distribution across years</p>
            </div>
            {yearData.length === 0 ? (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
                No case study data available yet.
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="aspect-[4/3] min-h-[200px]">
                <BarChart data={yearData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--chart-1)" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ChartContainer>
            )}
          </div>

          {/* Analytics Status Card */}
          <div className="bg-card rounded-xl border shadow-sm p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-foreground text-sm">Visitor Analytics</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Google Analytics tracking status</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 border space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">GA4 Status</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-lg font-bold text-foreground">Active</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Property ID</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-foreground font-mono text-xs">G-TVV6202JTF</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Total Content</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-foreground">{totalItems}</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Database</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-foreground">D1 SQLite</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Detail Card */}
          <div className="bg-card rounded-xl border shadow-sm p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-foreground text-sm">Highlighted Items</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Currently featured on main page</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-2.5">
                  <Icon icon="lucide:folder" className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Case Studies</span>
                </div>
                <span className="text-sm font-bold text-foreground">{works.filter(w => w.is_highlighted).length}<span className="text-muted-foreground font-normal">/3</span></span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-2.5">
                  <Icon icon="lucide:compass" className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Explorations</span>
                </div>
                <span className="text-sm font-bold text-foreground">{explorations.filter(e => e.is_highlighted).length}<span className="text-muted-foreground font-normal">/4</span></span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/admin/works" className="flex-1 text-center px-3 py-2 rounded-lg border text-xs font-semibold text-foreground hover:bg-muted transition-colors">
                Manage Works
              </Link>
              <Link to="/admin/explorations" className="flex-1 text-center px-3 py-2 rounded-lg border text-xs font-semibold text-foreground hover:bg-muted transition-colors">
                Manage Explorations
              </Link>
            </div>
          </div>

        </div>

        {/* Highlighted Items Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Highlighted Works */}
          <div className="bg-card rounded-xl border shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground text-sm">Highlighted Case Studies</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Max 3 items shown on main page</p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                {works.filter(w => w.is_highlighted).length}/3
              </span>
            </div>
            {works.filter(w => w.is_highlighted).length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No highlighted case studies.</p>
            ) : (
              <div className="space-y-2">
                {works.filter(w => w.is_highlighted).map((work) => (
                  <div key={`hw-${work.id}`} className="flex items-center justify-between p-2.5 rounded-lg bg-background/50 border">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon icon="lucide:star" className="w-4 h-4 text-amber-500 shrink-0 fill-amber-500" />
                      <span className="text-sm font-medium text-foreground truncate">{work.title}</span>
                    </div>
                    <button
                      onClick={() => handleHighlightToggle(work.id, work.title, 'work')}
                      disabled={highlightLoading}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer px-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Highlighted Explorations */}
          <div className="bg-card rounded-xl border shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground text-sm">Highlighted Explorations</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Max 4 items shown on main page</p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                {explorations.filter(e => e.is_highlighted).length}/4
              </span>
            </div>
            {explorations.filter(e => e.is_highlighted).length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No highlighted explorations.</p>
            ) : (
              <div className="space-y-2">
                {explorations.filter(e => e.is_highlighted).map((exp) => (
                  <div key={`he-${exp.id}`} className="flex items-center justify-between p-2.5 rounded-lg bg-background/50 border">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon icon="lucide:star" className="w-4 h-4 text-amber-500 shrink-0 fill-amber-500" />
                      <span className="text-sm font-medium text-foreground truncate">{exp.title}</span>
                    </div>
                    <button
                      onClick={() => handleHighlightToggle(exp.id, exp.title, 'exploration')}
                      disabled={highlightLoading}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer px-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-foreground text-background shadow-lg text-sm font-semibold border animate-in fade-in slide-in-from-bottom-5 duration-300">
          <Icon icon="lucide:check-circle" className="w-4 h-4 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, title: '', type: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Item"
        confirmLabel="Delete"
        variant="danger"
        loading={deleteLoading}
      >
        <p>
          Are you sure you want to delete <strong className="text-foreground">"{deleteModal.title}"</strong>?
          This action cannot be undone.
        </p>
      </ConfirmationModal>

      {/* Highlight Replacement Modal */}
      <HighlightReplaceModal
        isOpen={highlightReplace.isOpen}
        onClose={() => setHighlightReplace({ ...highlightReplace, isOpen: false })}
        onSelect={handleReplaceSelect}
        currentHighlighted={highlightReplace.currentHighlighted}
        type={highlightReplace.type}
        title="Highlight Limit Reached"
        loading={highlightLoading}
      />
    </AdminLayout>
  );
}