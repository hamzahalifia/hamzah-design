import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { isSoundEnabled, setSoundEnabled } from "../lib/sound";
import { fetchResourceTypes } from "../lib/cmsendpoint";

import { RollingText } from "./magicui/RollingText";
import AnimatedThemeToggler from "./magicui/AnimatedThemeToggler";

const fallbackCategories = [
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

export default function Navbar({ hideNavLinks = false }) {
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [cmsCategories, setCmsCategories] = useState([]);

  useEffect(() => {
    async function loadCmsCategories() {
      try {
        const types = await fetchResourceTypes();
        if (types && types.length > 0) {
          setCmsCategories(types);
        }
      } catch (err) {
        console.error("Failed to load resource types for mega menu:", err);
      }
    }
    loadCmsCategories();
  }, []);

  const displayCategories = cmsCategories.length > 0 ? cmsCategories : fallbackCategories;

  const toggleSound = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    setSoundEnabled(newState);
  };

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const renderCategoryIcon = (cat) => {
    if (cat.icon) {
      if (typeof cat.icon === "string" && (cat.icon.startsWith("http") || cat.icon.startsWith("/"))) {
        return <img src={cat.icon} alt={cat.name} className="w-6 h-6 object-contain" />;
      }
      return <Icon icon={cat.icon} className="w-6 h-6" />;
    }

    const fallbackIconMap = {
      "ui-kit": "solar:widget-5-linear",
      "web-template": "solar:window-frame-linear",
      "coded-templates": "solar:code-square-linear",
      "react-component": "solar:atom-linear",
      "framer-template": "solar:figma-linear",
      "framer-component": "solar:figma-linear",
      "no-code": "solar:magic-stick-linear",
      "mockups": "solar:laptop-minimalistic-linear",
      "3d-assets": "solar:box-minimalistic-linear",
      "themes": "solar:palette-linear",
      "presentation": "solar:videocamera-record-linear",
    };

    return <Icon icon={fallbackIconMap[cat.slug] || "solar:folder-with-files-linear"} className="w-6 h-6" />;
  };

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
                  `text-sm py-1 font-normal transition-colors ${
                    isActive
                      ? "text-black dark:text-white font-medium"
                      : "text-attio-text-primary-light dark:text-attio-text-primary-dark hover:text-black dark:hover:text-white"
                  }`
                }
              >
                <RollingText>About</RollingText>
              </NavLink>
              <NavLink
                to="/work"
                className={({ isActive }) =>
                  `text-sm py-1 font-normal transition-colors ${
                    isActive
                      ? "text-black dark:text-white font-medium"
                      : "text-attio-text-primary-light dark:text-attio-text-primary-dark hover:text-black dark:hover:text-white"
                  }`
                }
              >
                <RollingText>Work</RollingText>
              </NavLink>
              <NavLink
                to="/exploration"
                className={({ isActive }) =>
                  `text-sm py-1 font-normal transition-colors ${
                    isActive
                      ? "text-black dark:text-white font-medium"
                      : "text-attio-text-primary-light dark:text-attio-text-primary-dark hover:text-black dark:hover:text-white"
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
                    `text-sm py-1 flex items-center gap-1 font-normal transition-colors ${
                      isActive
                        ? "text-black dark:text-white font-medium"
                        : "text-attio-text-primary-light dark:text-attio-text-primary-dark hover:text-black dark:hover:text-white"
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

                {/* Full-Width Mega Menu Dropdown */}
                <AnimatePresence>
                  {megaMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`fixed left-0 right-0 top-[60px] w-full z-50 border-b border-attio-border-light dark:border-attio-border-dark shadow-2xl pointer-events-auto transition-colors duration-300 ${
                        theme === "dark"
                          ? "bg-[#0A0A0B] text-white"
                          : "bg-white text-neutral-900"
                      }`}
                    >
                      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6">
                        <div
                          className={`flex items-center justify-between pb-4 mb-6 border-b ${
                            theme === "dark" ? "border-neutral-800/80" : "border-neutral-200"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                              Browse Categories
                            </span>
                            <span
                              className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-semibold ${
                                theme === "dark"
                                  ? "bg-neutral-800 text-neutral-300 border border-neutral-700"
                                  : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                              }`}
                            >
                              {displayCategories.length}
                            </span>
                          </div>
                          <Link
                            to="/resources"
                            onClick={() => setMegaMenuOpen(false)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all no-underline shadow-xs cursor-pointer ${
                              theme === "dark"
                                ? "bg-white text-black hover:bg-neutral-200 border border-neutral-200"
                                : "bg-neutral-900 text-white hover:bg-neutral-800 border border-neutral-800"
                            }`}
                          >
                            <span>View All</span>
                            <Icon icon="solar:arrow-right-linear" className="w-3.5 h-3.5" />
                          </Link>
                        </div>

                        {/* UI8-Style Category Cards (Larger cards with crisp dark/light styling) */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
                          {displayCategories.map((cat) => (
                            <Link
                              key={cat.slug || cat.id}
                              to={`/resources?type=${cat.slug}`}
                              onClick={() => setMegaMenuOpen(false)}
                              className={`group relative flex flex-col items-center justify-center p-5 rounded-2xl border transition-all duration-200 text-center cursor-pointer min-h-[120px] ${
                                theme === "dark"
                                  ? "bg-[#141416]/80 hover:bg-[#1C1C1F] border-neutral-800 hover:border-neutral-700 text-neutral-200 hover:text-white"
                                  : "bg-neutral-50/80 hover:bg-white border-neutral-200/80 hover:border-neutral-300 hover:shadow-md text-neutral-800 hover:text-black"
                              }`}
                            >
                              <div
                                className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-3 group-hover:scale-110 transition-all shadow-xs ${
                                  theme === "dark"
                                    ? "bg-neutral-800/90 border-neutral-700/70 text-neutral-200 group-hover:text-white"
                                    : "bg-white border-neutral-200/80 text-neutral-800 group-hover:text-black"
                                }`}
                              >
                                {renderCategoryIcon(cat)}
                              </div>
                              <span className="text-xs sm:text-sm font-semibold transition-colors leading-tight line-clamp-1">
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
