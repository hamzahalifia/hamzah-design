import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import FooterReveal from "./FooterReveal";
import { useTheme } from "../context/ThemeContext";
import SkeletonLoader from "./ui/SkeletonLoader";
import PageMeta from "./SEO/PageMeta";
import { cmsFetch } from "../lib/cmsendpoint";
import OptimizedImage from "./OptimizedImage";
import { FlickeringGrid } from "./magicui/FlickeringGrid";
import { Cursor } from "./core/cursor";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

const ITEMS_PER_PAGE = 9;

export default function ResourcesPage() {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCursorHovering, setIsCursorHovering] = useState(false);

  // Filters State - Supporting Multiple Selections
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]); // array of slugs: string[]
  const [selectedPrices, setSelectedPrices] = useState([]); // array of 'free' | 'paid'
  const [currentPage, setCurrentPage] = useState(1);

  // Parse URL query parameter (e.g., /resources?type=ui-kit)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get("type");
    if (typeParam) {
      const types = typeParam.split(",").filter(Boolean);
      setSelectedTypes(types);
    }
  }, [location.search]);

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

  const categoriesWithCounts = useMemo(() => {
    return resourceTypes.map((type) => {
      const count = resources.filter((r) => r.type?.slug === type.slug).length;
      return { ...type, count };
    });
  }, [resourceTypes, resources]);

  const priceCounts = useMemo(() => {
    const free = resources.filter((r) => r.priceType === "free" || r.price === 0).length;
    const paid = resources.filter((r) => r.priceType === "paid" && r.price > 0).length;
    return { free, paid };
  }, [resources]);

  // Toggle Category Checkbox
  const toggleType = (slug) => {
    let next;
    if (selectedTypes.includes(slug)) {
      next = selectedTypes.filter((s) => s !== slug);
    } else {
      next = [...selectedTypes, slug];
    }
    setSelectedTypes(next);
    if (next.length > 0) {
      navigate(`/resources?type=${next.join(",")}`, { replace: true });
    } else {
      navigate("/resources", { replace: true });
    }
  };

  // Toggle Price Checkbox
  const togglePrice = (priceVal) => {
    if (selectedPrices.includes(priceVal)) {
      setSelectedPrices(selectedPrices.filter((p) => p !== priceVal));
    } else {
      setSelectedPrices([...selectedPrices, priceVal]);
    }
  };

  // Filter Logic
  const filteredResources = useMemo(() => {
    let result = [...resources];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.type?.name?.toLowerCase().includes(q) ||
          r.platform?.name?.toLowerCase().includes(q) ||
          (r.techStacks && r.techStacks.some((t) => t.name.toLowerCase().includes(q)))
      );
    }

    // Multiple Category Filter
    if (selectedTypes.length > 0) {
      result = result.filter((r) => r.type?.slug && selectedTypes.includes(r.type.slug));
    }

    // Multiple Price Filter (Free, Paid)
    if (selectedPrices.length > 0) {
      result = result.filter((r) => {
        const isFree = r.priceType === "free" || r.price === 0;
        const isPaid = r.priceType === "paid" && r.price > 0;
        return (
          (selectedPrices.includes("free") && isFree) ||
          (selectedPrices.includes("paid") && isPaid)
        );
      });
    }

    // Default newest sort
    result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return result;
  }, [resources, search, selectedTypes, selectedPrices]);

  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
  const paginated = filteredResources.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedTypes, selectedPrices]);

  const clearAllFilters = () => {
    setSearch("");
    setSelectedTypes([]);
    setSelectedPrices([]);
    navigate("/resources", { replace: true });
  };

  const activeFilterCount =
    (search ? 1 : 0) + selectedTypes.length + selectedPrices.length;

  return (
    <div className="bg-[#F2F0EB] dark:bg-[#080809] text-attio-text-primary-light dark:text-attio-text-primary-dark">
      <PageMeta
        title="Resources & Templates — Alifia Hamzah"
        description="Browse UI Kits, website templates, React components, and design assets by Alifia Hamzah."
        keywords="design resources marketplace, UI Kits, web templates, React components, Framer templates"
        canonical="https://hamzah.design/resources"
      />

      {/* Reactive Floating Cursor */}
      <Cursor
        variants={{
          initial: { scale: 0.3, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.3, opacity: 0 },
        }}
        springConfig={{ bounce: 0.001 }}
        transition={{ ease: "easeInOut", duration: 0.15 }}
      >
        <motion.div
          animate={{
            width: isCursorHovering ? 135 : 0,
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
                <span className="text-xs font-semibold text-white dark:text-black whitespace-nowrap font-sans">
                  View Resource
                </span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </Cursor>

      <main
        aria-label="Resources page content"
        className="relative z-10 bg-[#F2F0EB] dark:bg-[#080809] flex-1 border-b border-attio-border-light dark:border-attio-border-dark transition-colors duration-300"
      >
        <div className="max-w-[1440px] mx-auto px-0 lg:px-6">
          <div className="border-l-0 border-r-0 lg:border-l lg:border-r border-attio-border-light dark:border-attio-border-dark min-h-screen bg-[#FAF8F5] dark:bg-[#0A0A0B]">
            
            {/* Header Section with Flickering Grid */}
            <div className="relative px-5 py-8 border-b border-attio-border-light dark:border-attio-border-dark overflow-hidden">
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

              {/* Header Container - Full Width */}
              <div className="relative z-10 space-y-5 w-full">
                <div>
                  <h1 className="font-serif-attio text-[30px] sm:text-[36px] lg:text-[46px] leading-tight text-black dark:text-white">
                    Resources
                  </h1>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 font-sans">
                    Curated UI Kits, website templates, components, and design assets crafted for high-performance products.
                  </p>
                </div>

                {/* Search Bar - Full Width, Increased Height, No Sort */}
                <div className="relative w-full">
                  <Icon
                    icon="solar:magnifer-linear"
                    className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search resources, categories, tech stacks..."
                    className="w-full h-11 sm:h-12 pl-12 pr-11 rounded-lg bg-[#F2F2F2] dark:bg-neutral-900 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 border border-attio-border-light dark:border-attio-border-dark focus:border-neutral-400 dark:focus:border-neutral-600 outline-none transition-colors"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                    >
                      <Icon icon="solar:close-circle-linear" className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Active Filter Pills Bar (If Any Filters Selected) */}
            {activeFilterCount > 0 && (
              <div className="px-5 py-3 border-b border-attio-border-light dark:border-attio-border-dark bg-neutral-50/50 dark:bg-neutral-900/30 flex items-center flex-wrap gap-2 text-xs">
                <span className="text-neutral-500 font-medium mr-1">
                  Active Filters ({filteredResources.length} results):
                </span>

                {selectedTypes.map((slug) => {
                  const typeObj = resourceTypes.find((t) => t.slug === slug);
                  const name = typeObj ? typeObj.name : slug;
                  return (
                    <button
                      key={slug}
                      onClick={() => toggleType(slug)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-200 border border-neutral-300 text-neutral-800 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 shadow-sm cursor-pointer hover:bg-neutral-300 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <span>{name}</span>
                      <Icon icon="solar:close-linear" className="w-3.5 h-3.5" />
                    </button>
                  );
                })}

                {selectedPrices.map((priceKey) => (
                  <button
                    key={priceKey}
                    onClick={() => togglePrice(priceKey)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-200 border border-neutral-300 text-neutral-800 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 shadow-sm capitalize cursor-pointer hover:bg-neutral-300 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <span>Price: {priceKey}</span>
                    <Icon icon="solar:close-linear" className="w-3.5 h-3.5" />
                  </button>
                ))}

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-200 border border-neutral-300 text-neutral-800 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 shadow-sm cursor-pointer hover:bg-neutral-300 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <span>"{search}"</span>
                    <Icon icon="solar:close-linear" className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 ml-2 transition-colors cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Main Content Layout: Left Filter Sidebar + Right Collection Grid */}
            <div className="flex flex-col lg:flex-row items-stretch min-h-[calc(100vh-240px)]">
              {/* Left Sidebar Filter Panel - Full Height Right Border */}
              <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-attio-border-light dark:border-attio-border-dark p-5 space-y-6 flex-shrink-0 bg-[#FAF8F5] dark:bg-[#0A0A0B] self-stretch">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white tracking-widest uppercase">
                    Filters
                  </h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Multiple Checkbox Category Filter Group (Clean Borderless Row with p-1) */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest block p-1">
                    Category
                  </span>
                  <div className="space-y-1">
                    {categoriesWithCounts.map((type) => {
                      const isChecked = selectedTypes.includes(type.slug);
                      return (
                        <label
                          key={type.id}
                          onClick={() => toggleType(type.slug)}
                          className="w-full flex items-center justify-between p-1 rounded hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer select-none text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Checkbox box indicator */}
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center border transition-colors flex-shrink-0 ${
                                isChecked
                                  ? "bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-black"
                                  : "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                              }`}
                            >
                              {isChecked && (
                                <Icon icon="solar:check-read-linear" className="w-3 h-3 stroke-[3]" />
                              )}
                            </div>
                            <span className={`truncate font-sans ${isChecked ? "font-semibold text-neutral-900 dark:text-white" : "text-neutral-600 dark:text-neutral-400"}`}>
                              {type.name}
                            </span>
                          </div>

                          <span className="text-[11px] text-neutral-400 font-mono flex-shrink-0 pl-2">
                            {type.count}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Multiple Checkbox Price Filter Group (Clean Borderless Row with p-1) */}
                <div className="space-y-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest block p-1">
                    Price
                  </span>
                  <div className="space-y-1">
                    {[
                      { label: "Free", value: "free", count: priceCounts.free },
                      { label: "Paid", value: "paid", count: priceCounts.paid },
                    ].map((p) => {
                      const isChecked = selectedPrices.includes(p.value);
                      return (
                        <label
                          key={p.value}
                          onClick={() => togglePrice(p.value)}
                          className="w-full flex items-center justify-between p-1 rounded hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer select-none text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                                isChecked
                                  ? "bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-black"
                                  : "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                              }`}
                            >
                              {isChecked && (
                                <Icon icon="solar:check-read-linear" className="w-3 h-3 stroke-[3]" />
                              )}
                            </div>
                            <span className={`font-sans ${isChecked ? "font-semibold text-neutral-900 dark:text-white" : "text-neutral-600 dark:text-neutral-400"}`}>
                              {p.label}
                            </span>
                          </div>

                          <span className="text-[11px] text-neutral-400 font-mono flex-shrink-0 pl-2">
                            {p.count}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </aside>

              {/* Right Main Body Collection Grid */}
              <div className="flex-1 p-5 lg:p-6 min-w-0 space-y-6">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
                    <button
                      onClick={clearAllFilters}
                      className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white underline underline-offset-2 cursor-pointer"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {paginated.map((res) => (
                        <Link
                          key={res.id}
                          to={`/resources/${res.slug}`}
                          onMouseEnter={() => setIsCursorHovering(true)}
                          onMouseLeave={() => setIsCursorHovering(false)}
                          className="group block rounded-xl border border-attio-border-light dark:border-attio-border-dark bg-white dark:bg-[#0C0C0E] hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 overflow-hidden cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
                        >
                          <div>
                            {/* Clean Thumbnail Container */}
                            <div className="w-full aspect-[16/10] bg-neutral-100 dark:bg-neutral-900 relative overflow-hidden border-b border-attio-border-light dark:border-attio-border-dark">
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
                            </div>

                            {/* Card Content Details */}
                            <div className="p-5 space-y-2.5 text-left">
                              {/* Title on Left, Price on Right (Normal text, same font size as title) */}
                              <div className="flex items-start justify-between gap-3">
                                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-zinc-300 transition-colors leading-snug line-clamp-1 flex-1">
                                  {res.title}
                                </h3>
                                <span className="text-base font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap font-mono">
                                  {res.priceType === "free" ? "FREE" : `$${res.price}`}
                                </span>
                              </div>

                              {/* Description */}
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2 font-sans">
                                {res.description}
                              </p>

                              {/* Version Badge below description */}
                              {res.version && (
                                <div className="pt-0.5">
                                  <span className="px-2 py-0.5 text-[11px] font-mono font-medium rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60 inline-flex items-center">
                                    {res.version}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Card Footer: Compact Tech & Platform Logos */}
                          <div className="px-5 pb-5 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between min-h-[52px]">
                            {/* Platform Logo */}
                            <div className="flex items-center">
                              {res.platform?.logo ? (
                                <img
                                  src={res.platform.logo}
                                  alt={res.platform.name || "Platform"}
                                  title={res.platform.name || "Platform"}
                                  className="w-5 h-5 object-contain rounded-md"
                                />
                              ) : res.platform?.name ? (
                                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                  {res.platform.name}
                                </span>
                              ) : null}
                            </div>

                            {/* Tech Stacks */}
                            {res.techStacks && res.techStacks.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {res.techStacks.slice(0, 4).map((tech, idx) => (
                                  <div
                                    key={idx}
                                    title={tech.name}
                                    className="flex items-center justify-center p-1 rounded-md bg-neutral-100/90 dark:bg-neutral-800/90 border border-neutral-200/60 dark:border-neutral-700/60"
                                  >
                                    {tech.logo ? (
                                      <img
                                        src={tech.logo}
                                        alt={tech.name}
                                        className="w-4 h-4 object-contain"
                                      />
                                    ) : (
                                      <span className="px-1 text-[10px] font-mono font-medium text-neutral-600 dark:text-neutral-300">
                                        {tech.name}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="pt-6">
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
                                onClick={() =>
                                  setCurrentPage((p) => Math.min(totalPages, p + 1))
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
