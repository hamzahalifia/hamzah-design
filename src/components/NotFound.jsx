import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../context/ThemeContext';
import { RollingText } from './magicui/RollingText';
import InteractiveGridPattern from './magicui/InteractiveGridPattern';

export default function NotFound() {
  const { theme } = useTheme();

  const [gridSize, setGridSize] = React.useState([24, 16]);

  React.useEffect(() => {
    const handleResize = () => {
      const width = Math.ceil(window.innerWidth / 40);
      const height = Math.ceil(window.innerHeight / 40);
      setGridSize([width, height]);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Helmet>
        <title>Page Not Found</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
        className="h-screen w-screen flex flex-col items-center justify-center bg-[#FAFAF9] dark:bg-[#080809] text-[#111827] dark:text-[#F4F4F5] relative overflow-hidden px-6"
      >
        {/* Background Dot Pattern */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-25">
          <InteractiveGridPattern
            width={40}
            height={40}
            squares={gridSize}
            className="w-full h-full"
          />
        </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* 404 Numeric */}
        <motion.span
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          className="font-mono text-[120px] sm:text-[160px] font-bold leading-none tracking-tighter text-[#111827] dark:text-[#F4F4F5] select-none"
        >
          404
        </motion.span>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          className="w-16 h-[2px] bg-[#CDD1CD] dark:bg-[#27272A] my-6 origin-center"
        />

        {/* Headline */}
        <motion.h1
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          className="font-serif-attio text-[36px] sm:text-[48px] leading-tight mb-4"
        >
          Page not found
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          className="text-base leading-6 text-[#6B7280] dark:text-[#A1A1AA] mb-10 max-w-sm"
        >
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </motion.p>

        {/* Back Home Button */}
        <motion.div
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
        >
          <Link
            to="/"
            className="group/roll inline-flex items-center justify-center px-6 py-3 btn-radius-lg text-base font-semibold bg-[#1A1A1A] text-[#F0F5F2] dark:bg-white dark:text-black hover:opacity-95 transition-all active:scale-95 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)] cursor-pointer"
          >
            <RollingText>Back to Home</RollingText>
          </Link>
        </motion.div>
      </div>
    </motion.div>
    </>
  );
}