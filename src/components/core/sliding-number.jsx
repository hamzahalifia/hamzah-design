import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function SlidingNumber({ value, padStart = false }) {
  const str = padStart ? String(value).padStart(2, '0') : String(value);
  const digits = str.split('');

  return (
    <span className="inline-flex items-center">
      {digits.map((digit, index) => (
        <span
          key={index}
          className="relative inline-block overflow-hidden"
          style={{
            width: digit.match(/[0-9]/) ? '0.6em' : 'auto',
            height: digit.match(/[0-9]/) ? '1.2em' : 'auto',
          }}
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={`${index}-${digit}`}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
                mass: 0.8,
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}

export default SlidingNumber;