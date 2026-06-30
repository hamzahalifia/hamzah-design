import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_CLIENT_LOGOS = [
  { id: 'amigos', name: 'Amigos', url: '/images/client_logo/clientlogo_amigos.webp' },
  { id: 'ampd', name: 'AMPD', url: '/images/client_logo/clientlogo_ampd.webp' },
  { id: 'arumaya', name: 'Arumaya', url: '/images/client_logo/clientlogo_arumaya.webp' },
  { id: 'kangamoon', name: 'Kangamoon', url: '/images/client_logo/clientlogo_kangamoon.webp' },
  { id: 'mtlab', name: 'MTLab', url: '/images/client_logo/clientlogo_mtlab.webp' },
  { id: 'nextiva', name: 'Nextiva', url: '/images/client_logo/clientlogo_nextiva.webp' },
  { id: 'oneev', name: 'OneEV', url: '/images/client_logo/clientlogo_oneev.webp' },
  { id: 'pertamina', name: 'Pertamina', url: '/images/client_logo/clientlogo_pertamina.webp' },
  { id: 'tanpakoding', name: 'Tanpakoding', url: '/images/client_logo/clientlogo_tanpakoding.webp' },
  { id: 'tappp', name: 'TAPPP', url: '/images/client_logo/clientlogo_tappp.webp' },
  { id: 'telkom', name: 'Telkom Indonesia', url: '/images/client_logo/clientlogo_telkomindonesia.webp' },
  { id: 'uniqloop', name: 'Uniqloop', url: '/images/client_logo/clientlogo_uniqloop.webp' },
  { id: 'wzard', name: 'Wzard', url: '/images/client_logo/clientlogo_wzard.webp' },
];

export default function DynamicClientLogos() {
  // Initialize with first 3 logos
  const [activeSlots, setActiveSlots] = useState(() => ALL_CLIENT_LOGOS.slice(0, 3));

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlots((prevSlots) => {
        // Pick a random slot index (0 to 2) to update
        const randomSlotIdx = Math.floor(Math.random() * 3);

        // Get currently active logo IDs
        const activeIds = new Set(prevSlots.map((logo) => logo.id));

        // Find available logos not currently displayed
        const availableLogos = ALL_CLIENT_LOGOS.filter((logo) => !activeIds.has(logo.id));

        if (availableLogos.length === 0) return prevSlots;

        // Pick a random new logo from available list
        const newLogo = availableLogos[Math.floor(Math.random() * availableLogos.length)];

        // Replace slot logo
        const updated = [...prevSlots];
        updated[randomSlotIdx] = newLogo;
        return updated;
      });
    }, 3500); // Change one random logo every 3.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full border-t border-attio-border-light dark:border-attio-border-dark grid grid-cols-3 divide-x divide-attio-border-light dark:divide-attio-border-dark items-center justify-between select-none h-[80px] bg-[#FEFEFE] dark:bg-[#0A0A0B]">
      {activeSlots.map((logo, idx) => (
        <div key={idx} className="px-2 sm:px-4 h-full flex items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={logo.url}
              src={logo.url}
              alt={logo.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.5, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="max-h-10 sm:max-h-12 w-full max-w-[85%] object-contain grayscale dark:invert transition-all duration-300 hover:opacity-100"
            />
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
