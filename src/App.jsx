import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import ProfileSidebar from './components/ProfileSidebar';
import WorkShowcase from './components/WorkShowcase';
import FooterReveal from './components/FooterReveal';
import UnderConstruction from './components/UnderConstruction';
import WorkDetail from './components/WorkDetail';

function HomePage() {
  const { theme } = useTheme();

  return (
    <motion.div 
      animate={{ 
        backgroundColor: theme === 'dark' ? '#080809' : '#FAFAF9',
        color: theme === 'dark' ? '#F4F4F5' : '#111827'
      }}
      transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
      className="min-h-screen theme-transition selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black"
    >
      {/* Solid Sticky Navbar */}
      <Navbar />

      {/* Main Content Area — Outer canvas background #FAFAF9 (light) / #080809 (dark) */}
      <main className="relative z-10 bg-[#FAFAF9] dark:bg-[#080809] border-b border-attio-border-light dark:border-attio-border-dark transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-0 lg:px-6">
          <div className="flex flex-col lg:flex-row gap-0 border-l-0 border-r-0 lg:border-l lg:border-r border-attio-border-light dark:border-attio-border-dark bg-white dark:bg-[#0A0A0B]">
            {/* Left Sticky Profile Column */}
            <ProfileSidebar />

            {/* Right Scrollable Work Showcase Column */}
            <WorkShowcase />
          </div>
        </div>
      </main>

      {/* Unveiling Sticky Footer */}
      <FooterReveal />
    </motion.div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<UnderConstruction pageTitle="About" />} />
          <Route path="/work" element={<UnderConstruction pageTitle="Work" />} />
          <Route path="/work/:workId" element={<WorkDetail />} />
          <Route path="/exploration" element={<UnderConstruction pageTitle="Exploration" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
