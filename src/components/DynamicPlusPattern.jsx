import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function DynamicPlusPattern({ rows = 18, cols = 12 }) {
  const items = useMemo(() => {
    const count = rows * cols;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      // Random target opacities and timing for dynamic flicker effect
      duration: 3 + Math.random() * 5,
      delay: Math.random() * 4,
      opacities: [
        0.05 + Math.random() * 0.1,
        0.3 + Math.random() * 0.4,
        0.08 + Math.random() * 0.15,
      ],
    }));
  }, [rows, cols]);

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none grid gap-4 p-4 z-0 opacity-40 dark:opacity-20"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="flex items-center justify-center text-xs font-light text-neutral-900 dark:text-neutral-100 select-none"
          initial={{ opacity: item.opacities[0] }}
          animate={{ opacity: item.opacities }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: item.delay,
            ease: 'easeInOut',
          }}
        >
          +
        </motion.div>
      ))}
    </div>
  );
}
