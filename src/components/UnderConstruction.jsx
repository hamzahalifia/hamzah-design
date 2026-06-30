import React from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import FooterReveal from './FooterReveal';
import { RollingText } from './magicui/RollingText';
import { GridPattern } from './magicui/GridPattern';
import ClosePopup from './ClosePopup';

export default function UnderConstruction({ pageTitle }) {
  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#080809] text-attio-text-primary-light dark:text-attio-text-primary-dark flex flex-col justify-between">
      <Navbar />

      <main className="relative z-10 bg-[#FAFAF9] dark:bg-[#080809] flex-1 border-b border-attio-border-light dark:border-attio-border-dark transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-0 lg:px-6">
          <div className="border-l-0 border-r-0 lg:border-l lg:border-r border-attio-border-light dark:border-attio-border-dark min-h-full bg-white dark:bg-[#0A0A0B] flex items-center justify-center p-6">
            
            {/* Card Wrapper (relative for ClosePopup sibling) */}
            <div className="relative z-10 w-full max-w-[500px] my-12">
              <ClosePopup to="/" ariaLabel="Back to Home" />

              {/* Modal-like Card centered vertically and horizontally */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="bg-white dark:bg-[#0A0A0B] text-[#111827] dark:text-white 
                           border border-[#CDD1CD] dark:border-attio-border-dark
                           rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              >
                {/* Interactive Grid Pattern in top right with radial mask */}
              <div className="absolute top-0 right-0 w-64 h-64 z-0 overflow-hidden [mask-image:radial-gradient(220px_circle_at_top_right,white,transparent)] pointer-events-none">
                <GridPattern 
                  width={32} 
                  height={32} 
                  squares={[[10, 10]]} 
                  className="opacity-70 dark:opacity-40" 
                />
              </div>

              {/* Title Section */}
              <div className="relative z-10 p-5 border-b border-[#CDD1CD] dark:border-attio-border-dark space-y-3">
                {/* Icon row */}
                <div className="flex flex-row items-center w-full">
                  <div className="w-[50px] h-[50px] flex items-center justify-center">
                    <div className="w-[42.31px] h-[42.31px] rounded-[5px] overflow-hidden border-[1.24px] border-white dark:border-neutral-700 shadow-sm flex items-center justify-center bg-neutral-50 dark:bg-neutral-800">
                      <Icon icon="solar:hammer-bold-duotone" className="w-6 h-6 text-neutral-600 dark:text-neutral-300" />
                    </div>
                  </div>
                </div>

                {/* Heading + subtitle */}
                <div className="space-y-1 pt-1">
                  <h3 className="font-serif-attio text-[30px] leading-tight text-[#111827] dark:text-white">
                    {pageTitle}
                  </h3>
                  <p className="text-base leading-6 text-[#111827] dark:text-[#E5E7EB] font-normal">
                    Under Construction
                  </p>
                </div>
              </div>

              {/* Description Section */}
              <div className="relative z-10 p-5 border-b border-[#CDD1CD] dark:border-attio-border-dark space-y-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  This section is currently being crafted with precision. Check back soon for full case studies and deep dives.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="relative z-10 p-5 space-y-4">
                <Link
                  to="/"
                  className="group py-4 px-4 flex flex-row items-center justify-between border-b border-[#CDD1CD] dark:border-attio-border-dark hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer -mx-5 -mt-5"
                >
                  <div className="flex flex-row items-center justify-center gap-4 mx-auto">
                    <Icon icon="solar:alt-arrow-left-linear" className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-base font-semibold text-[#111827] dark:text-white">
                      <RollingText>Back to Home</RollingText>
                    </span>
                  </div>
                  <Icon icon="lucide:arrow-up-right" className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all absolute right-4" />
                </Link>
              </div>
              </motion.div>
            </div>

          </div>
        </div>
      </main>

      <FooterReveal />
    </div>
  );
}