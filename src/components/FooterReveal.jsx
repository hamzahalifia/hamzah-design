import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { DotPattern } from './magicui/DotPattern';
import { RollingText } from './magicui/RollingText';
import { SlidingNumber } from './core/sliding-number';

export default function FooterReveal() {
  const { theme } = useTheme();
  const location = useLocation();
  const [CalComponent, setCalComponent] = useState(null);
  const [loadCalendar, setLoadCalendar] = useState(false);
  const containerRef = useRef(null);

  const [isTallScreen, setIsTallScreen] = useState(true);

  useEffect(() => {
    const checkHeight = () => {
      setIsTallScreen(window.innerHeight >= 800);
    };
    checkHeight();
    window.addEventListener('resize', checkHeight);
    return () => window.removeEventListener('resize', checkHeight);
  }, []);

  // Work & Exploration: konten pendek, footer ikut scroll normal
  const nonStickyPaths = ['/work', '/exploration'];
  const isStickyPage = !nonStickyPaths.some(p => location.pathname.startsWith(p)) && isTallScreen;

  // Trigger calendar loading when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadCalendar(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Pre-load when within 200px of viewport
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const calApiRef = useRef(null);

  // Dynamically load Cal.com SDK on demand
  useEffect(() => {
    if (!loadCalendar) return;

    let active = true;
    import("@calcom/embed-react")
      .then((module) => {
        if (!active) return;
        setCalComponent(() => module.default);
        
        // Initialize API only once
        if (!calApiRef.current) {
          module.getCalApi({ "namespace": "30min" }).then((cal) => {
            if (!active) return;
            calApiRef.current = cal;
            // Apply initial theme
            cal("ui", {
              "hideEventTypeDetails": false,
              "layout": "month_view",
              "theme": theme === 'dark' ? 'dark' : 'light'
            });
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load Cal.com SDK:", err);
      });

    return () => {
      active = false;
    };
  }, [loadCalendar]);

  // Update theme when it changes
  useEffect(() => {
    if (calApiRef.current && loadCalendar) {
      calApiRef.current("ui", { "theme": theme === 'dark' ? 'dark' : 'light' });
    }
  }, [theme, loadCalendar]);

  // Realtime Bandung Clock — separate parts for SlidingNumber
  const [clockHours, setClockHours] = useState(0);
  const [clockMinutes, setClockMinutes] = useState(0);
  const [clockSeconds, setClockSeconds] = useState(0);
  const [clockLabel, setClockLabel] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = days[now.getDay()];
      
      const hour = now.getHours();
      let period = 'evening';
      if (hour >= 5 && hour < 12) period = 'morning';
      else if (hour >= 12 && hour < 18) period = 'afternoon';

      setClockHours(now.getHours());
      setClockMinutes(now.getMinutes());
      setClockSeconds(now.getSeconds());
      setClockLabel(`${dayName} ${period}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer 
      className={`relative z-10 w-full h-auto bg-[#FAFAFB] dark:bg-[#080809] text-attio-text-primary-light dark:text-attio-text-primary-dark flex flex-col justify-between border-t border-attio-border-light dark:border-attio-border-dark overflow-visible transition-colors duration-300 ${isStickyPage ? 'lg:sticky bottom-0 lg:z-0 lg:h-screen lg:overflow-hidden' : ''}`}
    >
      {/* Outer Wrapper Matching App.jsx Structure Exactly */}
      <div className={`max-w-[1440px] w-full mx-auto px-0 lg:px-6 flex-1 flex flex-col justify-between overflow-visible ${isStickyPage ? 'lg:overflow-hidden' : ''}`}>
        {/* Centered Bounded Section Sharing Left/Right Borders with Dynamic Height */}
        <div className={`relative z-10 flex-1 border-l-0 border-r-0 lg:border-l lg:border-r border-attio-border-light dark:border-attio-border-dark bg-dot-grid flex flex-col justify-start lg:justify-center items-center text-center px-4 sm:px-6 pt-12 pb-12 lg:pt-[90px] lg:pb-0 my-0 overflow-visible ${isStickyPage ? 'lg:overflow-hidden' : ''}`}>
          
          {/* Larger MagicUI DotPattern Background */}
          <DotPattern
            width={24}
            height={24}
            cx={2}
            cy={2}
            cr={1.5}
            className="opacity-50 dark:opacity-25 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
          />

          {/* CTA Headline & Description */}
          <div className="relative z-10 max-w-2xl space-y-2 mb-4 lg:mb-6 flex-shrink-0">
            <h2 className="font-sans text-2xl sm:text-4xl lg:text-4xl font-semibold tracking-tight text-attio-text-primary-light dark:text-attio-text-primary-dark">
              Ready for the next challenge!
            </h2>
            <p className="text-sm text-attio-text-secondary-light dark:text-attio-text-secondary-dark leading-relaxed font-normal">
              I am open to new opportunities and ready to discuss how my data-driven approach can elevate your enterprise tools.
            </p>
          </div>

          {/* Clean Seamless Cal.com Calendar Embed Container */}
          <div ref={containerRef} className="relative z-10 w-full max-w-[1000px] h-auto min-h-[415px] overflow-hidden rounded-xl bg-transparent flex-shrink-0">
            {loadCalendar && CalComponent ? (
              <div 
                style={{ 
                  width: "100%", 
                  height: "auto",
                  transform: "scale(1)", 
                  transformOrigin: "top left" 
                }}
              >
                <CalComponent 
                  key={theme}
                  namespace="30min"
                  calLink="alifiahamzah/30min"
                  style={{ width: "100%", height: "auto", overflow: "visible" }}
                  config={{ 
                    "layout": "month_view", 
                    "useSlotsViewOnSmallScreen": "true", 
                    "theme": theme === 'dark' ? 'dark' : 'light',
                    "hideEventTypeDetails": false
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-attio-border-light/20 dark:border-attio-border-dark/20 rounded-xl bg-[#FAFAFB]/50 dark:bg-zinc-950/10 min-h-[300px]">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-neutral-400 border-t-transparent dark:border-neutral-600 dark:border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-neutral-500 font-sans">Loading Calendar...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Information Bar Always Visible in 100vh Viewport */}
      <div className="relative z-10 border-t border-attio-border-light dark:border-attio-border-dark bg-[#FAFAFB] dark:bg-[#080809] transition-colors duration-300 flex-shrink-0">
        <div className="max-w-[1440px] mx-auto px-0 lg:px-6">
          <div className="border-l-0 border-r-0 lg:border-l lg:border-r border-attio-border-light dark:border-attio-border-dark py-4 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            {/* Stacked Location & Realtime Clock */}
            <div className="flex flex-col items-center sm:items-start text-attio-text-secondary-light dark:text-attio-text-secondary-dark space-y-0.5">
              <span className="font-semibold text-attio-text-primary-light dark:text-attio-text-primary-dark">
                Based in Bandung, Indonesia
              </span>
              <span className="font-mono text-neutral-500 dark:text-neutral-400 flex items-center gap-0.5">
                {clockLabel || 'Loading...'},{' '}
                <SlidingNumber value={clockHours} padStart={true} />
                <span className="text-neutral-400 dark:text-neutral-500">:</span>
                <SlidingNumber value={clockMinutes} padStart={true} />
                <span className="text-neutral-400 dark:text-neutral-500">:</span>
                <SlidingNumber value={clockSeconds} padStart={true} />
                <span className="ml-1">(GMT+7)</span>
              </span>
            </div>

            {/* Social Links with RollingText & Copyright — centered on mobile, right on sm */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-attio-text-secondary-light dark:text-attio-text-secondary-dark">
              <div className="flex items-center gap-4 font-medium">
                <a href="https://www.instagram.com/hamzahalifia" target="_blank" rel="noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer py-0.5">
                  <RollingText>Instagram</RollingText>
                </a>
                <a href="https://www.threads.net/@hamzahalifia" target="_blank" rel="noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer py-0.5">
                  <RollingText>Thread</RollingText>
                </a>
                <a href="https://www.linkedin.com/in/alifiahamzah/" target="_blank" rel="noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer py-0.5">
                  <RollingText>LinkedIn</RollingText>
                </a>
              </div>
              <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
              <span className="text-attio-text-primary-light dark:text-attio-text-primary-dark font-medium">Hamzah Design © {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}