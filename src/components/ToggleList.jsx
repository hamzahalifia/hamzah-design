import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const ToggleList = ({ title, content, renderChildren, parentKey }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details
      className="not-prose my-5 overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
      onToggle={(e) => setIsOpen(e.currentTarget.open)}
    >
      <summary className="group cursor-pointer list-none px-5 py-4 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-900">
        <div className="flex items-center justify-between gap-4">
          <span>{title}</span>
          <Icon
            icon="lucide:chevron-down"
            className={`w-5 h-5 text-neutral-400 transition-all duration-300 group-hover:scale-115 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 ${
              isOpen ? 'rotate-180 scale-115 text-neutral-600 dark:text-neutral-300' : ''
            }`}
          />
        </div>
      </summary>
      <div className="border-t border-neutral-200 px-5 py-4 text-sm text-neutral-700 dark:border-neutral-800 dark:text-neutral-300">
        {content && renderChildren(content, `${parentKey}-toggle`)}
      </div>
    </details>
  );
};

export default ToggleList;
