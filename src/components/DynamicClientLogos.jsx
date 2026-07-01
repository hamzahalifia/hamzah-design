import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CLIENT_LOGOS = [
  { id: 'amigos', name: 'Amigos', src: '/images/client_logo/clientlogo_amigos.webp' },
  { id: 'ampd', name: 'AMPD', src: '/images/client_logo/clientlogo_ampd.webp' },
  { id: 'arumaya', name: 'Arumaya', src: '/images/client_logo/clientlogo_arumaya.webp' },
  { id: 'door', name: 'Door', src: '/images/client_logo/clientlogo_door.svg' },
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

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function LogoColumn({ columnIndex }) {
  const [logos] = useState(() => shuffleArray(CLIENT_LOGOS));
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Cycle with staggered delay per column
    const baseDelay = columnIndex * 600;
    const intervalDuration = 3000;

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % logos.length);
      }, intervalDuration);

      return () => clearInterval(interval);
    }, baseDelay);

    return () => clearTimeout(timeout);
  }, [columnIndex, logos.length]);

  const currentLogo = logos[currentIndex];

  if (!currentLogo) return null;

  return (
    <div className="flex items-center justify-center overflow-hidden h-full relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentIndex}-${currentLogo.id}`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center font-sans"
        >
          <img
            src={currentLogo.src}
            alt={currentLogo.name}
            className="w-20 h-20 md:w-32 md:h-32 max-w-[80%] max-h-[80%] object-contain grayscale dark:invert opacity-60 dark:opacity-40 hover:opacity-100 hover:grayscale-0 dark:hover:invert-0 transition-all duration-300 cursor-default select-none"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function DynamicClientLogos() {
  return (
    <div className="w-full border-t border-attio-border-light dark:border-attio-border-dark h-[80px] bg-[#FEFEFE] dark:bg-[#0A0A0B] select-none">
      <div className="grid grid-cols-3 w-full h-full divide-x divide-zinc-200 dark:divide-zinc-800">
        <LogoColumn columnIndex={0} />
        <LogoColumn columnIndex={1} />
        <LogoColumn columnIndex={2} />
      </div>
    </div>
  );
}