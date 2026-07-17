import React from 'react';

const ToggleList = ({ title, content, renderChildren, parentKey }) => {
  return (
    <details
      className="not-prose my-5 overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
    >
      <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-900">
        <div className="flex items-center justify-between gap-4">
          <span>{title}</span>
          <span className="text-neutral-400">+</span>
        </div>
      </summary>
      <div className="border-t border-neutral-200 px-5 py-4 text-sm text-neutral-700 dark:border-neutral-800 dark:text-neutral-300">
        {content && renderChildren(content, `${parentKey}-toggle`)}
      </div>
    </details>
  );
};

export default ToggleList;
