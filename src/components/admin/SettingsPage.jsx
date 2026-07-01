import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import AdminLayout from './AdminLayout';

export default function SettingsPage() {
  const token = localStorage.getItem('admin_token');
  const [toastMessage, setToastMessage] = useState('');

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Activity log states
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityPage, setActivityPage] = useState(1);
  const [activityTotal, setActivityTotal] = useState(0);
  const [activityError, setActivityError] = useState('');
  const [activitySearch, setActivitySearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    fetchActivities();
  }, [activityPage]);

  const fetchActivities = async () => {
    setActivityLoading(true);
    setActivityError('');
    try {
      const res = await fetch(`/api/admin/settings?type=activity_log&page=${activityPage}&limit=30`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setActivities(data.data || []);
      setActivityTotal(data.total || 0);
    } catch (e) {
      setActivityError('Failed to load activity log.');
    } finally {
      setActivityLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (currentPassword === newPassword) {
      setPasswordError('New password must be different from current password.');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'change_password',
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        fetchActivities(); // Refresh log
      } else {
        setPasswordError(data.error || 'Failed to update password.');
      }
    } catch {
      setPasswordError('Network error.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const totalPages = Math.ceil(activityTotal / 30);

  const getActionBadge = (action) => {
    const styles = {
      create: 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
      update: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50',
      delete: 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50',
      highlight: 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
      unhighlight: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700',
      password_change: 'bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/50',
      login: 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
    };
    return styles[action] || styles.update;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <AdminLayout activeTab="settings">
      <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage admin account and view activity logs.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Change Password */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl border shadow-sm p-6 space-y-5">
              <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Change Password</h3>
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {/* Current Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Current Password</label>
                  <div className="relative">
                    <Icon icon="solar:lock-password-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full h-10 pl-10 pr-10 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground cursor-pointer" tabIndex={-1}>
                      <Icon icon={showCurrent ? 'solar:eye-closed-linear' : 'solar:eye-linear'} className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">New Password</label>
                  <div className="relative">
                    <Icon icon="solar:lock-password-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 chars)"
                      className="w-full h-10 pl-10 pr-10 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground cursor-pointer" tabIndex={-1}>
                      <Icon icon={showNew ? 'solar:eye-closed-linear' : 'solar:eye-linear'} className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Confirm New Password</label>
                  <div className="relative">
                    <Icon icon="solar:lock-password-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full h-10 pl-10 pr-10 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground cursor-pointer" tabIndex={-1}>
                      <Icon icon={showConfirm ? 'solar:eye-closed-linear' : 'solar:eye-linear'} className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {passwordError && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2.5">
                    <Icon icon="solar:danger-triangle-bold" className="w-4 h-4 text-destructive flex-shrink-0" />
                    <span className="text-sm text-destructive font-medium">{passwordError}</span>
                  </div>
                )}
                {passwordSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 flex items-center gap-2.5">
                    <Icon icon="solar:check-circle-bold" className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">{passwordSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all active:scale-[0.98] flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {passwordLoading && <Icon icon="svg-spinners:180-ring" className="w-4 h-4" />}
                  Update Password
                </button>
              </form>
            </div>

            {/* DB Info */}
            <div className="bg-card rounded-xl border shadow-sm p-6 space-y-4">
              <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Database Connection</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground block text-xs">D1 Binding</span>
                  <span className="font-semibold text-foreground mt-1 block font-mono">hamzahdesign_db</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Status</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active (Local)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Activity Log</h3>
                <p className="text-xs text-muted-foreground mt-1">Track all admin actions on items and settings.</p>
              </div>

              {activityLoading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                  <Icon icon="svg-spinners:180-ring" className="w-6 h-6" />
                  <span className="text-sm">Loading activity log...</span>
                </div>
              ) : activityError ? (
                <div className="p-8 text-center text-sm text-destructive">{activityError}</div>
              ) : activities.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">No activity recorded yet.</div>
              ) : (
                <>
                  {/* Search & Filter */}
                  <div className="p-4 border-b flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Icon icon="lucide:search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input type="text" value={activitySearch} onChange={(e) => setActivitySearch(e.target.value)} placeholder="Search activity..." className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
                    </div>
                    <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="w-full sm:w-auto px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer min-h-[44px] sm:min-h-0">
                      <option value="all">All Actions</option>
                      <option value="create">Create</option>
                      <option value="update">Update</option>
                      <option value="delete">Delete</option>
                      <option value="highlight">Highlight</option>
                      <option value="unhighlight">Unhighlight</option>
                      <option value="login">Login</option>
                      <option value="password_change">Password Change</option>
                    </select>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                      <thead>
                        <tr className="bg-muted border-b-2 border-border text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                          <th className="p-4 min-w-[100px]">Action</th>
                          <th className="p-4 min-w-[120px]">Entity</th>
                          <th className="p-4 hidden md:table-cell min-w-[140px]">Details</th>
                          <th className="p-4 hidden md:table-cell min-w-[130px]">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {activities
                          .filter(log => {
                            if (actionFilter !== 'all' && log.action !== actionFilter) return false;
                            if (activitySearch) {
                              const s = activitySearch.toLowerCase();
                              return (log.entity_title || '').toLowerCase().includes(s) || log.entity_type?.toLowerCase().includes(s);
                            }
                            return true;
                          })
                          .map((log, idx) => (
                            <tr key={log.id} className="odd:bg-muted/20 even:bg-transparent hover:bg-muted/40 transition-colors">
                              <td className="p-4">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${getActionBadge(log.action)}`}>
                                  {log.action === 'highlight' && <Icon icon="lucide:star" className="w-3 h-3 fill-amber-500" />}
                                  {log.action === 'unhighlight' && <Icon icon="lucide:star" className="w-3 h-3" />}
                                  {log.action === 'create' && <Icon icon="lucide:plus-circle" className="w-3 h-3" />}
                                  {log.action === 'update' && <Icon icon="lucide:pen" className="w-3 h-3" />}
                                  {log.action === 'delete' && <Icon icon="lucide:trash-2" className="w-3 h-3" />}
                                  {log.action === 'password_change' && <Icon icon="lucide:lock" className="w-3 h-3" />}
                                  {log.action === 'login' && <Icon icon="lucide:log-in" className="w-3 h-3" />}
                                  {log.action.replace(/_/g, ' ')}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-col">
                                  <span className="text-foreground font-medium text-sm">{log.entity_title || '-'}</span>
                                  <span className="text-xs text-muted-foreground">{log.entity_type}</span>
                                </div>
                              </td>
                              <td className="p-4 text-xs text-muted-foreground hidden md:table-cell max-w-[200px] truncate">
                                {log.details && log.details !== '{}' ? log.details : '-'}
                              </td>
                              <td className="p-4 text-xs text-muted-foreground hidden md:table-cell whitespace-nowrap">
                                {formatDate(log.created_at)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Page {activityPage} of {totalPages} ({activityTotal} total)
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActivityPage(p => Math.max(1, p - 1))}
                      disabled={activityPage === 1}
                      className="px-3 py-1 rounded-lg border text-xs font-medium text-foreground hover:bg-muted cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setActivityPage(p => Math.min(totalPages, p + 1))}
                      disabled={activityPage === totalPages}
                      className="px-3 py-1 rounded-lg border text-xs font-medium text-foreground hover:bg-muted cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-foreground text-background shadow-lg text-sm font-semibold animate-in fade-in slide-in-from-bottom-5 duration-300">
          <Icon icon="lucide:check-circle" className="w-4 h-4 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}
    </AdminLayout>
  );
}