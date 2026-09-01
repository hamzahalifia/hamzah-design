import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { isSoundEnabled, setSoundEnabled } from "../lib/sound";

import { RollingText } from "./magicui/RollingText";
import AnimatedThemeToggler from "./magicui/AnimatedThemeToggler";

export default function Navbar({ hideNavLinks = false }) {
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const toggleSound = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    setSoundEnabled(newState);
  };

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const megaCategories = [
    { name: "UI Kits", slug: "ui-kit", icon: "solar:widget-5-linear" },
    { name: "Web Templates", slug: "web-template", icon: "solar:window-frame-linear" },
    { name: "Coded Templates", slug: "coded-templates", icon: "solar:code-square-linear" },
    { name: "React Components", slug: "react-component", icon: "solar:atom-linear" },
    { name: "Framer Templates", slug: "framer-template", icon: "solar:figma-linear" },
    { name: "No-code", slug: "no-code", icon: "solar:magic-stick-linear" },
    { name: "Mockups", slug: "mockups", icon: "solar:laptop-minimalistic-linear" },
    { name: "3D Assets", slug: "3d-assets", icon: "solar:box-minimalistic-linear" },
    { name: "Themes", slug: "themes", icon: "solar:palette-linear" },
    { name: "Presentation", slug: "presentation", icon: "solar:videocamera-record-linear" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#0A0A0B] border-b border-attio-border-light dark:border-attio-border-dark transition-colors duration-300">
      <div className="max-w-[1440px] h-[60px] mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Clickable SVG Logomark */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center group py-1"
          aria-label="Home"
        >
          <img
            src={
              theme === "dark"
                ? "/images/general/logo-white.svg"
                : "/images/general/logo-dark.svg"
            }
            alt="Alifia Hamzah Logo"
            className="h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
          />
        </Link>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Navigation Items */}
          {!hideNavLinks && (
            <nav className="hidden md:flex items-center gap-8 mr-2 relative">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `text-sm py-1 ${
                    isActive
                      ? "text-black dark:text-white underline underline-offset-4 font-semibold"
                      : "text-attio-text-primary-light dark:text-attio-text-primary-dark hover:text-neutral-500 dark:hover:text-neutral-400"
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
                      ? "text-black dark:text-white underline underline-offset-4 font-semibold"
                      : "text-attio-text-primary-light dark:text-attio-text-primary-dark hover:text-neutral-500 dark:hover:text-neutral-400"
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
                      ? "text-black dark:text-white underline underline-offset-4 font-semibold"
                      : "text-attio-text-primary-light dark:text-attio-text-primary-dark hover:text-neutral-500 dark:hover:text-neutral-400"
                  }`
                }
              >
                <RollingText>Exploration</RollingText>
              </NavLink>

              {/* Resources Mega Menu Trigger */}
              <div
                className="relative py-2"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <NavLink
                  to="/resources"
                  className={({ isActive }) =>
                    `text-sm py-1 flex items-center gap-1 ${
                      isActive
                        ? "text-black dark:text-white underline underline-offset-4 font-semibold"
                        : "text-attio-text-primary-light dark:text-attio-text-primary-dark hover:text-neutral-500 dark:hover:text-neutral-400"
                    }`
                  }
                >
                  <RollingText>Resources</RollingText>
                  <Icon
                    icon="solar:alt-arrow-down-linear"
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      megaMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </NavLink>

                {/* Mega Menu Dropdown */}
                <AnimatePresence>
                  {megaMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 top-full pt-2 z-50 w-[680px] pointer-events-auto"
                    >
                      <div className="bg-[#121215]/95 dark:bg-[#0A0A0C]/95 backdrop-blur-2xl border border-white/10 dark:border-neutral-800 rounded-2xl p-5 shadow-2xl text-white">
                        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                            Browse Categories
                          </span>
                          <Link
                            to="/resources"
                            onClick={() => setMegaMenuOpen(false)}
                            className="text-xs font-semibold text-neutral-300 hover:text-white underline underline-offset-2 flex items-center gap-1"
                          >
                            <span>View All</span>
                            <Icon icon="solar:arrow-right-linear" className="w-3.5 h-3.5" />
                          </Link>
                        </div>

                        <div className="grid grid-cols-5 gap-3">
                          {megaCategories.map((cat) => (
                            <Link
                              key={cat.slug}
                              to={`/resources?type=${cat.slug}`}
                              onClick={() => setMegaMenuOpen(false)}
                              className="group flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-200 text-center cursor-pointer"
                            >
                              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform">
                                <Icon icon={cat.icon} className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-medium text-neutral-200 group-hover:text-white leading-tight">
                                {cat.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          )}

          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound"
            className="p-2 rounded-full text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 cursor-pointer"
          >
            <Icon
              icon={soundOn ? "pixel:sound-on-solid" : "pixel:sound-mute-solid"}
              className="w-5 h-5 text-neutral-700 dark:text-neutral-200"
            />
          </button>

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
                icon={
                  mobileMenuOpen
                    ? "pixelarticons:close"
                    : "pixelarticons:menu-square"
                }
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
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-t border-attio-border-light dark:border-attio-border-dark bg-white/95 dark:bg-[#0A0A0B]/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col space-y-3">
              <NavLink
                to="/about"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `text-base font-medium py-2 px-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-semibold"
                      : "text-attio-text-primary-light dark:text-attio-text-primary-dark hover:bg-neutral-50 dark:hover:bg-neutral-900"
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
                      ? "bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-semibold"
                      : "text-attio-text-primary-light dark:text-attio-text-primary-dark hover:bg-neutral-50 dark:hover:bg-neutral-900"
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
                      ? "bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-semibold"
                      : "text-attio-text-primary-light dark:text-attio-text-primary-dark hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  }`
                }
              >
                <RollingText>Exploration</RollingText>
              </NavLink>
              <NavLink
                to="/resources"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `text-base font-medium py-2 px-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-semibold"
                      : "text-attio-text-primary-light dark:text-attio-text-primary-dark hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  }`
                }
              >
                <RollingText>Resources</RollingText>
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
