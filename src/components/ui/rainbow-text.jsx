import React from "react";
import { cn } from "@/lib/utils";

export const RainbowText = React.forwardRef(
  (
    {
      children,
      className,
      animated = true,
      speed = "4s",
      baseColor,
      as: Component = "span",
      style,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "inline-block bg-clip-text text-transparent selection:bg-neutral-800 selection:text-white",
          "[--rainbow-base:#18181b] dark:[--rainbow-base:#ffffff]",
          animated ? "animate-rainbow-sweep" : "",
          className
        )}
        style={{
          backgroundImage: `linear-gradient(90deg, var(--rainbow-base, #ffffff) 0px, var(--rainbow-base, #ffffff) 33.33%, rgb(130, 188, 255) 40%, rgb(36, 131, 255) 45%, rgb(255, 102, 244) 50%, rgb(255, 48, 41) 55%, rgb(254, 123, 2) 60%, var(--rainbow-base, #ffffff) 66.67%, var(--rainbow-base, #ffffff) 100%)`,
          backgroundSize: "300% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          ...(animated ? { "--speed": speed } : {}),
          ...(baseColor ? { "--rainbow-base": baseColor } : {}),
          ...style,
        }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

RainbowText.displayName = "RainbowText";

export { RainbowText as RainbowHighlight };
export default RainbowText;
