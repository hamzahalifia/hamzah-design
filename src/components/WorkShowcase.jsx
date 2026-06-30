import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RollingText } from './magicui/RollingText';
import { GridPattern } from './magicui/GridPattern';
import ClosePopup from './ClosePopup';

export default function WorkShowcase() {
  const [selectedExploration, setSelectedExploration] = useState(null);
  const [works, setWorks] = useState([]);
  const [explorations, setExplorations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShowcaseData() {
      try {
        const [worksRes, explorationsRes] = await Promise.all([
          fetch('/api/works'),
          fetch('/api/explorations')
        ]);
        if (worksRes.ok && explorationsRes.ok) {
          const worksData = await worksRes.json();
          const explorationsData = await explorationsRes.json();
          setWorks(worksData);
          setExplorations(explorationsData);
        }
      } catch (err) {
        console.error("Gagal memuat data showcase:", err);
      } finally {
        setLoading(false);
      }
    }
    loadShowcaseData();
  }, []);

  return (
    <section className="flex-1 bg-white dark:bg-[#0A0A0B] divide-y divide-attio-border-light dark:divide-attio-border-dark">
      {/* Featured Work Container */}
      <div id="work" className="divide-y divide-attio-border-light dark:divide-attio-border-dark">
        {/* Section Header with Refined Smaller Heading (text-lg) */}
        <div className="p-5 lg:p-6 flex items-center justify-between bg-attio-bg-light dark:bg-[#0A0A0B]">
          <h2 className="font-sans text-lg font-semibold tracking-tight text-attio-text-primary-light dark:text-attio-text-primary-dark">
            Featured Work
          </h2>
          <Link
            to="/work"
            className="inline-flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-full border border-attio-border-light dark:border-attio-border-dark bg-[#F2F2F2] dark:bg-neutral-800 text-[#545454] dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all btn-attio-secondary cursor-pointer"
          >
            <RollingText>More</RollingText>
            <Icon icon="solar:arrow-right-up-linear" className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center gap-2 text-neutral-400">
            <Icon icon="svg-spinners:180-ring" className="w-6 h-6 text-neutral-500" />
            <span className="text-xs">Memuat karya...</span>
          </div>
        )}

        {/* Featured Work Flush Cards */}
        {!loading && works.map((work) => (
          <Link key={work.id} to={`/work/${work.slug}`} className="block group">
            <motion.div
              initial={{ opacity: 0.9, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="p-5 lg:p-6 flex flex-col md:flex-row items-start justify-start gap-5 lg:gap-6 hover:bg-neutral-50/90 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
            >
              {/* Project Image Preview */}
              <div className="w-full md:w-[360px] h-[220px] md:h-[270px] rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex-shrink-0 relative border border-attio-border-light dark:border-attio-border-dark">
                {work.heroImage && (work.heroImage.endsWith('.mp4') || work.heroImage.toLowerCase().includes('.mp4')) ? (
                  <video
                    src={work.heroImage}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04] pointer-events-auto"
                  />
                ) : (
                  <motion.img
                    src={work.heroImage}
                    alt={work.title}
                    loading="lazy"
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                    className="w-full h-full object-cover transform-gpu will-change-transform pointer-events-auto"
                  />
                )}
              </div>

              {/* Project Details */}
              <div className="flex-1 flex flex-col items-start justify-start space-y-2.5 pt-0.5">
                <h3 className="text-base font-semibold text-[#111827] dark:text-neutral-100 leading-snug group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                  {work.title}
                </h3>
                <p className="text-sm font-normal text-[#6B7280] dark:text-neutral-400 leading-relaxed">
                  {work.desc}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Exploration Container (No Bottom Border) */}
      <div id="exploration" className="divide-y divide-attio-border-light dark:divide-attio-border-dark">
        {/* Section Header with Refined Smaller Heading (text-lg) */}
        <div className="p-5 lg:p-6 flex items-center justify-between bg-attio-bg-light dark:bg-[#0A0A0B]">
          <h2 className="font-sans text-lg font-semibold tracking-tight text-attio-text-primary-light dark:text-attio-text-primary-dark">
            Exploration
          </h2>
          <Link
            to="/exploration"
            className="inline-flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-full border border-attio-border-light dark:border-attio-border-dark bg-[#F2F2F2] dark:bg-neutral-800 text-[#545454] dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all btn-attio-secondary cursor-pointer"
          >
            <RollingText>More</RollingText>
            <Icon icon="solar:arrow-right-up-linear" className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        {/* 2x2 Grid Seamless Cards */}
        <div className="p-5 lg:p-6">
          {loading && (
            <div className="py-20 flex flex-col items-center justify-center gap-2 text-neutral-400">
              <Icon icon="svg-spinners:180-ring" className="w-6 h-6 text-neutral-500" />
              <span className="text-xs">Memuat eksplorasi...</span>
            </div>
          )}
          
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {explorations.map((exp) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0.9 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  onClick={() => setSelectedExploration(exp)}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="group rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900 cursor-pointer h-[230px] relative"
              >
                <motion.img
                  src={exp.image}
                  alt={exp.title}
                  loading="lazy"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                  className="w-full h-full object-cover transform-gpu will-change-transform"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/90 text-xs font-semibold shadow-attio-sm">
                    View Detail
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </div>

      {/* Large Detail Modal Popup for Exploration Items — portaled to body to avoid z-index issues */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedExploration && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 lg:p-10">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedExploration(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-md"
              />

              {/* Card Wrapper (relative for ClosePopup sibling) */}
              <div className="relative z-10 max-w-4xl w-full mx-auto">
                <ClosePopup onClose={() => setSelectedExploration(null)} />

                {/* Modal Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  className="bg-white dark:bg-[#0A0A0B] border border-[#CDD1CD] dark:border-attio-border-dark rounded-2xl shadow-2xl overflow-hidden"
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

                  {/* Scrollable Content Area */}
                  <div className="relative z-10 max-h-[85vh] overflow-y-auto p-6 space-y-6">
                    {/* Large Image Showcase */}
                    <div className="w-full h-[300px] sm:h-[450px] rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative">
                      <img
                        src={selectedExploration.image}
                        alt={selectedExploration.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Detail Content */}
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                          {selectedExploration.category}
                        </span>
                      </div>
                      <h3 className="font-serif-attio text-3xl font-normal text-neutral-900 dark:text-white">
                        {selectedExploration.title}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {selectedExploration.description}
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
    </section>
  );
}