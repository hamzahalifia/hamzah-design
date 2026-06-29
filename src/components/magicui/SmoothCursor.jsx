import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export const SmoothCursor = () => {
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useSpring(-100, { damping: 25, stiffness: 300 });
  const cursorY = useSpring(-100, { damping: 25, stiffness: 300 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-5 h-5 rounded-full border-2 border-neutral-900 dark:border-neutral-100 bg-neutral-900/20 dark:bg-white/20 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 hidden lg:block backdrop-blur-[1px]"
      style={{
        x: cursorX,
        y: cursorY,
      }}
    />
  );
};
