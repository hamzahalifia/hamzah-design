import React from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { playThemeToggleSound } from '../../lib/sound';

export function AnimatedThemeToggler({ className = '', ...props }) {
  const { theme, toggleTheme } = useTheme();

  const playToggleSound = () => {
    // if theme is 'light', we are toggling to dark (toDark = true)
    playThemeToggleSound(theme === 'light');
  };

  const handleToggle = () => {
    playToggleSound();
    toggleTheme();
  };

  return (
    <button
      onClick={handleToggle}
      aria-label="Toggle Theme"
      className={`w-10 h-10 flex items-center justify-center rounded-full text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 cursor-pointer relative overflow-hidden focus:outline-none touch-manipulation ${className}`}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          <Icon
            icon={theme === 'dark' ? 'pixel:sun-solid' : 'pixel:moon-solid'}
            className="w-5 h-5 text-neutral-700 dark:text-neutral-200"
          />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}

export default AnimatedThemeToggler;
