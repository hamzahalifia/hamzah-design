import React, { useEffect } from 'react';
import { motion, useMotionValue, useMotionTemplate, animate } from 'framer-motion';

export function BorderTrail({
  size = 60, // size of the trail in degrees
  trailSize = 2, // border width
  duration = 3, // cycle duration in seconds
  style,
  className,
}) {
  const angle = useMotionValue(0);

  useEffect(() => {
    const controls = animate(angle, 360, {
      ease: 'linear',
      duration,
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [angle, duration]);

  // Use motion template to construct a vibrant rainbow gradient trail
  const background = useMotionTemplate`conic-gradient(from ${angle}deg, transparent 0deg, #ff3b30 ${size * 0.2}deg, #ffcc00 ${size * 0.4}deg, #4cd964 ${size * 0.6}deg, #5ac8fa ${size * 0.8}deg, #5856d6 ${size}deg, transparent ${size}deg)`;

  const base = {
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    padding: trailSize,
    background,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    pointerEvents: 'none',
    zIndex: 0,
    ...style,
  };

  return (
    <motion.div
      className={className}
      style={base}
    />
  );
}

export default BorderTrail;