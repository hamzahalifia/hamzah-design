import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import FooterReveal from './FooterReveal';

const ITEMS_PER_PAGE = 6;

export default function WorkPage() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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
    const cats = new Set(works.map((w) => w.category).filter(Boolean));
    return [...cats].sort();
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
      <Navbar />

      <main className="relative z-10 bg-[#FAFAF9] dark:bg-[#080809] flex-1 border-b border-attio-border-light dark:border-attio-border-dark transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-0 lg:px-6">
          <div className="border-l-0 border-r-0 lg:border-l lg:border-r border-attio-border-light dark:border-attio-border-dark min-h-full bg-white dark:bg-[#0A0A0B]">

            <div className="w-full min-h-[1500px]">

              {/* Page Header */}
              <div className="px-5 py-5 border-b border-attio-border-light dark:border-attio-border-dark">
                <h1 className="font-serif-attio text-[30px] sm:text-[36px] lg:text-[46px] leading-tight text-[#111827] dark:text-white">
                  Work
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                  Case studies and projects I've worked on.
                </p>
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
                    {/* 2-Column grid — text below image */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {paginated.map((work) => (
                        <Link key={work.id} to={`/work/${work.slug}`} className="block group">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="rounded-xl overflow-hidden hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
                          >
                            {/* Thumbnail */}
                            <div className="w-full aspect-[16/10] rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-attio-border-light dark:border-attio-border-dark">
                              {work.heroImage ? (
                                work.heroImage.endsWith('.mp4') ? (
                                  <video src={work.heroImage} autoPlay loop muted playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
                                ) : (
                                  <img src={work.heroImage} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
                                )
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-300 dark:text-neutral-600">
                                  <Icon icon="solar:gallery-linear" className="w-8 h-8" />
                                </div>
                              )}
                            </div>

                            {/* Meta — below image */}
                            <div className="space-y-1.5 pt-3 px-1">
                              <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
                                {work.category && <span>{work.category}</span>}
                                {work.readingTime && (
                                  <>
                                    <span>·</span>
                                    <span>{work.readingTime}</span>
                                  </>
                                )}
                              </div>
                              <h3 className="text-base font-semibold text-[#111827] dark:text-neutral-100 leading-snug group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                                {work.title}
                              </h3>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
                                {work.desc}
                              </p>
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                    </div>

                    {/* FlyonUI-style Pagination */}
                    {totalPages > 1 && (
                      <nav className="flex items-center justify-center gap-x-1 pt-8 mt-8 border-t border-attio-border-light dark:border-attio-border-dark">
                        <button
                          type="button"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          Previous
                        </button>
                        <div className="flex items-center gap-x-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              type="button"
                              onClick={() => setCurrentPage(page)}
                              aria-current={page === currentPage ? 'page' : undefined}
                              className={`w-9 h-9 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                                page === currentPage
                                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-black'
                                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          Next
                        </button>
                      </nav>
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