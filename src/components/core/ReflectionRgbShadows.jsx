import React from 'react';
import { motion } from 'framer-motion';

const rainbowGradient =
  'linear-gradient(90deg, hsl(0, 100%, 63%), hsl(270, 100%, 63%), hsl(210, 100%, 63%), hsl(195, 100%, 63%), hsl(90, 100%, 63%), hsl(195, 100%, 63%), hsl(210, 100%, 63%), hsl(270, 100%, 63%), hsl(0, 100%, 63%))';

const bgMotion = {
  animate: {
    backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
  },
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

export function ReflectionRgbShadows({ duration = 5 }) {
  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '15%',
        right: '15%',
        bottom: -8,
        height: 12,
        borderRadius: '9999px',
        pointerEvents: 'none',
        zIndex: 0,
        background: rainbowGradient,
        backgroundSize: '200% 100%',
        filter: 'blur(8px)',
        opacity: 0.7,
      }}
      animate={bgMotion.animate}
      transition={{ ...bgMotion.transition, duration }}
    />
  );
}

export default ReflectionRgbShadows;
