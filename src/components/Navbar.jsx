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
  {
    name: "Web Templates",
    slug: "web-template",
    icon: "solar:window-frame-linear",
  },
  {
    name: "Coded Templates",
    slug: "coded-templates",
    icon: "solar:code-square-linear",
  },
  {
    name: "React Components",
    slug: "react-component",
    icon: "solar:atom-linear",
  },
  {
    name: "Framer Templates",
    slug: "framer-template",
    icon: "solar:figma-linear",
  },
  { name: "No-code", slug: "no-code", icon: "solar:magic-stick-linear" },
  {
    name: "Mockups",
    slug: "mockups",
    icon: "solar:laptop-minimalistic-linear",
  },
  {
    name: "3D Assets",
    slug: "3d-assets",
    icon: "solar:box-minimalistic-linear",
  },
  { name: "Themes", slug: "themes", icon: "solar:palette-linear" },
  {
    name: "Presentation",
    slug: "presentation",
    icon: "solar:videocamera-record-linear",
  },
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

  const displayCategories = (
    cmsCategories.length > 0 ? cmsCategories : fallbackCategories
  ).slice(0, 6);

  const toggleSound = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    setSoundEnabled(newState);
  };

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const renderCategoryIcon = (cat, iconClass = "w-5 h-5") => {
    if (cat.icon) {
      if (
        typeof cat.icon === "string" &&
        (cat.icon.startsWith("http") || cat.icon.startsWith("/"))
      ) {
        return (
          <img
            src={cat.icon}
            alt={cat.name}
            className={`${iconClass} object-contain`}
          />
        );
      }
      return <Icon icon={cat.icon} className={iconClass} />;
    }

    const fallbackIconMap = {
      "ui-kit": "solar:widget-5-linear",
      "web-template": "solar:window-frame-linear",
      "coded-templates": "solar:code-square-linear",
      "react-component": "solar:atom-linear",
      "framer-template": "solar:figma-linear",
      "framer-component": "solar:figma-linear",
      "no-code": "solar:magic-stick-linear",
      mockups: "solar:laptop-minimalistic-linear",
      "3d-assets": "solar:box-minimalistic-linear",
      themes: "solar:palette-linear",
      presentation: "solar:videocamera-record-linear",
    };

    return (
      <Icon
        icon={fallbackIconMap[cat.slug] || "solar:folder-with-files-linear"}
        className={iconClass}
      />
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF8F5]/95 dark:bg-[#0A0A0B]/95 backdrop-blur-md border-b border-attio-border-light dark:border-attio-border-dark transition-colors duration-300">
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
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 mr-2 relative">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `text-sm py-1 font-normal whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-black dark:text-white font-medium"
                      : "text-attio-text-primary-light dark:text-attio-text-primary-dark hover:text-black dark:hover:text-white"
                  }`
                }
              >
                <RollingText className="whitespace-nowrap">About</RollingText>
              </NavLink>
              <NavLink
                to="/work"
                className={({ isActive }) =>
                  `text-sm py-1 font-normal whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-black dark:text-white font-medium"
                      : "text-attio-text-primary-light dark:text-attio-text-primary-dark hover:text-black dark:hover:text-white"
                  }`
                }
              >
                <RollingText className="whitespace-nowrap">Work</RollingText>
              </NavLink>
              <NavLink
                to="/exploration"
                className={({ isActive }) =>
                  `text-sm py-1 font-normal whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-black dark:text-white font-medium"
                      : "text-attio-text-primary-light dark:text-attio-text-primary-dark hover:text-black dark:hover:text-white"
                  }`
                }
              >
                <RollingText className="whitespace-nowrap">Exploration</RollingText>
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
                    `text-sm py-1 flex items-center gap-1 font-normal whitespace-nowrap transition-colors ${
                      isActive
                        ? "text-black dark:text-white font-medium"
                        : "text-attio-text-primary-light dark:text-attio-text-primary-dark hover:text-black dark:hover:text-white"
                    }`
                  }
                >
                  <RollingText className="whitespace-nowrap">Resources</RollingText>
                  <Icon
                    icon="solar:alt-arrow-down-linear"
                    className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
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
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className={`fixed left-0 right-0 top-[60px] w-full z-50 border-b border-attio-border-light dark:border-attio-border-dark shadow-2xl pointer-events-auto transition-colors duration-300 py-6 sm:py-7 flex items-center justify-center ${
                        theme === "dark"
                          ? "bg-[#0A0A0B] text-white"
                          : "bg-[#FAF8F5] text-neutral-900"
                      }`}
                    >
                      <div className="w-full max-w-[1440px] px-4 sm:px-8 flex items-center justify-center">
                        <div className="flex items-center justify-center gap-3.5 sm:gap-4 max-w-full">
                          
                          {/* Categories: 3 Columns x 2 Rows Grid */}
                          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                            {displayCategories.map((cat) => (
                              <Link
                                key={cat.slug || cat.id}
                                to={`/resources?type=${cat.slug}`}
                                onClick={() => setMegaMenuOpen(false)}
                                className={`group relative flex flex-col items-center justify-center w-[135px] sm:w-[155px] md:w-[165px] h-[92px] sm:h-[100px] rounded-xl border transition-all duration-200 text-center cursor-pointer ${
                                  theme === "dark"
                                    ? "bg-[#141416] hover:bg-[#1A1A1D] border-neutral-800/90 hover:border-neutral-700 text-neutral-200 hover:text-white hover:shadow-lg hover:shadow-black/20"
                                    : "bg-white hover:bg-neutral-50/80 border-neutral-200/80 hover:border-neutral-300 hover:shadow-sm text-neutral-800 hover:text-black"
                                }`}
                              >
                                <div
                                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200 shadow-xs ${
                                    theme === "dark"
                                      ? "bg-[#202024] border-neutral-700/60 text-neutral-200 group-hover:text-white"
                                      : "bg-neutral-100/80 border-neutral-200/70 text-neutral-700 group-hover:text-black"
                                  }`}
                                >
                                  {renderCategoryIcon(cat, "w-4.5 h-4.5 sm:w-5 sm:h-5")}
                                </div>
                                <span className="text-xs sm:text-[13px] font-medium transition-colors leading-tight line-clamp-1 px-2">
                                  {cat.name}
                                </span>
                              </Link>
                            ))}
                          </div>

                          {/* Right Column: Matched Height Promo Card (Opens UI8 Team Link) */}
                          <div className="h-[194px] sm:h-[212px] aspect-square flex-shrink-0">
                            <a
                              href="https://ui8.net/users/onfire-studio"
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setMegaMenuOpen(false)}
                              className={`relative h-full w-full rounded-xl overflow-hidden border transition-all duration-300 group cursor-pointer block ${
                                theme === "dark"
                                  ? "border-neutral-800 bg-[#141416] hover:border-neutral-700"
                                  : "border-neutral-200/80 bg-white hover:border-neutral-300"
                              }`}
                            >
                              <img
                                src="/images/general/mega_menu_promo.webp"
                                alt="Team Promo"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-auto select-none"
                              />
                            </a>
                          </div>

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
            className="w-10 h-10 flex items-center justify-center rounded-full text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 cursor-pointer touch-manipulation"
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
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-md text-attio-text-primary-light dark:text-attio-text-primary-dark hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors duration-200 cursor-pointer touch-manipulation"
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
