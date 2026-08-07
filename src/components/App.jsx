import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '../context/ThemeContext';
import ScrollToTop from './ScrollToTop';
import ErrorBoundary from './ErrorBoundary';
import { Agentation } from 'agentation';
import SoundManager from './SoundManager';
import { Toaster } from './ui/sonner';
import GlowInitializer from './core/GlowInitializer';

// Lazy load components
const Navbar = lazy(() => import('./Navbar'));
const HomePage = lazy(() => import('./HomePage'));
const About = lazy(() => import('./About'));
const WorkPage = lazy(() => import('./WorkPage'));
const WorkDetail = lazy(() => import('./WorkDetail'));
const ExplorationPage = lazy(() => import('./ExplorationPage'));
const NotFound = lazy(() => import('./NotFound'));
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
  useEffect(() => {
    let originalTitle = document.title;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        originalTitle = document.title;
        document.title = "Hey, Comeback!";
      } else {
        document.title = originalTitle;
      }
    };

    const observer = new MutationObserver(() => {
      if (!document.hidden) {
        originalTitle = document.title;
      }
    });

    const titleElement = document.querySelector('title');
    if (titleElement) {
      observer.observe(titleElement, { childList: true, subtree: true });
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider>
        <GlowInitializer />
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