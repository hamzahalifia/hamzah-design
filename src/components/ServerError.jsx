import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { RollingText } from './magicui/RollingText';
import InteractiveGridPattern from './magicui/InteractiveGridPattern';

export default function ServerError() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
      className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF9] dark:bg-[#080809] text-[#111827] dark:text-[#F4F4F5] relative overflow-hidden px-6"
    >
      {/* Background Dot Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-25">
        <InteractiveGridPattern
          width={40}
          height={40}
          squares={[24, 16]}
          className="w-full h-full"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Error Code */}
        <motion.span
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          className="font-mono text-[80px] sm:text-[120px] font-bold leading-none tracking-tighter text-[#DC2626] dark:text-[#F87171] select-none"
        >
          500
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
          Something went wrong
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          className="text-base leading-6 text-[#6B7280] dark:text-[#A1A1AA] mb-8 max-w-sm"
        >
          Our servers are having a moment. This is on us—please try again in a bit.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <button
            onClick={() => navigate(0)}
            className="group/roll inline-flex items-center justify-center px-6 py-3 rounded-full text-base font-semibold bg-[#1A1A1A] text-[#F0F5F2] dark:bg-white dark:text-black hover:opacity-95 transition-all active:scale-95 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)] cursor-pointer"
          >
            <RollingText>Reload Page</RollingText>
          </button>

          <a
            href="mailto:alifiahamzah@gmail.com?subject=Site%20Error%20Report"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full text-base font-semibold border border-[#CDD1CD] dark:border-[#27272A] text-[#545454] dark:text-[#D4D4D8] hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-all active:scale-95 cursor-pointer"
          >
            Report Issue
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}