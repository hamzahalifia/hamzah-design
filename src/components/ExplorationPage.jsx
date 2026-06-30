import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import FooterReveal from './FooterReveal';
import { GridPattern } from './magicui/GridPattern';
import ClosePopup from './ClosePopup';

export default function ExplorationPage() {
  const [explorations, setExplorations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState(4);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch('/api/explorations');
        if (res.ok) {
          const data = await res.json();
          setExplorations(data);
        }
      } catch (err) {
        console.error('Failed to load explorations:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Responsive columns
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1280) setSelectedColumns(4);
      else if (w >= 768) setSelectedColumns(3);
      else setSelectedColumns(2);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#080809] text-attio-text-primary-light dark:text-attio-text-primary-dark flex flex-col justify-between">
      <Navbar />

      <main className="relative z-10 bg-[#FAFAF9] dark:bg-[#080809] flex-1 border-b border-attio-border-light dark:border-attio-border-dark transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-0 lg:px-6">
          <div className="border-l-0 border-r-0 lg:border-l lg:border-r border-attio-border-light dark:border-attio-border-dark min-h-full bg-white dark:bg-[#0A0A0B]">

            <div className="w-full min-h-[1500px]">

              {/* Page Header */}
              <div className="px-5 sm:px-5 lg:px-5 xl:px-5 pt-5 pb-5 border-b border-attio-border-light dark:border-attio-border-dark">
                <h1 className="font-serif-attio text-[30px] sm:text-[36px] lg:text-[46px] leading-tight text-[#111827] dark:text-white">
                  Exploration
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                  Visual design explorations and creative experiments.
                </p>
              </div>

              {/* Content */}
              <div className="px-5 sm:px-5 lg:px-5 xl:px-5 py-5">
                {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-2 text-neutral-400">
                    <Icon icon="svg-spinners:180-ring" className="w-6 h-6 text-neutral-500" />
                    <span className="text-xs">Loading...</span>
                  </div>
                ) : explorations.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-3 text-neutral-400">
                    <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-attio-border-light dark:border-attio-border-dark flex items-center justify-center">
                      <Icon icon="solar:gallery-linear" className="w-8 h-8 text-neutral-300 dark:text-neutral-600" />
                    </div>
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">No explorations yet.</p>
                  </div>
                ) : (
                  /* Instagram-style dense grid */
                  <div
                    className="grid gap-3"
                    style={{ gridTemplateColumns: `repeat(${selectedColumns}, 1fr)` }}
                  >
                    {explorations.map((exp) => (
                      <motion.div
                        key={exp.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        onClick={() => setSelectedItem(exp)}
                        className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-pointer border-0 hover:ring-2 hover:ring-neutral-200 dark:hover:ring-neutral-700 transition-all"
                      >
                        <img
                          src={exp.image}
                          alt={exp.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white/20 text-white uppercase tracking-wider">
                              {exp.category}
                            </span>
                            <h4 className="text-sm font-semibold text-white leading-tight line-clamp-2">
                              {exp.title}
                            </h4>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </main>

      <FooterReveal />

      {/* Detail Popup — portaled to body */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedItem && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 lg:p-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedItem(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-md"
              />
              <div className="relative z-10 max-w-4xl w-full mx-auto">
                <ClosePopup onClose={() => setSelectedItem(null)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="bg-white dark:bg-[#0A0A0B] border border-[#CDD1CD] dark:border-attio-border-dark rounded-2xl shadow-2xl overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 z-0 overflow-hidden [mask-image:radial-gradient(220px_circle_at_top_right,white,transparent)] pointer-events-none">
                    <GridPattern width={32} height={32} squares={[[10, 10]]} className="opacity-70 dark:opacity-40" />
                  </div>
                  <div className="relative z-10 max-h-[85vh] overflow-y-auto p-6 space-y-6">
                    <div className="w-full h-[300px] sm:h-[450px] rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative">
                      <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                          {selectedItem.category}
                        </span>
                      </div>
                      <h3 className="font-serif-attio text-3xl font-normal text-neutral-900 dark:text-white">
                        {selectedItem.title}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {selectedItem.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}