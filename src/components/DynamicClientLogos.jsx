import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CLIENT_LOGOS = [
  { id: 'amigos', name: 'Amigos', src: '/images/client_logo/clientlogo_amigos.webp' },
  { id: 'ampd', name: 'AMPD', src: '/images/client_logo/clientlogo_ampd.webp' },
  { id: 'arumaya', name: 'Arumaya', src: '/images/client_logo/clientlogo_arumaya.webp' },
  { id: 'kangamoon', name: 'Kangamoon', src: '/images/client_logo/clientlogo_kangamoon.webp' },
  { id: 'mtlab', name: 'MTLab', src: '/images/client_logo/clientlogo_mtlab.webp' },
  { id: 'nextiva', name: 'Nextiva', src: '/images/client_logo/clientlogo_nextiva.webp' },
  { id: 'oneev', name: 'OneEV', src: '/images/client_logo/clientlogo_oneev.webp' },
  { id: 'pertamina', name: 'Pertamina', src: '/images/client_logo/clientlogo_pertamina.webp' },
  { id: 'tanpakoding', name: 'Tanpakoding', src: '/images/client_logo/clientlogo_tanpakoding.webp' },
  { id: 'tappp', name: 'TAPPP', src: '/images/client_logo/clientlogo_tappp.webp' },
  { id: 'telkom', name: 'Telkom Indonesia', src: '/images/client_logo/clientlogo_telkomindonesia.webp' },
  { id: 'uniqloop', name: 'Uniqloop', src: '/images/client_logo/clientlogo_uniqloop.webp' },
  { id: 'wzard', name: 'Wzard', src: '/images/client_logo/clientlogo_wzard.webp' },
];

function LogoDisplay({ logo }) {
  if (!logo) return null;

  return (
    <div className="flex items-center justify-center overflow-hidden h-full relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={logo.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center font-sans"
        >
          <img
            src={logo.src}
            alt={logo.name}
            className="w-20 h-20 md:w-32 md:h-32 max-w-[80%] max-h-[80%] object-contain grayscale dark:invert opacity-60 dark:opacity-40 select-none pointer-events-none"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function DynamicClientLogos() {
  const [activeLogos, setActiveLogos] = useState(() => {
    // Initial pick: 3 unique
    let picked = [];
    while (picked.length < 3) {
      let candidate = CLIENT_LOGOS[Math.floor(Math.random() * CLIENT_LOGOS.length)];
      if (!picked.some(p => p.id === candidate.id)) picked.push(candidate);
    }
    return picked;
  });

  const updateLogo = useCallback((colIndex) => {
    setActiveLogos(prev => {
      let newLogo;
      // Retry until unique against other columns
      do {
        newLogo = CLIENT_LOGOS[Math.floor(Math.random() * CLIENT_LOGOS.length)];
      } while (prev.some((logo, i) => i !== colIndex && logo.id === newLogo.id));

      const next = [...prev];
      next[colIndex] = newLogo;
      return next;
    });
  }, []);

  useEffect(() => {
    const intervals = [];
    const timeouts = [0, 1, 2].map(colIndex => {
      return setTimeout(() => {
        // Start interval for this column with staggered timing
        intervals.push(setInterval(() => updateLogo(colIndex), 3000));
      }, colIndex * 600); // 600ms stagger
    });

    return () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [updateLogo]);
  
  return (
    <div className="w-full border-t border-attio-border-light dark:border-attio-border-dark h-[80px] bg-[#FEFEFE] dark:bg-[#0A0A0B] select-none">
      <div className="grid grid-cols-3 w-full h-full divide-x divide-zinc-200 dark:divide-zinc-800">
        <LogoDisplay logo={activeLogos[0]} />
        <LogoDisplay logo={activeLogos[1]} />
        <LogoDisplay logo={activeLogos[2]} />
      </div>
    </div>
  );
}
