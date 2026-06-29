import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RollingText } from './magicui/RollingText';

const FEATURED_WORKS = [
  {
    id: 1,
    slug: "work-1",
    title: "Resolving a 40% Efficiency Loss in HR Timeshift Management",
    description: "In 2025, PT Neuronworks Indonesia suffered from fragmented manual shift permit tracking that cost productive work hours every month. Here is how we transformed the operational workflow with a story-data approach.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    slug: "work-2",
    title: "Story-Data Enterprise Dashboard Transformation.",
    description: "Streamlining real-time data visual hierarchy for multi-tier management reporting, reducing decision latency by 35%.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    slug: "work-3",
    title: "Scalable Design System & Component Infrastructure.",
    description: "Unifying design language across 12+ enterprise platforms with high-density component libraries and automated token sync.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
  },
];

const EXPLORATIONS = [
  {
    id: 1,
    title: "AI Prompt Flow Canvas",
    category: "Generative UI & Graph Nodes",
    description: "An experimental canvas interface designed for configuring complex multi-agent LLM chains visually with real-time token telemetry.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Dark Mode Data Widget Studio",
    category: "Design System & Components",
    description: "A high-density widget ecosystem tailored for enterprise financial risk monitors, featuring custom HSL monochromatic themes.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Spatial Analytics Control Room",
    category: "3D Visualizations & GIS",
    description: "Real-time spatial data rendering engine built for logistics dispatchers to monitor fleet telematics across global hubs.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    title: "Micro-Interaction Prototyping",
    category: "Motion & UI Engineering",
    description: "Exploration of spring physics-based gestures and tactile feedback components for high-frequency trading web terminals.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function WorkShowcase() {
  const [selectedExploration, setSelectedExploration] = useState(null);

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

        {/* Featured Work Flush Cards */}
        {FEATURED_WORKS.map((work) => (
          <Link key={work.id} to={`/work/${work.slug}`} className="block group">
            <motion.div
              initial={{ opacity: 0.9, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="p-5 lg:p-6 flex flex-col md:flex-row items-start justify-start gap-5 lg:gap-6 hover:bg-neutral-50/90 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
            >
              {/* Project Image Preview */}
              <div className="w-full md:w-[360px] h-[220px] md:h-[270px] rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex-shrink-0 relative">
                <motion.img
                  src={work.image}
                  alt={work.title}
                  loading="lazy"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                  className="w-full h-full object-cover transform-gpu will-change-transform pointer-events-auto"
                />
              </div>

              {/* Project Details */}
              <div className="flex-1 flex flex-col items-start justify-start space-y-2.5 pt-0.5">
                <h3 className="text-base font-semibold text-[#111827] dark:text-neutral-100 leading-snug group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                  {work.title}
                </h3>
                <p className="text-sm font-normal text-[#6B7280] dark:text-neutral-400 leading-relaxed">
                  {work.description}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {EXPLORATIONS.map((exp) => (
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
        </div>
      </div>

      {/* Large Detail Modal Popup for Exploration Items */}
      <AnimatePresence>
        {selectedExploration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExploration(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="relative z-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0A0A0B] border border-attio-border-light dark:border-attio-border-dark rounded-2xl shadow-2xl p-6 space-y-6"
            >
              {/* Modal Close Button */}
              <button
                onClick={() => setSelectedExploration(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <Icon icon="solar:close-square-linear" className="w-5 h-5" />
              </button>

              {/* Large Image Showcase */}
              <div className="w-full h-[300px] sm:h-[450px] rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative">
                <img
                  src={selectedExploration.image}
                  alt={selectedExploration.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Detail Content */}
              <div className="space-y-3 px-2">
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
