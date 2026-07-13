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

  const handleToggle = (e) => {
    playToggleSound();

    // Perform circular expand view transition if supported by browser
    if (!document.startViewTransition) {
      toggleTheme();
      return;
    }

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      toggleTheme();
    });

    transition.ready.then(() => {
      // Fade out the old view so the expanding circle is clearly visible
      document.documentElement.animate(
        { opacity: [1, 0] },
        {
          duration: 350,
          easing: 'ease-in',
          pseudoElement: '::view-transition-old(root)',
        }
      );

      // Always expand the circle outward from the button — works for both directions
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 450,
          easing: 'ease-in-out',
          // Always animate the incoming view (the new theme)
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  return (
    <button
      onClick={handleToggle}
      aria-label="Toggle Theme"
      className={`p-2 rounded-full text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 cursor-pointer relative overflow-hidden focus:outline-none ${className}`}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
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
