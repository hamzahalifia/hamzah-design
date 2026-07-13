import React, { useId } from "react";
import { cn } from "../../lib/utils";

export function GridPattern({
  width = 32,
  height = 32,
  x = -1,
  y = -1,
  squares,
  className,
  ...props
}) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-neutral-400/30 stroke-neutral-400/30 dark:fill-neutral-600/30 dark:stroke-neutral-600/30",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            stroke="inherit"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([sx, sy]) => {
            const key = `${sx}-${sy}`;
            return (
              <rect
                key={key}
                strokeWidth="0"
                width={width - 1}
                height={height - 1}
                x={sx * width + 1}
                y={sy * height + 1}
              />
            );
          })}
        </svg>
      )}
    </svg>
  );
}

export default GridPattern;