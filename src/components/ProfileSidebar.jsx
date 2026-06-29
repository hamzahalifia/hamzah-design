import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { RollingText } from './magicui/RollingText';
import DynamicClientLogos from './DynamicClientLogos';
import InteractiveGridPattern from './magicui/InteractiveGridPattern';

const TESTIMONIALS = [
  {
    id: 1,
    quote: "“Hamzah is a designer who is totality in his work and easy to understand all directions, either from users and customers.”",
    name: "Alfyan Syaputra",
    role: "Founder, Tappp",
    logoUrl: "/images/logo-tappp.webp",
  },
  {
    id: 2,
    quote: "“Hamzah is a designer who is totality in his work and easy to understand all directions, either from users and customers.”",
    name: "Dicky Handika",
    role: "Founder, Great Playbook Asia",
    logoUrl: "/images/logo-gpa.webp",
  },
  {
    id: 3,
    quote: "“A great product is about delivering value to the audience. Hamzah excels in product direction, ensuring every element captivates. His designs made and motion-video stand out, leading to many new sign-ups on our website.”",
    name: "Angga Risky",
    role: "Founder, BuildwithAngga",
    logoUrl: "/images/logo-bwa.webp",
  },
  {
    id: 4,
    quote: "“Hamzah standardized the UI/UX Design System and built the UI for Proovia at Neuronworks Indonesia. He has a good design sense and is a creative thinker. His innovative approach consistently elevates user experiences.”",
    name: "Terryus Gunawan",
    role: "Account Manager, Neuronworks",
    logoUrl: "/images/logo-neuron.webp",
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
      className="w-full lg:w-[429px] flex-shrink-0 lg:sticky lg:top-[60px] lg:h-[calc(100vh-60px)] border-b lg:border-b-0 lg:border-r border-attio-border-light dark:border-attio-border-dark bg-white dark:bg-[#0A0A0B] relative overflow-y-auto overflow-x-hidden flex flex-col justify-between"
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
        <div className="p-5 space-y-8 flex-shrink-0">
          {/* Wrapper */}
          <div className="space-y-3">
            {/* Profile Photo Placement */}
            <div className="w-[50px] h-[50px] flex items-center justify-center">
              <div className="w-[42.31px] h-[42.31px] rounded-[5px] overflow-hidden border-[1.24px] border-white dark:border-neutral-700 shadow-[0px_2.49px_3.73px_-0.62px_rgba(0,0,0,0.1),0px_1.24px_2.49px_-1.24px_rgba(0,0,0,0.1)] relative group">
                <img 
                  src="/images/profilephoto.webp" 
                  alt="Alifia Hamzah" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Sapaan */}
            <div>
              <h1 className="font-serif-attio text-[30px] leading-tight text-[#111827] dark:text-[#E5E7EB]">
                I'm Hamzah,<br />
                Your Design Partner.
              </h1>
            </div>

            {/* Bio */}
            <p className="text-base leading-6 text-[#111827] dark:text-[#E5E7EB] font-normal">
              For the last 4 year, I partner with companies to build and scale their data-driven enterprise tools with a story-data approach.
            </p>
          </div>

          {/* CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-full text-base font-semibold bg-[#1A1A1A] text-[#F0F5F2] dark:bg-white dark:text-black hover:opacity-95 transition-all active:scale-95 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)] cursor-pointer w-full sm:w-auto"
            >
              <RollingText>Let’s Talk</RollingText>
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
          <div className="p-5 space-y-4 bg-white dark:bg-[#0A0A0B]">
            {/* Header Description */}
            <p className="text-base leading-6 text-[#111827] dark:text-[#E5E7EB] font-normal">
              I proud on delivering thoughtful, clear, and meaningful work. Here’s client feedback from those I've worked with.
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
                  className="h-[200px] p-4 rounded-2xl rounded-bl-none bg-[#FDFDFD] dark:bg-[#121214] border border-[#E8E8E8] dark:border-neutral-800 flex flex-col justify-between shadow-sm"
                >
                  {/* Quote Text with Framer Motion Staggered Typewriter Effect */}
                  <p className="text-sm leading-5 text-[#141414] dark:text-[#E5E7EB] font-normal">
                    <FramerTypewriterQuote text={currentTestimonial.quote} />
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

      {/* Contact Channel Selection Modal Popup Portal (Figma Node 63:5986 exact match) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isContactModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 sm:p-6 pb-6 sm:pb-6">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsContactModalOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              {/* Modal Box (Popupchat #63:5986) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="relative z-10 w-full max-w-[429px] bg-white dark:bg-[#0A0A0B] text-[#111827] dark:text-white border border-[#CDD1CD] dark:border-attio-border-dark rounded-2xl shadow-2xl overflow-hidden flex flex-col mb-2 sm:mb-0"
              >
                {/* Subtle top-right background grid pattern */}
                <div className="absolute top-0 right-0 w-48 h-48 z-0 overflow-hidden [mask-image:radial-gradient(180px_circle_at_top_right,white,transparent)] pointer-events-none">
                  <InteractiveGridPattern width={24} height={24} squares={[8, 8]} className="opacity-40 dark:opacity-30" />
                </div>

                {/* 1. Title Section (#63:6634) */}
                <div className="p-5 border-b border-[#CDD1CD] dark:border-attio-border-dark space-y-3 relative z-10">
                  {/* Photos & Close Button Header Row */}
                  <div className="flex flex-row items-center justify-between w-full">
                    <div className="w-[50px] h-[50px] flex items-center justify-center">
                      <div className="w-[42.31px] h-[42.31px] rounded-[5px] overflow-hidden border-[1.24px] border-white dark:border-neutral-700 shadow-sm relative">
                        <img 
                          src="/images/profilephoto.webp" 
                          alt="Alifia Hamzah" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => setIsContactModalOpen(false)}
                      aria-label="Close modal"
                      className="p-1.5 rounded-full text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all active:scale-90 cursor-pointer"
                    >
                      <Icon icon="material-symbols:close" className="w-8 h-8" />
                    </button>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-1 pt-1">
                    <h3 className="font-serif-attio text-[30px] leading-tight text-[#111827] dark:text-white">
                      Let’s Talk
                    </h3>
                    <p className="text-base leading-6 text-[#111827] dark:text-[#E5E7EB] font-normal">
                      Which way do you prefer to communicate?
                    </p>
                  </div>
                </div>

                {/* 2. Middle Row: WhatsApp & Telegram Grid (#63:6722) */}
                <div className="grid grid-cols-2 divide-x divide-[#CDD1CD] dark:divide-attio-border-dark border-b border-[#CDD1CD] dark:border-attio-border-dark relative z-10">
                  {/* WhatsApp Btn (#63:6673) */}
                  <a
                    href="https://wa.me/6289685213110"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsContactModalOpen(false)}
                    className="p-4 flex flex-col justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors relative group cursor-pointer"
                  >
                    <div className="flex flex-row items-center justify-between w-full">
                      <div className="flex flex-row items-center gap-2">
                        <Icon icon="logos:whatsapp-icon" className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" />
                        <span className="px-3 py-1 rounded-full bg-[#D4F3E5] text-[#052E16] text-xs font-medium inline-block select-none">
                          most active
                        </span>
                      </div>
                      <Icon icon="lucide:arrow-up-right" className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <span className="text-base font-semibold text-[#111827] dark:text-white">
                      <RollingText>WhatsApp</RollingText>
                    </span>
                  </a>

                  {/* Telegram Btn (#63:6680) */}
                  <a
                    href="https://t.me/hamzahalifia"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsContactModalOpen(false)}
                    className="p-4 flex flex-col justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors relative group cursor-pointer"
                  >
                    <div className="flex flex-row items-center justify-between w-full">
                      <Icon icon="logos:telegram" className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" />
                      <Icon icon="lucide:arrow-up-right" className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <span className="text-base font-semibold text-[#111827] dark:text-white">
                      <RollingText>Telegram</RollingText>
                    </span>
                  </a>
                </div>

                {/* 3. Third Row: Schedule 30-min Call (#63:6690) */}
                <a
                  href="https://cal.com/alifiahamzah/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsContactModalOpen(false)}
                  className="py-6 px-4 flex flex-row items-center justify-between border-b border-[#CDD1CD] dark:border-attio-border-dark hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors group cursor-pointer relative z-10"
                >
                  <div className="flex flex-row items-center justify-center gap-4 mx-auto">
                    <Icon icon="logos:google-meet" className="w-6 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-base font-semibold text-[#111827] dark:text-white">
                      <RollingText>Schedule 30-min Call</RollingText>
                    </span>
                  </div>
                  <Icon icon="lucide:arrow-up-right" className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all absolute right-4" />
                </a>

                {/* 4. Fourth Row: Email Link (#63:6703, Stacked on Mobile) */}
                <a
                  href="mailto:alifiahamzah@gmail.com?subject=Hi%20mate"
                  onClick={() => setIsContactModalOpen(false)}
                  className="py-5 sm:py-6 px-4 flex flex-col sm:flex-row items-center justify-center text-center gap-1 sm:gap-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors group cursor-pointer relative z-10"
                >
                  <span className="text-sm sm:text-base font-normal text-[#6B7280] dark:text-neutral-400">
                    Or send an email via
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-[#111827] dark:text-white underline decoration-neutral-300 dark:decoration-neutral-600 group-hover:decoration-black dark:group-hover:decoration-white transition-colors">
                    alifiahamzah@gmail.com
                  </span>
                </a>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </aside>
  );
}