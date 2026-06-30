import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { RollingText } from './magicui/RollingText';
import { GridPattern } from './magicui/GridPattern';
import ClosePopup from './ClosePopup';

export default function LetsTalkModal({ isOpen, onClose }) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* ── Card Wrapper (relative for ClosePopup sibling) ── */}
          <div className="relative z-10 w-full sm:w-[500px] mx-auto">
            <ClosePopup onClose={onClose} />

            {/* ── Popup Card ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 24 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="bg-white dark:bg-[#0A0A0B] text-[#111827] dark:text-white 
                         border border-[#CDD1CD] dark:border-attio-border-dark
                         rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
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

           {/* ── 1. Title Section ── */}
              <div className="relative z-10 p-5 border-b border-[#CDD1CD] dark:border-attio-border-dark space-y-3">
                {/* Profile photo row */}
                <div className="flex flex-row items-center w-full">
                  <div className="w-[50px] h-[50px] flex items-center justify-center">
                    <div className="w-[42.31px] h-[42.31px] rounded-[5px] overflow-hidden border-[1.24px] border-white dark:border-neutral-700 shadow-sm">
                      <img
                        src="/images/general/profilephoto.webp"
                        alt="Alifia Hamzah"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Heading + subtitle */}
                <div className="space-y-1 pt-1">
                  <h3 className="font-serif-attio text-[30px] leading-tight text-[#111827] dark:text-white">
                    Let's Talk
                  </h3>
                  <p className="text-base leading-6 text-[#111827] dark:text-[#E5E7EB] font-normal">
                    Which way do you prefer to communicate?
                  </p>
                </div>
              </div>

              {/* ── 2. WhatsApp & Telegram Row ── */}
              <div className="grid grid-cols-2 divide-x divide-[#CDD1CD] dark:divide-attio-border-dark border-b border-[#CDD1CD] dark:border-attio-border-dark">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/6289685213110"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="group p-4 flex flex-col justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
                >
                  <div className="flex flex-row items-center justify-between w-full">
                    <div className="flex flex-row items-center gap-2">
                      <Icon icon="logos:whatsapp-icon" className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" />
                      <span className="px-3 py-1 rounded-full bg-[#D4F3E5] text-[#052E16] text-xs font-medium select-none">
                        most active
                      </span>
                    </div>
                    <Icon icon="lucide:arrow-up-right" className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <span className="text-base font-semibold text-[#111827] dark:text-white">
                    <RollingText>WhatsApp</RollingText>
                  </span>
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/hamzahalifia"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="group p-4 flex flex-col justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
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

              {/* ── 3. Schedule 30-min Call ── */}
              <a
                href="https://cal.com/alifiahamzah/30min"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="group py-6 px-4 flex flex-row items-center justify-between border-b border-[#CDD1CD] dark:border-attio-border-dark hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
              >
                <div className="flex flex-row items-center justify-center gap-4 mx-auto">
                  <Icon icon="logos:google-meet" className="w-6 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-base font-semibold text-[#111827] dark:text-white">
                    <RollingText>Schedule 30-min Call</RollingText>
                  </span>
                </div>
                <Icon icon="lucide:arrow-up-right" className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all absolute right-4" />
              </a>

              {/* ── 4. Email ── */}
              <a
                href="mailto:alifiahamzah@gmail.com?subject=Hi%20mate"
                onClick={onClose}
                className="py-5 sm:py-6 px-4 flex flex-col sm:flex-row items-center justify-center text-center gap-1 sm:gap-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors group cursor-pointer"
              >
                <span className="text-sm sm:text-base font-normal text-[#6B7280] dark:text-neutral-400">
                  <RollingText>Or send an email via</RollingText>
                </span>
                <span className="text-sm sm:text-base font-semibold text-[#111827] dark:text-white underline decoration-neutral-300 dark:decoration-neutral-600 group-hover:decoration-black dark:group-hover:decoration-white transition-colors">
                  <RollingText>alifiahamzah@gmail.com</RollingText>
                </span>
              </a>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}