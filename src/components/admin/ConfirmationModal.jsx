import React, { useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'info'
  loading = false,
  children
}) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !loading) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, loading]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: 'solar:danger-triangle-bold',
      iconBg: 'bg-red-100 dark:bg-red-950/30',
      iconColor: 'text-red-600 dark:text-red-400',
      confirmBg: 'bg-red-600 hover:bg-red-700 text-white',
    },
    warning: {
      icon: 'solar:bell-bing-bold',
      iconBg: 'bg-amber-100 dark:bg-amber-950/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      confirmBg: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    info: {
      icon: 'solar:info-circle-bold',
      iconBg: 'bg-blue-100 dark:bg-blue-950/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      confirmBg: 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100',
    },
  };

  const style = variantStyles[variant] || variantStyles.info;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => !loading && onClose()}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        <div className="p-6 space-y-5">
          {/* Icon + Title */}
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
              <Icon icon={style.icon} className={`w-5 h-5 ${style.iconColor}`} />
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-zinc-100">
                {title}
              </h3>
              {children ? (
                <div className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed">
                  {children}
                </div>
              ) : (
                <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed">
                  {message}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-neutral-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-60 shadow-sm ${style.confirmBg}`}
            >
              {loading && <Icon icon="svg-spinners:180-ring" className="w-3.5 h-3.5" />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}