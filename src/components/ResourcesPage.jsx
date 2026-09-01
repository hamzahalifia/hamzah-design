import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FooterReveal from "./FooterReveal";
import { useTheme } from "../context/ThemeContext";
import { FlickeringGrid } from "./magicui/FlickeringGrid";
import SkeletonLoader from "./ui/SkeletonLoader";
import PageMeta from "./SEO/PageMeta";
import { cmsFetch } from "../lib/cmsendpoint";
import OptimizedImage from "./OptimizedImage";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

const ITEMS_PER_PAGE = 6;

export default function ResourcesPage() {
  const { theme } = useTheme();
  const [resources, setResources] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTypeSlug, setSelectedTypeSlug] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [resData, typesData] = await Promise.all([
          cmsFetch({ type: "resources" }),
          cmsFetch({ type: "resource-types" }),
        ]);
        setResources(resData || []);
        setResourceTypes(typesData || []);
      } catch (err) {
        console.error("Failed to load resources:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredResources = useMemo(() => {
    let result = resources;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q)
      );
    }
    if (selectedTypeSlug) {
      result = result.filter((r) => r.type?.slug === selectedTypeSlug);
    }
    return result;
  }, [resources, search, selectedTypeSlug]);

  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
  const paginated = filteredResources.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedTypeSlug]);

  return (
    <div className="bg-[#FAFAF9] dark:bg-[#080809] text-attio-text-primary-light dark:text-attio-text-primary-dark">
      <PageMeta
        title="Resources & Templates — Alifia Hamzah"
        description="Explore design systems, website templates, UI Kits, and React components built by Alifia Hamzah."
        keywords="design resources, UI kit, Next.js template, React component, Framer template, Alifia Hamzah resources"
        canonical="https://hamzah.design/resources"
      />

      <main
        aria-label="Resources page content"
        className="relative z-10 bg-[#FAFAF9] dark:bg-[#080809] flex-1 border-b border-attio-border-light dark:border-attio-border-dark transition-colors duration-300"
      >
        <div className="max-w-[1440px] mx-auto px-0 lg:px-6">
          <div className="border-l-0 border-r-0 lg:border-l lg:border-r border-attio-border-light dark:border-attio-border-dark bg-white dark:bg-[#0A0A0B]">
            <div className="w-full">
              {/* Page Header */}
              <div className="relative px-5 py-8 border-b border-attio-border-light dark:border-attio-border-dark overflow-hidden">
                {/* Flickering Grid Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                  <FlickeringGrid
                    squareSize={4}
                    gridGap={6}
                    flickerChance={0.1}
                    color={theme === "dark" ? "#FFFFFF" : "#6B7280"}
                    maxOpacity={theme === "dark" ? 0.15 : 0.12}
                    className="w-full h-full"
                    speed={0.02}
                    align="right"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#0A0A0B] pointer-events-none" />
                </div>

                <div className="relative z-10 space-y-4">
                  <div>
                    <h1 className="font-serif-attio text-[30px] sm:text-[36px] lg:text-[46px] leading-tight text-black dark:text-white">
                      Resources
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                      Design systems, website templates, UI Kits, and components.
                    </p>
                  </div>

                  {/* Filter Tabs */}
                  {resourceTypes.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={() => setSelectedTypeSlug("")}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all duration-250 cursor-pointer ${
                          selectedTypeSlug === ""
                            ? "bg-neutral-200 border-neutral-300 text-neutral-800 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 shadow-sm"
                            : "bg-white border-zinc-200 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50/50 dark:bg-[#0A0A0B] dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-neutral-900/50"
                        }`}
                      >
                        <span>All</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold leading-none ${
                            selectedTypeSlug === ""
                              ? "bg-neutral-300 text-neutral-700 dark:bg-zinc-600 dark:text-zinc-200"
                              : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-zinc-400"
                          }`}
                        >
                          {resources.length}
                        </span>
                      </button>

                      {resourceTypes.map((type) => {
                        const count = resources.filter(
                          (r) => r.type?.slug === type.slug
                        ).length;
                        const isSelected = selectedTypeSlug === type.slug;
                        return (
                          <button
                            key={type.id}
                            onClick={() => setSelectedTypeSlug(type.slug)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all duration-250 cursor-pointer ${
                              isSelected
                                ? "bg-neutral-200 border-neutral-300 text-neutral-800 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 shadow-sm"
                                : "bg-white border-zinc-200 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50/50 dark:bg-[#0A0A0B] dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-neutral-900/50"
                            }`}
                          >
                            <span>{type.name}</span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold leading-none ${
                                isSelected
                                  ? "bg-neutral-300 text-neutral-700 dark:bg-zinc-600 dark:text-zinc-200"
                                  : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-zinc-400"
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Content Grid */}
              <div className="px-5 py-6">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                      <SkeletonLoader key={i} className="h-[320px] rounded-xl" />
                    ))}
                  </div>
                ) : filteredResources.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-3 text-neutral-400">
                    <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-attio-border-light dark:border-attio-border-dark flex items-center justify-center">
                      <Icon
                        icon="solar:box-minimalistic-linear"
                        className="w-8 h-8 text-neutral-300 dark:text-neutral-600"
                      />
                    </div>
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      No resources match your filters.
                    </p>
                    {search || selectedTypeSlug ? (
                      <button
                        onClick={() => {
                          setSearch("");
                          setSelectedTypeSlug("");
                        }}
                        className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white underline underline-offset-2 cursor-pointer"
                      >
                        Clear filters
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {paginated.map((res) => (
                        <Link
                          key={res.id}
                          to={`/resources/${res.slug}`}
                          className="group block rounded-xl border border-attio-border-light dark:border-attio-border-dark bg-white dark:bg-[#0C0C0E] hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 overflow-hidden cursor-pointer shadow-sm hover:shadow-md"
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-4 flex flex-col h-full space-y-3"
                          >
                            {/* Thumbnail */}
                            <div className="w-full aspect-[16/10] rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900 relative border border-attio-border-light dark:border-attio-border-dark">
                              {res.image ? (
                                <OptimizedImage
                                  src={res.image}
                                  alt={res.title}
                                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                  <Icon icon="solar:box-minimalistic-linear" className="w-8 h-8" />
                                </div>
                              )}

                              {/* Top Badges */}
                              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                                {res.type?.name ? (
                                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700/80 backdrop-blur-md">
                                    {res.type.name}
                                  </span>
                                ) : <span />}

                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full font-mono border backdrop-blur-md ${
                                  res.priceType === 'free'
                                    ? 'bg-emerald-500/90 text-white border-emerald-400'
                                    : 'bg-black/90 text-white dark:bg-white/90 dark:text-black border-neutral-700 dark:border-neutral-200'
                                }`}>
                                  {res.priceType === 'free' ? 'FREE' : `$${res.price}`}
                                </span>
                              </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col justify-between space-y-3 pt-1">
                              <div className="space-y-1">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors leading-snug line-clamp-1">
                                    {res.title}
                                  </h3>
                                  {res.version && (
                                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-700/60 flex-shrink-0">
                                      {res.version}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
                                  {res.description}
                                </p>
                              </div>

                              {/* Footer details */}
                              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-500 dark:text-neutral-400">
                                {res.platform?.name ? (
                                  <div className="flex items-center gap-1.5 font-medium">
                                    {res.platform.logo && (
                                      <img src={res.platform.logo} alt={res.platform.name} className="w-3.5 h-3.5 object-contain" />
                                    )}
                                    <span>{res.platform.name}</span>
                                  </div>
                                ) : <span />}

                                {res.techStacks && res.techStacks.length > 0 && (
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {res.techStacks.slice(0, 3).map((tech, idx) => (
                                      <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/50 dark:border-neutral-700/50">
                                        {tech.name}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="pt-8 mt-4">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={() =>
                                  setCurrentPage((p) => Math.max(1, p - 1))
                                }
                                disabled={currentPage === 1}
                                className="cursor-pointer select-none"
                              />
                            </PaginationItem>
                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1
                            ).map((page) => (
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
                                onClick={() =>
                                  setCurrentPage((p) =>
                                    Math.min(totalPages, p + 1)
                                  )
                                }
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
