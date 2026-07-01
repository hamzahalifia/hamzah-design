import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RollingText } from './magicui/RollingText';
import { GridPattern } from './magicui/GridPattern';
import ClosePopup from './ClosePopup';
import { Cursor } from './core/cursor';

export default function WorkShowcase() {
  const [selectedExploration, setSelectedExploration] = useState(null);
  const [works, setWorks] = useState([]);
  const [explorations, setExplorations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCursorHovering, setIsCursorHovering] = useState(false);
  const [cursorText, setCursorText] = useState('View Detail');
  const [showInfo, setShowInfo] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handlePrev = (e) => {
    e.stopPropagation();
    if (!selectedExploration || explorations.length === 0) return;
    const currentIndex = explorations.findIndex((exp) => exp.id === selectedExploration.id);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + explorations.length) % explorations.length;
      setSelectedExploration(explorations[prevIndex]);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (!selectedExploration || explorations.length === 0) return;
    const currentIndex = explorations.findIndex((exp) => exp.id === selectedExploration.id);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % explorations.length;
      setSelectedExploration(explorations[nextIndex]);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (!selectedExploration) return;
    const url = `${window.location.origin}/exploration?id=${selectedExploration.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };

  useEffect(() => {
    async function loadShowcaseData() {
      try {
        const [worksRes, explorationsRes] = await Promise.all([
          fetch('/api/works?highlighted=true'),
          fetch('/api/explorations?highlighted=true')
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
      {/* Cursor */}
      <Cursor
        variants={{
          initial: { scale: 0.3, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.3, opacity: 0 },
        }}
        springConfig={{
          bounce: 0.001,
        }}
        transition={{
          ease: 'easeInOut',
          duration: 0.15,
        }}
      >
        <motion.div
          animate={{
            width: isCursorHovering ? (cursorText === 'Read Case Study' ? 140 : 96) : 0,
            height: isCursorHovering ? 32 : 0,
            opacity: isCursorHovering ? 1 : 0,
            scale: isCursorHovering ? 1 : 0,
          }}
          className="flex items-center justify-center rounded-[24px] bg-gray-500/45 backdrop-blur-md dark:bg-gray-300/45 overflow-hidden"
        >
          <AnimatePresence>
            {isCursorHovering ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="inline-flex w-full items-center justify-center"
              >
                <div className="inline-flex items-center text-xs font-semibold text-white dark:text-black whitespace-nowrap font-sans">
                  {cursorText}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </Cursor>

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
              <div
                onMouseEnter={() => { setIsCursorHovering(true); setCursorText('Read Case Study'); }}
                onMouseLeave={() => setIsCursorHovering(false)}
                className="w-full md:w-[360px] h-[220px] md:h-[270px] rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex-shrink-0 relative border border-attio-border-light dark:border-attio-border-dark"
              >
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
                  onMouseEnter={() => { setIsCursorHovering(true); setCursorText('View Detail'); }}
                  onMouseLeave={() => setIsCursorHovering(false)}
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
                  {/* Hover overlay with title */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pointer-events-none">
                    <h4 className="text-sm font-semibold text-white leading-tight line-clamp-2">
                      {exp.title}
                    </h4>
                  </div>
                </motion.div>
              ))}
          </div>
          )}
        </div>
      </div>

      {/* Detail Popup — portaled to body */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedExploration && (
            <motion.div
              key="exploration-popup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] bg-[#09090b] flex flex-col justify-between text-white font-sans"
              style={{ backgroundColor: 'rgba(9, 9, 11, 0.98)' }}
            >
              
              {/* TOP BAR */}
              <div className="relative flex items-center justify-between px-6 py-4 border-b border-white/10 z-20">
                {/* Profile Pill */}
                <div className="flex items-center gap-2 select-none">
                  <img
                    src="/images/general/profilephoto.webp"
                    alt="Alifia Hamzah"
                    className="w-8 h-8 rounded-full object-cover border border-white/20"
                  />
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block">Alifia Hamzah</span>
                    <span className="text-[10px] text-neutral-400 block font-medium">Product Designer</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold tracking-tight text-neutral-200 hidden sm:block max-w-md truncate">
                  {selectedExploration.title}
                </h3>

                {/* Close Button */}
                <div className="relative w-10 h-10 select-none">
                  <div className="absolute top-12 right-0">
                    <ClosePopup onClose={() => { setSelectedExploration(null); setShowInfo(false); }} />
                  </div>
                </div>
              </div>

              {/* CENTER SECTION (Image + Navigation Arrows) */}
              <div className="relative flex-1 flex items-center justify-center p-4 min-h-0">
                {/* Prev Button */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 md:left-6 p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white cursor-pointer transition-all z-20 hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg"
                  title="Previous"
                >
                  <Icon icon="solar:alt-arrow-left-linear" className="w-6 h-6" />
                </button>

                 {/* Active Image Preview */}
                 <div className="w-full h-full flex items-center justify-center select-none p-2 relative">
                  <motion.img
                    key={selectedExploration.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    src={selectedExploration.image}
                    alt={selectedExploration.title}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/5"
                  />
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  className="absolute right-4 md:right-6 p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white cursor-pointer transition-all z-20 hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg"
                  title="Next"
                >
                  <Icon icon="solar:alt-arrow-right-linear" className="w-6 h-6" />
                </button>
              </div>

              {/* BOTTOM BAR (Thumbnails + Actions Dock) */}
              <div className="w-full flex flex-col items-center gap-4 py-6 border-t border-white/10 bg-[#09090b]/80 backdrop-blur z-20 relative">
                
                {/* Horizontal Scrollable Thumbnail Pagination */}
                <div 
                  className="w-full max-w-[85vw] md:max-w-[70vw] overflow-x-auto py-1"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <div className="flex justify-start md:justify-center items-center gap-2 mx-auto w-max px-4">
                    {explorations.map((exp) => {
                      const isActive = exp.id === selectedExploration.id;
                      return (
                        <button
                          key={exp.id}
                          onClick={(e) => { e.stopPropagation(); setSelectedExploration(exp); }}
                          className={`w-14 h-10 rounded-md overflow-hidden bg-neutral-800 border-2 transition-all flex-shrink-0 cursor-pointer ${
                            isActive ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-80'
                          }`}
                        >
                          <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Dock */}
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 select-none shadow-lg z-20">
                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center justify-center"
                    title="Copy Share Link"
                  >
                    <Icon icon="solar:share-linear" className="w-5 h-5" />
                  </button>

                  <div className="w-[1px] h-5 bg-white/10" />

                  {/* Info button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo); }}
                    className={`p-2 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                      showInfo 
                        ? 'bg-white text-[#09090b] hover:bg-neutral-200' 
                        : 'hover:bg-white/10 text-neutral-300 hover:text-white'
                    }`}
                    title="Toggle Info"
                  >
                    <Icon icon="solar:info-circle-linear" className="w-5 h-5" />
                  </button>
                </div>

                {/* Info Card - non-floating normal flex flow container */}
                <AnimatePresence>
                  {showInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="w-[92%] max-w-md bg-[#121215]/95 border border-white/10 rounded-2xl text-left shadow-2xl z-30 overflow-hidden font-sans"
                    >
                      <div className="p-5 space-y-3">
                        <div>
                          <h4 className="text-base font-semibold text-white leading-snug">
                            {selectedExploration.title}
                          </h4>
                          <p className="text-xs text-neutral-450 mt-2 leading-relaxed">
                            {selectedExploration.description}
                          </p>
                        </div>

                        {/* Keywords Tags */}
                        {selectedExploration.keywords && (
                          <div className="space-y-1.5 pt-1.5 border-t border-white/5">
                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">Keywords</span>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedExploration.keywords.split(',').map((kw, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-medium text-neutral-300 border border-white/5 hover:bg-white/10 transition-colors"
                                >
                                  {kw.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Toast Notification */}
              <AnimatePresence>
                {showToast && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-20 px-4 py-2 bg-neutral-900/90 border border-white/10 rounded-full text-xs font-semibold text-white shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200"
                  >
                    Copied link to clipboard!
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}