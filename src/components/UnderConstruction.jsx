import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Navbar from './Navbar';
import FooterReveal from './FooterReveal';
import { RollingText } from './magicui/RollingText';

export default function UnderConstruction({ pageTitle }) {
  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-attio-bg-dark text-attio-text-primary-light dark:text-attio-text-primary-dark flex flex-col justify-between">
      <Navbar />

      <main className="relative z-10 bg-[#FAFAF9] dark:bg-attio-bg-dark flex-1 flex flex-col justify-center items-center text-center p-6 my-12 border-b border-attio-border-light dark:border-attio-border-dark">
        <div className="max-w-md space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-attio-border-light dark:border-attio-border-dark flex items-center justify-center mx-auto text-neutral-800 dark:text-neutral-200">
            <Icon icon="solar:hammer-bold-duotone" className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase font-bold">
              {pageTitle} Page
            </span>
            <h1 className="font-serif-attio text-4xl font-normal tracking-tight">
              Under Construction
            </h1>
            <p className="text-sm text-attio-text-secondary-light dark:text-attio-text-secondary-dark leading-relaxed">
              This section is currently being crafted with precision. Check back soon for full case studies and deep dives.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#1A1A1A] text-white dark:bg-white dark:text-black hover:opacity-90 transition-all btn-attio-primary"
          >
            <Icon icon="solar:alt-arrow-left-linear" className="w-4 h-4" />
            <RollingText>Back to Home</RollingText>
          </Link>
        </div>
      </main>

      <FooterReveal />
    </div>
  );
}
