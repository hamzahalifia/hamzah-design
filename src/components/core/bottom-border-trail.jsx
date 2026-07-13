import React from 'react';
import { motion } from 'framer-motion';

const rainbowGradient =
  'linear-gradient(90deg, hsl(0, 100%, 63%), hsl(270, 100%, 63%), hsl(210, 100%, 63%), hsl(195, 100%, 63%), hsl(90, 100%, 63%), hsl(195, 100%, 63%), hsl(210, 100%, 63%), hsl(270, 100%, 63%), hsl(0, 100%, 63%))';

export function BottomBorderTrail({ duration = 5, className }) {
  return (
    <motion.div
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2.5,
        borderRadius: 'inherit',
        pointerEvents: 'none',
        zIndex: 1,
        background: rainbowGradient,
        backgroundSize: '200% 100%',
      }}
      animate={{
        backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

export default BottomBorderTrail;
