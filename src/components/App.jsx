import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '../context/ThemeContext';
import ScrollToTop from './ScrollToTop';
import ErrorBoundary from './ErrorBoundary';
import { Agentation } from 'agentation';
import SoundManager from './SoundManager';
import { Toaster } from './ui/sonner';

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

  // Normalize pathname to ignore trailing slashes (except for '/')
  const normalizedPathname = location.pathname.endsWith('/') && location.pathname.length > 1
    ? location.pathname.slice(0, -1)
    : location.pathname;

  const showNavbar = ['/', '/about', '/work', '/exploration'].includes(normalizedPathname) ||
    /^\/work\/[^/]+$/.test(normalizedPathname) ||
    /^\/exploration\/[^/]+$/.test(normalizedPathname);

  return (
    <>
      {showNavbar && (
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
      )}

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

function AgentationWrapper() {
  const navigate = useNavigate();

  const tools = [
    {
      name: 'navigate',
      description: 'Navigates to a specified path within the application.',
      inputSchema: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path to navigate to (e.g., "/about", "/work/my-case-study")',
          },
        },
        required: ['path'],
      },
      execute: async ({ path }) => {
        navigate(path);
        return { success: true, message: `Navigated to ${path}` };
      },
    },
    // Add other tools here as needed
  ];

  return (
    <Agentation
      endpoint="http://localhost:4747"
      onSessionCreated={(sessionId) => {
        console.log('Agentation session started:', sessionId);
      }}
      tools={tools} // Pass the defined tools
    />
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <SoundManager />
        <Toaster position="bottom-center" />
        <BrowserRouter>
          <ErrorBoundary>
            <ScrollToTop />
            {process.env.NODE_ENV === 'development' && <AgentationWrapper />}
            <Suspense fallback={null}>
                <AppRoutes />
              </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}