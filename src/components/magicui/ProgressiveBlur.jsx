import React from "react";
import { cn } from "../../lib/utils";

/**
 * ProgressiveBlur - applies a gradient blur overlay at the edges of a container.
 * Useful for indicating scrollable content continues beyond the visible area.
 */
export function ProgressiveBlur({
  direction = "bottom",
  blurIntensity = 8,
  className,
  ...props
}) {
  const isVertical = direction === "top" || direction === "bottom";

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-10 from-transparent to-white dark:to-[#0A0A0B]",
        {
          "bg-gradient-to-t": direction === "top",
          "bg-gradient-to-b": direction === "bottom",
          "bg-gradient-to-l": direction === "left",
          "bg-gradient-to-r": direction === "right",
        },
        isVertical ? "left-0 right-0 h-24" : "top-0 bottom-0 w-24",
        {
          "top-0": direction === "top",
          "bottom-0": direction === "bottom",
          "left-0": direction === "left",
          "right-0": direction === "right",
        },
        className
      )}
      {...props}
    />
  );
}

export default ProgressiveBlur;