import React from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * ClosePopup — floating close/back button positioned above the popup card.
 * Sits as a sibling element to the modal, never clipped by overflow.
 */
export default function ClosePopup({ onClose, to, ariaLabel = 'Close' }) {
  const className =
    "w-10 h-10 rounded-full bg-white dark:bg-[#0A0A0B] border border-[#CDD1CD] dark:border-attio-border-dark shadow-lg flex items-center justify-center text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all active:scale-90 cursor-pointer";

  // If `to` is provided, render as a Link (for UnderConstruction back button)
  if (to) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.15 }}
        className="absolute -top-12 right-0 z-30"
      >
        <Link to={to} aria-label={ariaLabel} className={className}>
          <Icon icon="material-symbols:close" className="w-5 h-5" />
        </Link>
      </motion.div>
    );
  }

  // Otherwise render as a button with onClick
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.15 }}
      className="absolute -top-12 right-0 z-30"
    >
      <button onClick={onClose} aria-label={ariaLabel} className={className}>
        <Icon icon="material-symbols:close" className="w-5 h-5" />
      </button>
    </motion.div>
  );
}