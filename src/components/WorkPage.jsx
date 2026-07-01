import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import FooterReveal from './FooterReveal';
import { FlickeringGrid } from './magicui/FlickeringGrid';
import { Cursor } from './core/cursor';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import PageMeta from './SEO/PageMeta';

const ITEMS_PER_PAGE = 6;

export default function WorkPage() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCursorHovering, setIsCursorHovering] = useState(false);

  useEffect(() => {
    async function fetchWorks() {
      setLoading(true);
      try {
        const res = await fetch('/api/works');
        if (res.ok) {
          const data = await res.json();
          setWorks(data);
        }
      } catch (err) {
        console.error('Failed to load works:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchWorks();
  }, []);

  const categories = useMemo(() => {
    const catCounts = {};
    works.forEach((w) => {
      if (w.category) {
        catCounts[w.category] = (catCounts[w.category] || 0) + 1;
      }
    });
    // Sort by count descending, then alphabetically
    return Object.entries(catCounts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 3) // Max 3 categories (plus "All" = 4 chips total)
      .map(([cat]) => cat);
  }, [works]);

  const filtered = useMemo(() => {
    let result = works;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((w) => w.title?.toLowerCase().includes(q));
    }
    if (categoryFilter) {
      result = result.filter((w) => w.category === categoryFilter);
    }
    return result;
  }, [works, search, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter]);

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#080809] text-attio-text-primary-light dark:text-attio-text-primary-dark flex flex-col justify-between">
      <PageMeta
        title="Work & Case Studies — Alifia Hamzah"
        description="Explore case studies and projects by Alifia Hamzah, Product Designer. Enterprise UX, data-driven design, and product strategy case studies."
        keywords="case studies, product design, UI/UX portfolio, enterprise design, Alifia Hamzah projects, design case studies"
        canonical="https://hamzah.design/work"
        schema={works.length > 0 ? {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Work & Case Studies by Alifia Hamzah",
          "description": "Explore case studies and projects by Alifia Hamzah, Product Designer.",
          "url": "https://hamzah.design/work",
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": works.map((w, idx) => ({
              "@type": "ListItem",
              "position": idx + 1,
              "url": `https://hamzah.design/work/${w.slug}`,
              "name": w.title
            }))
          }
        } : undefined}
      />
      <Navbar />

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

      <main className="relative z-10 bg-[#FAFAF9] dark:bg-[#080809] flex-1 border-b border-attio-border-light dark:border-attio-border-dark transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-0 lg:px-6">
          <div className="border-l-0 border-r-0 lg:border-l lg:border-r border-attio-border-light dark:border-attio-border-dark min-h-full bg-white dark:bg-[#0A0A0B]">

            <div className="w-full min-h-[1500px]">

              {/* Page Header */}
              <div className="relative px-5 py-8 border-b border-attio-border-light dark:border-attio-border-dark overflow-hidden">
                {/* Flickering Grid Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                  <FlickeringGrid
                    squareSize={4}
                    gridGap={6}
                    flickerChance={0.1}
                    color="#6B7280"
                    maxOpacity={0.12}
                    className="w-full h-full"
                    speed={0.02}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#0A0A0B] pointer-events-none" />
                </div>

                <div className="relative z-10 space-y-4">
                  <div>
                    <h1 className="font-serif-attio text-[30px] sm:text-[36px] lg:text-[46px] leading-tight text-[#111827] dark:text-white">
                      Work
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                      Case studies and projects I've worked on.
                    </p>
                  </div>

                  {/* Category Selector Pills */}
                  {works.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={() => setCategoryFilter('')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all duration-250 cursor-pointer ${
                          categoryFilter === ''
                            ? 'bg-neutral-200 border-neutral-300 text-neutral-800 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 shadow-sm'
                            : 'bg-white border-zinc-200 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50/50 dark:bg-[#0A0A0B] dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-neutral-900/50'
                        }`}
                      >
                        <span>All</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold leading-none ${
                          categoryFilter === ''
                            ? 'bg-neutral-300 text-neutral-700 dark:bg-zinc-600 dark:text-zinc-200'
                            : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-zinc-400'
                        }`}>
                          {works.length}
                        </span>
                      </button>

                      {categories.map((cat) => {
                        const count = works.filter((w) => w.category === cat).length;
                        const isSelected = categoryFilter === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all duration-250 cursor-pointer ${
                              isSelected
                                ? 'bg-neutral-200 border-neutral-300 text-neutral-800 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 shadow-sm'
                                : 'bg-white border-zinc-200 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50/50 dark:bg-[#0A0A0B] dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-neutral-900/50'
                            }`}
                          >
                            <span>{cat}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold leading-none ${
                              isSelected
                                ? 'bg-neutral-300 text-neutral-700 dark:bg-zinc-600 dark:text-zinc-200'
                                : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-zinc-400'
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="px-5 py-5">
                {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-2 text-neutral-400">
                    <Icon icon="svg-spinners:180-ring" className="w-6 h-6 text-neutral-500" />
                    <span className="text-xs">Loading...</span>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-3 text-neutral-400">
                    <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-attio-border-light dark:border-attio-border-dark flex items-center justify-center">
                      <Icon icon="solar:document-text-linear" className="w-8 h-8 text-neutral-300 dark:text-neutral-600" />
                    </div>
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      {search || categoryFilter ? 'No case studies match your filters.' : 'No case studies yet.'}
                    </p>
                    {search || categoryFilter ? (
                      <button
                        onClick={() => { setSearch(''); setCategoryFilter(''); }}
                        className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white underline underline-offset-2 cursor-pointer"
                      >
                        Clear filters
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <>
                    {/* 3-Column divided grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                      {paginated.map((work) => (
                        <Link key={work.id} to={`/work/${work.slug}`} className="group bg-white dark:bg-[#0A0A0B] hover:bg-neutral-50/40 dark:hover:bg-zinc-900/10 transition-colors flex flex-col justify-between h-full cursor-pointer">
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
                              {work.heroImage ? (
                                work.heroImage.endsWith('.mp4') ? (
                                  <video src={work.heroImage} autoPlay loop muted playsInline className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                                ) : (
                                  <img src={work.heroImage} alt={work.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                                )
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-300 dark:text-neutral-600">
                                  <Icon icon="solar:gallery-linear" className="w-8 h-8" />
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 p-6 flex flex-col justify-between space-y-4 text-left">
                              <div className="space-y-2">
                                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 leading-snug group-hover:text-neutral-600 dark:group-hover:text-zinc-300 transition-colors">
                                  {work.title}
                                </h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3 font-sans">
                                  {work.desc}
                                </p>
                              </div>

                              {/* Footer details */}
                              <div className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono font-medium flex items-center gap-1.5 uppercase tracking-wider select-none">
                                <span>{work.year || '2024'}</span>
                                {work.readingTime && (
                                  <>
                                    <span>•</span>
                                    <span>{work.readingTime}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                    </div>

                    {/* Shadcn UI Pagination */}
                    {totalPages >= 1 && (
                      <div className="pt-8 mt-8">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="cursor-pointer select-none"
                              />
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => setCurrentPage(page)}
                                  isActive={page === currentPage}
                                  className="cursor-pointer select-none"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            <PaginationItem>
                              <PaginationNext
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="cursor-pointer select-none"
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                )}
              </div>

            </div>

          </div>
        </div>
      </main>

      <FooterReveal />
    </div>
  );
}