import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '../context/ThemeContext';
import ScrollToTop from './ScrollToTop';
import ErrorBoundary from './ErrorBoundary';
import { Agentation } from 'agentation';
import SoundManager from './SoundManager';

// Lazy load components
const Navbar = lazy(() => import('@/components/Navbar'));
const HomePage = lazy(() => import('@/components/HomePage'));
const About = lazy(() => import('./About'));
const WorkPage = lazy(() => import('@/components/WorkPage'));
const WorkDetail = lazy(() => import('@/components/WorkDetail'));
const ExplorationPage = lazy(() => import('@/components/ExplorationPage'));
const NotFound = lazy(() => import('@/components/NotFound'));
// const ServerError = lazy(() => import('./components/ServerError')); // Ini tidak digunakan

function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/work/:slug" element={<WorkDetail />} />
        <Route path="/exploration" element={<ExplorationPage />} />
        <Route path="/exploration/:slug" element={<ExplorationPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <SoundManager />
        <BrowserRouter>
          <ErrorBoundary>
            <ScrollToTop />

            {process.env.NODE_ENV === 'development' && (
              <Agentation
                endpoint="http://localhost:4747"
                onSessionCreated={(sessionId) => {
                  console.log('Agentation session started:', sessionId);
                }}
              />
            )}
            <Suspense fallback={null}>
                <AppRoutes />
              </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}