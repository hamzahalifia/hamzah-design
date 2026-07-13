import React, { useState, useId } from "react";
import { cn } from "../../lib/utils";

export function InteractiveGridPattern({
  width = 32,
  height = 32,
  squares = [16, 16],
  className,
  squaresClassName,
  ...props
}) {
  const id = useId();
  const [horizontal, vertical] = squares;
  const [hoveredSquare, setHoveredSquare] = useState(null);

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full stroke-attio-border-light/60 dark:stroke-white/10",
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
          x={-1}
          y={-1}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray="0"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={-1} y={-1} className="overflow-visible">
        {Array.from({ length: horizontal * vertical }).map((_, index) => {
          const x = (index % horizontal) * width;
          const y = Math.floor(index / horizontal) * height;
          return (
            <rect
              key={index}
              x={x + 1}
              y={y + 1}
              width={width - 1}
              height={height - 1}
              className={cn(
                "pointer-events-auto fill-transparent transition-all duration-500 hover:fill-neutral-900/10 dark:hover:fill-white/10 hover:duration-0",
                hoveredSquare === index && "fill-neutral-900/10 dark:fill-white/10",
                squaresClassName
              )}
              onMouseEnter={() => setHoveredSquare(index)}
              onMouseLeave={() => setHoveredSquare(null)}
            />
          );
        })}
      </svg>
    </svg>
  );
}

export default InteractiveGridPattern;
