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
  const gradientDirection = {
    top: "to top",
    bottom: "to bottom",
    left: "to left",
    right: "to right",
  }[direction];

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-10 from-transparent to-white dark:to-[#0A0A0B]",
        isVertical ? "left-0 right-0 h-24" : "top-0 bottom-0 w-24",
        {
          "top-0": direction === "top",
          "bottom-0": direction === "bottom",
          "left-0": direction === "left",
          "right-0": direction === "right",
        },
        className
      )}
      style={{
        background: `linear-gradient(${gradientDirection}, transparent 0%, var(--tw-gradient-to) 100%)`,
      }}
      {...props}
    />
  );
}

export default ProgressiveBlur;