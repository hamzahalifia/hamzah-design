import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cursor } from './core/cursor';
import OptimizedImage from './OptimizedImage';

export default function RelatedStudies({ studies }) {
  if (!studies || studies.length === 0) return null;
  
  const [isCursorHovering, setIsCursorHovering] = useState(false);
  const displayStudies = studies.slice(0, 3);

  return (
    <section className="py-16 border-t border-neutral-200 dark:border-neutral-800">
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
          ease: "easeInOut",
          duration: 0.15,
        }}
      >
        <motion.div
          animate={{
            width: isCursorHovering ? 140 : 0,
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
                  Read Case Study
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </Cursor>

      <div className="px-4 sm:px-8 lg:px-16 xl:px-20">
        <h2 className="text-xl font-bold mb-8 text-neutral-900 dark:text-neutral-100">Related Case Studies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          {displayStudies.map((study) => (
            <Link
              key={study._id}
              to={`/work/${study.slug}`}
              className="group bg-white dark:bg-[#0A0A0B] hover:bg-neutral-50/40 dark:hover:bg-zinc-900/10 transition-colors flex flex-col justify-between h-full cursor-pointer"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full"
              >
                {/* Thumbnail */}
                <div
                  onMouseEnter={() => setIsCursorHovering(true)}
                  onMouseLeave={() => setIsCursorHovering(false)}
                  className="w-full aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-900 border-b border-zinc-150 dark:border-zinc-900/50"
                >
                  {study.heroImage ? (
                    <OptimizedImage
                      src={study.heroImage}
                      alt={study.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300 dark:text-neutral-600">
                      <Icon
                        icon="solar:gallery-linear"
                        className="w-8 h-8"
                      />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 p-6 flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 leading-snug group-hover:text-neutral-600 dark:group-hover:text-zinc-300 transition-colors">
                      {study.title}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3 font-sans">
                      {study.description}
                    </p>
                  </div>

                  {/* Footer details */}
                  <div className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono font-medium flex items-center gap-1.5 uppercase tracking-wider select-none">
                    <span>{study.year || "2024"}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
