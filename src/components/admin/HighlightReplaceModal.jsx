import React from 'react';
import { Icon } from '@iconify/react';

export default function HighlightReplaceModal({
  isOpen,
  onClose,
  onSelect,
  currentHighlighted,
  type = 'work', // 'work' | 'exploration'
  title = 'Select Item to Replace',
  loading = false,
}) {
  if (!isOpen) return null;

  const maxItems = type === 'work' ? 3 : 4;
  const itemLabel = type === 'work' ? 'case studies' : 'explorations';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => !loading && onClose()}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center flex-shrink-0">
              <Icon icon="solar:star-bold" className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-zinc-100">
                {title}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed">
                Maximum {maxItems} highlighted {itemLabel} reached. Select one of the currently highlighted {itemLabel} below to replace with this item. The selected item will have its highlight removed.
              </p>
            </div>
          </div>

          {/* Currently Highlighted List */}
          {currentHighlighted.length === 0 ? (
            <div className="text-center py-4 text-xs text-neutral-400 dark:text-zinc-500">
              No highlighted items found.
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {currentHighlighted.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelect(item)}
                  disabled={loading}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer disabled:opacity-50 text-left group"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-10 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-neutral-900 dark:text-zinc-200 block truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </span>
                    {item.company && (
                      <span className="text-[10px] text-neutral-500 dark:text-zinc-400 block truncate">
                        {item.company}
                      </span>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full border border-zinc-200 dark:border-zinc-600 flex items-center justify-center group-hover:border-amber-400 dark:group-hover:border-amber-500 transition-colors">
                      <Icon icon="solar:alt-arrow-right-linear" className="w-3.5 h-3.5 text-neutral-400 dark:text-zinc-500 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Cancel */}
          <div className="flex justify-end pt-1">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-neutral-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}