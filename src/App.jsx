import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Toaster } from './components/ui/sonner';
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
import PageMeta from './components/SEO/PageMeta';

import LoginPage from './components/admin/LoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import WorksManagement from './components/admin/WorksManagement';
import ExplorationsManagement from './components/admin/ExplorationsManagement';
import SettingsPage from './components/admin/SettingsPage';
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
      <PageMeta
        title="Alifia Hamzah — Product Designer | Portfolio"
        description="Product Designer specializing in data-driven enterprise tools. Explore case studies, UI/UX explorations, and design systems crafted with a story-data approach."
        keywords="Alifia Hamzah, Alifia Hamzah Product Designer, Alifia Hamzah UI/UX Designer, Alif Designer, Hamzah Design, Hamzah Designer, Alif Hamzah, Hamzah Alifia, Hamzah Alif, Hamzah Alif Design, Hamzah Alif UI/UX Designer, Hamzah Alif Product Designer, Hamzah Alifia Hamzah, Alifia Hamzah Indonesia, Alifia Hamzah Bandung, Alifia Hamzah BWA, Alifia Hamzah Neuron, Alifia Hamzah Neuronworks, Hamzah Neuronworks, Hamzah Neuronworks Indonesia, Hamzah Catalyst Team, Hamzah The Catalyst Team, Hamzah CTC, Hamzah Upwork, Hamzah Contra, Hamzah Freelancer Upwork"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Alifia Hamzah Design Portfolio",
          "url": "https://hamzah.design",
          "description": "Portfolio of Alifia Hamzah, Product Designer specializing in data-driven enterprise tools.",
          "about": {
            "@type": "Person",
            "name": "Alifia Hamzah",
            "givenName": "Alifia",
            "familyName": "Hamzah",
            "additionalName": "Hamzah",
            "alternateName": [
              "Alifia Hamzah",
              "Alif Designer",
              "Hamzah Design",
              "Hamzah Designer",
              "Alif Hamzah",
              "Hamzah Alifia",
              "Hamzah Alif",
              "Hamzah Alif Design",
              "Hamzah Alifia Hamzah",
              "Hamzah Neuronworks"
            ],
            "jobTitle": "Product Designer",
            "url": "https://hamzah.design",
            "image": "https://hamzah.design/images/general/profilephoto.webp",
            "description": "Product Designer specializing in data-driven enterprise tools.",
            "knowsLanguage": [
              { "@type": "Language", "name": "Indonesian", "alternateName": "id" },
              { "@type": "Language", "name": "Sundanese", "alternateName": "su" },
              { "@type": "Language", "name": "English", "alternateName": "en" },
              { "@type": "Language", "name": "Japanese", "alternateName": "ja" }
            ],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Bandung",
              "addressRegion": "West Java",
              "addressCountry": "ID"
            },
            "sameAs": [
              "https://www.linkedin.com/in/alifiahamzah/",
              "https://www.instagram.com/hamzahalifia",
              "https://github.com/hamzahalifia",
              "https://x.com/hamzahalifia",
              "https://dribbble.com/hamzahalifia",
              "https://layers.to/hamzahalifia",
              "https://www.behance.net/alifiahamzah",
              "https://www.upwork.com/freelancers/~01c75d8b7b914aa93d?mp_source=share",
              "https://contra.com/alifiahamzah?referralExperimentNid=SOCIAL_REFERRAL_PROGRAM&referrerUsername=alifiahamzah"
            ]
          }
        }}
      />
      <Navbar />
      <main className="relative z-10 bg-[#FAFAF9] dark:bg-[#080809] border-b border-attio-border-light dark:border-attio-border-dark transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-0 lg:px-6">
          <div className="flex flex-col lg:flex-row gap-0 border-l-0 border-r-0 lg:border-l lg:border-r border-attio-border-light dark:border-attio-border-dark bg-white dark:bg-[#0A0A0B]">
            <ProfileSidebar />
            <div className="flex-1">
              <WorkShowcase />
            </div>
          </div>
        </div>
      </main>
      <FooterReveal />
    </motion.div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <ScrollToTop />
            <Toaster richColors position="top-right" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.215, 0.610, 0.355, 1.000] }}
            >
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/work" element={<WorkPage />} />
              <Route path="/work/:workId" element={<WorkDetail />} />
              <Route path="/exploration" element={<ExplorationPage />} />
              
              {/* Admin - Login */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Admin - Dashboard */}
              <Route path="/admin" element={<AdminDashboard />} />
              
              {/* Admin - Works Management */}
              <Route path="/admin/works" element={<WorksManagement />} />
              <Route path="/admin/work/new" element={<WorkEditor />} />
              <Route path="/admin/work/edit/:id" element={<WorkEditor />} />
              
              {/* Admin - Explorations Management */}
              <Route path="/admin/explorations" element={<ExplorationsManagement />} />
              <Route path="/admin/exploration/new" element={<ExplorationEditor />} />
              <Route path="/admin/exploration/edit/:id" element={<ExplorationEditor />} />
              
              {/* Admin - Settings */}
              <Route path="/admin/settings" element={<SettingsPage />} />

              {/* Error Pages */}
              <Route path="/500" element={<ServerError />} />
              <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </ErrorBoundary>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}