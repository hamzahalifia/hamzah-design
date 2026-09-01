import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FooterReveal from "./FooterReveal";
import { useTheme } from "../context/ThemeContext";
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

const ITEMS_PER_PAGE = 8;

export default function ResourcesPage() {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedPriceFilter, setSelectedPriceFilter] = useState("all"); // 'all', 'free', 'paid'
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'price-low', 'price-high'
  const [currentPage, setCurrentPage] = useState(1);

  // Parse URL query parameter (e.g., /resources?type=ui-kit)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get("type");
    if (typeParam) {
      setSelectedType(typeParam);
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

  // Compute available platforms & tech stacks dynamically for filter panel
  const categoriesWithCounts = useMemo(() => {
    return resourceTypes.map((type) => {
      const count = resources.filter((r) => r.type?.slug === type.slug).length;
      return { ...type, count };
    });
  }, [resourceTypes, resources]);

  // Filter & Sort Logic
  const filteredAndSortedResources = useMemo(() => {
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

    // Category Type filter
    if (selectedType) {
      result = result.filter((r) => r.type?.slug === selectedType);
    }

    // Price filter
    if (selectedPriceFilter === "free") {
      result = result.filter((r) => r.priceType === "free" || r.price === 0);
    } else if (selectedPriceFilter === "paid") {
      result = result.filter((r) => r.priceType === "paid" && r.price > 0);
    }

    // Sort
    if (sortBy === "price-low") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return result;
  }, [resources, search, selectedType, selectedPriceFilter, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedResources.length / ITEMS_PER_PAGE);
  const paginated = filteredAndSortedResources.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedType, selectedPriceFilter, sortBy]);

  const clearAllFilters = () => {
    setSearch("");
    setSelectedType("");
    setSelectedPriceFilter("all");
    setSortBy("newest");
    navigate("/resources", { replace: true });
  };

  const activeFilterCount =
    (search ? 1 : 0) + (selectedType ? 1 : 0) + (selectedPriceFilter !== "all" ? 1 : 0);

  const selectedTypeName = useMemo(() => {
    if (!selectedType) return null;
    const match = resourceTypes.find((t) => t.slug === selectedType);
    return match ? match.name : selectedType;
  }, [selectedType, resourceTypes]);

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#080809] text-attio-text-primary-light dark:text-attio-text-primary-dark transition-colors duration-300">
      <PageMeta
        title="Resource Marketplace — Alifia Hamzah"
        description="Browse UI Kits, website templates, React components, and design assets by Alifia Hamzah."
        keywords="design resources marketplace, UI Kits, web templates, React components, Framer templates"
        canonical="https://hamzah.design/resources"
      />

      <main aria-label="Resource Marketplace" className="relative z-10 py-6">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          {/* Top Search Bar */}
          <div className="bg-white dark:bg-[#0A0A0B] border border-attio-border-light dark:border-attio-border-dark rounded-2xl p-4 mb-6 shadow-sm flex items-center justify-between gap-4">
            <div className="relative flex-1 flex items-center">
              <Icon
                icon="solar:magnifer-linear"
                className="w-5 h-5 text-neutral-400 absolute left-3.5"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, categories, tech stacks..."
                className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-neutral-100 dark:bg-[#121215] text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 outline-none transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  <Icon icon="solar:close-circle-linear" className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs font-semibold text-neutral-400 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-[#121215] text-xs font-semibold text-neutral-800 dark:text-neutral-200 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 outline-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          {activeFilterCount > 0 && (
            <div className="flex items-center flex-wrap gap-2 mb-6 px-1">
              <span className="text-xs text-neutral-500 font-medium mr-1">
                Active Filters ({filteredAndSortedResources.length} results):
              </span>

              {selectedType && (
                <button
                  onClick={() => {
                    setSelectedType("");
                    navigate("/resources", { replace: true });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-black shadow-sm"
                >
                  <span>{selectedTypeName}</span>
                  <Icon icon="solar:close-linear" className="w-3.5 h-3.5" />
                </button>
              )}

              {selectedPriceFilter !== "all" && (
                <button
                  onClick={() => setSelectedPriceFilter("all")}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-black shadow-sm capitalize"
                >
                  <span>Price: {selectedPriceFilter}</span>
                  <Icon icon="solar:close-linear" className="w-3.5 h-3.5" />
                </button>
              )}

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-black shadow-sm"
                >
                  <span>"{search}"</span>
                  <Icon icon="solar:close-linear" className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white underline underline-offset-2 ml-2 cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* E-Commerce Grid Layout: Left Sidebar + Body Grid */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filter Panel (Left) */}
            <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
              <div className="bg-white dark:bg-[#0A0A0B] border border-attio-border-light dark:border-attio-border-dark rounded-2xl p-5 shadow-sm space-y-6 sticky top-20">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white tracking-wide uppercase">
                    Filters
                  </h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Category Filter Group */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">
                    Category
                  </span>
                  <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                    <button
                      onClick={() => {
                        setSelectedType("");
                        navigate("/resources", { replace: true });
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        selectedType === ""
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold"
                          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                      }`}
                    >
                      <span>All Categories</span>
                      <span className="font-mono text-[10px] opacity-75">{resources.length}</span>
                    </button>

                    {categoriesWithCounts.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setSelectedType(type.slug);
                          navigate(`/resources?type=${type.slug}`, { replace: true });
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          selectedType === type.slug
                            ? "bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold"
                            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                        }`}
                      >
                        <span className="truncate">{type.name}</span>
                        <span className="font-mono text-[10px] opacity-75">{type.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter Group */}
                <div className="space-y-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">
                    Price
                  </span>
                  <div className="flex flex-col gap-1">
                    {[
                      { label: "All Prices", value: "all" },
                      { label: "Free Only", value: "free" },
                      { label: "Paid Only", value: "paid" },
                    ].map((p) => (
                      <button
                        key={p.value}
                        onClick={() => setSelectedPriceFilter(p.value)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          selectedPriceFilter === p.value
                            ? "bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold"
                            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                        }`}
                      >
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Product Collection Grid Body */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                    <SkeletonLoader key={i} className="h-[340px] rounded-2xl" />
                  ))}
                </div>
              ) : filteredAndSortedResources.length === 0 ? (
                <div className="bg-white dark:bg-[#0A0A0B] border border-attio-border-light dark:border-attio-border-dark rounded-2xl p-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
                    <Icon icon="solar:box-minimalistic-linear" className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    No resources found
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Try adjusting your search terms or clearing your filter selections.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Grid Cards Collection (UI8 Style) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginated.map((res) => (
                      <Link
                        key={res.id}
                        to={`/resources/${res.slug}`}
                        className="group block rounded-2xl border border-attio-border-light dark:border-attio-border-dark bg-white dark:bg-[#0C0C0E] hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 overflow-hidden cursor-pointer shadow-sm hover:shadow-xl flex flex-col justify-between"
                      >
                        <div>
                          {/* Image Container with Version Badge */}
                          <div className="w-full aspect-[16/10] bg-neutral-100 dark:bg-neutral-900 relative overflow-hidden border-b border-neutral-100 dark:border-neutral-800">
                            {res.image ? (
                              <OptimizedImage
                                src={res.image}
                                alt={res.title}
                                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                <Icon icon="solar:box-minimalistic-linear" className="w-8 h-8" />
                              </div>
                            )}

                            {/* Top Badges */}
                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                              {res.version ? (
                                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-black/80 text-white dark:bg-white/80 dark:text-black backdrop-blur-md">
                                  {res.version}
                                </span>
                              ) : <span />}

                              <span
                                className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full font-mono border backdrop-blur-md ${
                                  res.priceType === "free"
                                    ? "bg-emerald-500 text-white border-emerald-400"
                                    : "bg-black/90 text-white dark:bg-white/90 dark:text-black border-neutral-700 dark:border-neutral-200"
                                }`}
                              >
                                {res.priceType === "free" ? "FREE" : `$${res.price}`}
                              </span>
                            </div>
                          </div>

                          {/* Card Information Header */}
                          <div className="p-5 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors leading-snug line-clamp-1">
                                {res.title}
                              </h3>
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
                              {res.description}
                            </p>
                          </div>
                        </div>

                        {/* Card Footer: Platform & Tech Stack Icons */}
                        <div className="px-5 pb-5 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500">
                          {res.platform?.name ? (
                            <div className="flex items-center gap-1.5 font-semibold text-neutral-800 dark:text-neutral-200">
                              {res.platform.logo && (
                                <img
                                  src={res.platform.logo}
                                  alt={res.platform.name}
                                  className="w-4 h-4 object-contain"
                                />
                              )}
                              <span>{res.platform.name}</span>
                            </div>
                          ) : <span />}

                          {res.techStacks && res.techStacks.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap">
                              {res.techStacks.slice(0, 3).map((tech, idx) => (
                                <span
                                  key={idx}
                                  className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/50 dark:border-neutral-700/50"
                                >
                                  {tech.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pt-10 mt-6">
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
      </main>

      <FooterReveal />
    </div>
  );
}
