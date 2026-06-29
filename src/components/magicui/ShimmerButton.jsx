import React from "react";
import { cn } from "../../lib/utils";

export const ShimmerButton = React.forwardRef(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "9999px",
      background = "rgba(26, 26, 26, 1)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={{
          "--shimmer-color": shimmerColor,
          "--radius": borderRadius,
          "--speed": shimmerDuration,
          "--cut": shimmerSize,
          "--bg": background,
        }}
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-5 py-2.5 text-white transform-gpu transition-all duration-300 active:scale-95 shadow-attio-sm rounded-full",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "absolute inset-0 overflow-visible [container-type:size]"
          )}
        >
          {/* spark */}
          <div className="absolute inset-0 h-[100cqh] animate-shimmer-spin [aspect-ratio:1] [inset:0_auto_0_0] [mask:none]">
            {/* spark before */}
            <div className="animate-shimmer-slide absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_0deg_at_50%_50%,transparent_0%,var(--shimmer-color)_20%,transparent_100%)]" />
          </div>
        </div>

        {/* backdrop */}
        <div className="absolute inset-[1px] -z-20 rounded-full bg-[#1A1A1A] dark:bg-white transition-colors group-hover:opacity-90" />

        {/* content */}
        <div className="relative z-10 flex items-center justify-center text-sm font-semibold text-[#F0F5F2] dark:text-black">
          {children}
        </div>
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
