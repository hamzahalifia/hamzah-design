import React from "react";

export function GlowCard({
  children,
  glowColor = "var(--glow-color, rgba(255, 255, 255, 0.65))", // Default color from CSS vars
  glowSize = 320,
  className = "",
  innerClassName = "",
  onClick,
  ...props
}) {
  return (
    <div
      data-glow-card
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden bg-neutral-200/10 dark:bg-neutral-800/20 transition-all duration-300 ${className}`}
      style={{
        padding: "var(--glow-border-width, 1.5px)",
        backgroundImage: `radial-gradient(
          ${glowSize}px circle at var(--mouse-x, -999px) var(--mouse-y, -999px),
          ${glowColor},
          transparent 80%
        )`,
      }}
      {...props}
    >
      <div
        className={`rounded-[10.5px] overflow-hidden bg-[#FAF8F5] dark:bg-[#0A0A0B] h-full w-full relative z-10 ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}

export default GlowCard;
