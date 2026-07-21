import React from "react";
import { Icon } from "@iconify/react";
import { cn } from "../lib/utils";

function TocLink({ item, depth = 0, activeId, onTocClick }) {
  const isActive = activeId === item.id;

  return (
    <li>
      <a
        href={`#${item.id}`}
        onClick={(e) => onTocClick(e, item.id)}
        className={cn(
          "group block rounded-md py-0.5 pr-2 text-sm leading-5 transition-colors duration-200",
          depth === 0 ? "font-medium" : "font-normal",
          isActive
            ? "text-neutral-900 dark:text-neutral-100 font-semibold"
            : "text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
        )}
        aria-current={isActive ? "location" : undefined}
      >
        <span className={cn("block", depth > 0 && "pl-3")}>{item.title}</span>
      </a>
      {item.children?.length > 0 && (
        <ul className="mt-2 space-y-1">
          {item.children.map((child) => (
            <TocLink
              key={child.id}
              item={child}
              depth={depth + 1}
              activeId={activeId}
              onTocClick={onTocClick}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function TableOfContents({ items, onTocClick, activeId }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="text-sm">
      <div className="mb-4 flex items-center gap-2">
        <Icon
          icon="solar:list-bold"
          className="h-5 w-5 text-neutral-900 dark:text-neutral-100"
        />
        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
          On this page
        </h4>
      </div>
      <div className="border-l border-neutral-200 dark:border-neutral-800 pl-4 pr-2 overflow-auto max-h-[calc(100vh-8rem)]">
        <ul className="space-y-0.5">
          {items.map((section) => (
            <TocLink
              key={section.id}
              item={section}
              activeId={activeId}
              onTocClick={onTocClick}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
