import React, { useState, useEffect, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export function Cursor({
  children,
  attachToParent = false,
  variants,
  springConfig = { bounce: 0.001 },
  transition = { ease: 'easeInOut', duration: 0.15 },
  onPositionChange,
  className,
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, {
    stiffness: 500,
    damping: 30,
    mass: 0.5,
    ...springConfig,
  });
  const springY = useSpring(mouseY, {
    stiffness: 500,
    damping: 30,
    mass: 0.5,
    ...springConfig,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (onPositionChange) {
        onPositionChange(e.clientX, e.clientY);
      }
    },
    [mouseX, mouseY, onPositionChange]
  );

  useEffect(() => {
    if (!mounted) return;
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mounted, handleMouseMove]);

  // Hide on touch devices
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch('ontouchstart' in window);
  }, []);

  if (!mounted || isTouch) return null;

  return (
    <>
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-[99999] ${className || ''}`}
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
      >
        {children}
      </motion.div>
      {attachToParent ? null : null}
    </>
  );
}

export default Cursor;