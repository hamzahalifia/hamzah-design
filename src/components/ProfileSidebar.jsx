import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import DynamicClientLogos from './DynamicClientLogos';
import InteractiveGridPattern from './magicui/InteractiveGridPattern';
import { DotPattern } from './magicui/DotPattern';
import { RollingText } from './magicui/RollingText';
import LetsTalkModal from './LetsTalkModal';

const TESTIMONIALS = [
  {
    id: 1,
    quote: "Hamzah is a designer who is totality in his work and easy to understand all directions, either from users and customers.",
    name: "Alfyan Syaputra",
    role: "Founder, Tappp",
    logoUrl: "/images/testimoni_logo/logo-tappp.webp",
  },
  {
    id: 2,
    quote: "Hamzah is a designer who is totality in his work and easy to understand all directions, either from users and customers.",
    name: "Dicky Handika",
    role: "Founder, Great Playbook Asia",
    logoUrl: "/images/testimoni_logo/logo-gpa.webp",
  },
  {
    id: 3,
    quote: "Hamzah excels in product direction, ensuring every element captivates. His designs made and motion-video stand out, leading to many new sign-ups on our website.",
    name: "Angga Risky",
    role: "Founder, BuildwithAngga",
    logoUrl: "/images/testimoni_logo/logo-bwa.webp",
  },
  {
    id: 4,
    quote: "Hamzah standardized the UI/UX Design System and built the UI for Proovia at Neuronworks Indonesia. He has a good design sense and is a creative thinker. His innovative approach consistently elevates user experiences.",
    name: "Terryus Gunawan",
    role: "Account Manager, Neuronworks",
    logoUrl: "/images/testimoni_logo/logo-neuron.webp",
  }
];

function FramerTypewriterQuote({ text }) {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.01 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 3,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      className="inline-block"
      variants={container}
      initial="hidden"
      animate="visible"
      key={text}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          className="inline-block mr-[0.25em]"
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Helper to truncate text programmatically with ellipsis
const truncateQuote = (quote, limit = 80) => {
  if (!quote) return "";
  let cleaned = quote.trim();
  if (cleaned.startsWith('"') || cleaned.startsWith('"')) {
    cleaned = cleaned.slice(1);
  }
  if (cleaned.endsWith('"') || cleaned.endsWith('"')) {
    cleaned = cleaned.slice(0, -1);
  }
  if (cleaned.length <= limit) {
    return `"${cleaned}"`;
  }
  return `"${cleaned.slice(0, limit).trim()}..."`;
};

export default function ProfileSidebar() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    const autoRotate = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(autoRotate);
  }, []);

  const currentTestimonial = TESTIMONIALS[activeTestimonial] || TESTIMONIALS[0];

  return (
    <aside 
      id="about" 
      className="w-full lg:w-[429px] flex-shrink-0 lg:sticky lg:top-[60px] lg:h-[calc(100vh-60px)] border-b lg:border-b-0 lg:border-r border-attio-border-light dark:border-attio-border-dark bg-white dark:bg-[#0A0A0B] relative overflow-visible flex flex-col justify-between"
    >
      {/* Interactive Grid Pattern in top right with subtle radial mask */}
      <div className="absolute top-0 right-0 w-64 h-64 z-0 overflow-hidden [mask-image:radial-gradient(220px_circle_at_top_right,white,transparent)] pointer-events-none">
        <InteractiveGridPattern 
          width={32} 
          height={32} 
          squares={[10, 10]} 
          className="opacity-70 dark:opacity-40" 
        />
      </div>

      <div className="flex-1 flex flex-col justify-between min-h-full relative z-10">
        {/* Top Header & Bio Section (Title) */}
        <div className="pt-5 pb-3 px-5 space-y-6 flex-shrink-0">
          {/* Wrapper */}
          <div className="space-y-3">
            {/* Profile Photo Placement */}
            <div className="w-[50px] h-[50px] flex items-center justify-center">
              <div className="w-[42.31px] h-[42.31px] rounded-[5px] overflow-hidden border-[1.24px] border-white dark:border-neutral-700 shadow-[0px_2.49px_3.73px_-0.62px_rgba(0,0,0,0.1),0px_1.24px_2.49px_-1.24px_rgba(0,0,0,0.1)] relative group">
                <img 
                  src="/images/general/profilephoto.webp" 
                  alt="Alifia Hamzah" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Sapaan */}
            <div>
              <h1 className="font-serif-attio text-[30px] leading-tight text-[#111827] dark:text-[#E5E7EB]">
                I'm Alifia Hamzah,<br />
                Enterprise Product Designer.
              </h1>
            </div>

            {/* Bio */}
            <p className="text-base leading-6 text-[#111827] dark:text-[#E5E7EB] font-normal">
              For the last 4 years, I partner with companies to build and scale their data-driven enterprise tools with a story-data approach.
            </p>
          </div>

          {/* CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-full text-base font-semibold bg-[#1A1A1A] text-[#F0F5F2] dark:bg-white dark:text-black hover:opacity-95 transition-all active:scale-95 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)] cursor-pointer w-full sm:w-auto"
            >
              <RollingText>Let's Talk</RollingText>
            </button>

            <span className="hidden sm:inline text-base font-semibold text-black dark:text-white">
              or
            </span>

            <a
              href="https://drive.google.com/file/d/1mAf33lnuU8jFjZxiJINHke9qOE1AuPsg/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-full text-base font-semibold bg-[#F2F2F2] text-[#111827] dark:bg-neutral-800 dark:text-white dark:border-neutral-700 border border-attio-border-light hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all active:scale-95 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)] cursor-pointer w-full sm:w-auto"
            >
              <RollingText>Download Resume</RollingText>
            </a>
          </div>
        </div>

        {/* Bottom Group: Testimony then Client Logos */}
        <div className="flex-shrink-0 mt-auto">
          {/* Testimony Section */}
          <div className="pt-3 pb-3 px-5 space-y-3 bg-white dark:bg-[#0A0A0B]">
            {/* Header Description */}
            <p className="text-base leading-6 text-[#111827] dark:text-[#E5E7EB] font-normal">
              I proud on delivering thoughtful, clear, and meaningful work. Here's client feedback from those I've worked with.
            </p>

            {/* Card Container */}
            <div className="space-y-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="h-[140px] p-4 rounded-2xl rounded-bl-none bg-[#FDFDFD] dark:bg-[#121214] border border-[#E8E8E8] dark:border-neutral-800 flex flex-col justify-between shadow-sm"
                >
                  {/* Quote Text with Framer Motion Staggered Typewriter Effect */}
                  <p className="text-sm leading-5 text-[#141414] dark:text-[#E5E7EB] font-normal overflow-hidden">
                    <FramerTypewriterQuote text={truncateQuote(currentTestimonial.quote, 80)} />
                  </p>

                  {/* Author & Logo Row */}
                  <div className="flex flex-row items-center justify-between w-full pt-2">
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-sm font-semibold text-[#141414] dark:text-white">
                        {currentTestimonial.name}
                      </h4>
                      <p className="text-xs font-medium text-[#737373] dark:text-neutral-400">
                        {currentTestimonial.role}
                      </p>
                    </div>

                    <div className="w-[110px] h-[48px] flex items-center justify-end">
                      <img
                        src={currentTestimonial.logoUrl}
                        alt={currentTestimonial.role}
                        className="max-h-8 sm:max-h-9 max-w-full object-contain dark:grayscale dark:invert transition-all duration-300"
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Pagination Dots (Aligned to bottom-left) */}
              <div className="flex flex-row justify-start items-center gap-2 pt-1 px-1">
                {TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`w-[4px] h-[4px] rounded-full transition-colors duration-300 ${
                      idx === activeTestimonial 
                        ? 'bg-[#4B5563] dark:bg-white' 
                        : 'bg-[#D1D5DB] dark:bg-neutral-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Client Logos Section */}
          <DynamicClientLogos />
        </div>
      </div>

      {/* Let's Talk Modal with outer grid frame */}
      <LetsTalkModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </aside>
  );
}