import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

import { RollingText } from './magicui/RollingText';
import AnimatedThemeToggler from './magicui/AnimatedThemeToggler';

export default function Navbar({ hideNavLinks = false }) {
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#0A0A0B] border-b border-attio-border-light dark:border-attio-border-dark transition-colors duration-300">

      <div className="max-w-[1440px] h-[60px] mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Clickable SVG Logomark */}
        <Link to="/" onClick={closeMobileMenu} className="flex items-center group py-1" aria-label="Home">
          <img 
            src={theme === 'dark' ? '/images/general/logo-white.svg' : '/images/general/logo-dark.svg'} 
            alt="Alifia Hamzah Logo" 
            className="h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
          />
        </Link>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Navigation Items */}
          {!hideNavLinks && (
            <nav className="hidden md:flex items-center gap-8 mr-2">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `text-sm py-1 ${
                    isActive
                      ? 'text-black dark:text-white underline underline-offset-4 font-semibold'
                      : 'text-attio-text-primary-light dark:text-attio-text-primary-dark hover:text-neutral-500 dark:hover:text-neutral-400'
                  }`
                }
              >
                <RollingText>About</RollingText>
              </NavLink>
              <NavLink
                to="/work"
                className={({ isActive }) =>
                  `text-sm py-1 ${
                    isActive
                      ? 'text-black dark:text-white underline underline-offset-4 font-semibold'
                      : 'text-attio-text-primary-light dark:text-attio-text-primary-dark hover:text-neutral-500 dark:hover:text-neutral-400'
                  }`
                }
              >
                <RollingText>Work</RollingText>
              </NavLink>
              <NavLink
                to="/exploration"
                className={({ isActive }) =>
                  `text-sm py-1 ${
                    isActive
                      ? 'text-black dark:text-white underline underline-offset-4 font-semibold'
                      : 'text-attio-text-primary-light dark:text-attio-text-primary-dark hover:text-neutral-500 dark:hover:text-neutral-400'
                  }`
                }
              >
                <RollingText>Exploration</RollingText>
              </NavLink>
            </nav>
          )}

          {/* Animated Theme Toggle Button */}
          <AnimatedThemeToggler />

          {/* Mobile Hamburger Menu Button */}
          {!hideNavLinks && (
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle Navigation Menu"
              className="md:hidden p-1.5 rounded-md text-attio-text-primary-light dark:text-attio-text-primary-dark hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors duration-200 cursor-pointer"
            >
              <Icon
                icon={mobileMenuOpen ? 'solar:close-square-linear' : 'solar:hamburger-menu-linear'}
                className="w-6 h-6"
              />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t border-attio-border-light dark:border-attio-border-dark bg-white/95 dark:bg-[#0A0A0B]/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col space-y-3">
              <NavLink
                to="/about"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `text-base font-medium py-2 px-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-semibold'
                      : 'text-attio-text-primary-light dark:text-attio-text-primary-dark hover:bg-neutral-50 dark:hover:bg-neutral-900'
                  }`
                }
              >
                <RollingText>About</RollingText>
              </NavLink>
              <NavLink
                to="/work"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `text-base font-medium py-2 px-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-semibold'
                      : 'text-attio-text-primary-light dark:text-attio-text-primary-dark hover:bg-neutral-50 dark:hover:bg-neutral-900'
                  }`
                }
              >
                <RollingText>Work</RollingText>
              </NavLink>
              <NavLink
                to="/exploration"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `text-base font-medium py-2 px-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-semibold'
                      : 'text-attio-text-primary-light dark:text-attio-text-primary-dark hover:bg-neutral-50 dark:hover:bg-neutral-900'
                  }`
                }
              >
                <RollingText>Exploration</RollingText>
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}