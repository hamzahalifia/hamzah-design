import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import ProfileSidebar from './components/ProfileSidebar';
import WorkShowcase from './components/WorkShowcase';
import FooterReveal from './components/FooterReveal';
import WorkDetail from './components/WorkDetail';
import About from './components/About';
import WorkPage from './components/WorkPage';
import ExplorationPage from './components/ExplorationPage';
import NotFound from './components/NotFound';
import ServerError from './components/ServerError';
import ErrorBoundary from './components/ErrorBoundary';

import LoginPage from './components/admin/LoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import WorkEditor from './components/admin/WorkEditor';
import ExplorationEditor from './components/admin/ExplorationEditor';

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
            <div className="flex-1">

              <WorkShowcase />
            </div>
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
        <ErrorBoundary>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/work/:workId" element={<WorkDetail />} />
            <Route path="/exploration" element={<ExplorationPage />} />
            
            {/* Admin & CMS Routes — only mounted in dev */}
            <Route path="/login" element={<LoginPage />} />
            {import.meta.env.DEV && (
              <>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/work/new" element={<WorkEditor />} />
                <Route path="/admin/work/edit/:id" element={<WorkEditor />} />
                <Route path="/admin/exploration/new" element={<ExplorationEditor />} />
                <Route path="/admin/exploration/edit/:id" element={<ExplorationEditor />} />
              </>
            )}

            {/* Error state pages */}
            <Route path="/500" element={<ServerError />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
}