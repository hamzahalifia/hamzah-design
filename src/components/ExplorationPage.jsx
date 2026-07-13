import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
import Navbar from "./Navbar";
import FooterReveal from "./FooterReveal";
import { useTheme } from "../context/ThemeContext";
import { GridPattern } from "./magicui/GridPattern";
import ClosePopup from "./ClosePopup";
import { FlickeringGrid } from "./magicui/FlickeringGrid";
import { Cursor } from "./core/cursor";
import SkeletonLoader from "./ui/SkeletonLoader";
import ReactPlayer from "react-player";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import PageMeta from "./SEO/PageMeta";
import { cmsFetch } from "../lib/cmsendpoint";

/* Seeded random based on a single numeric seed */
/* Seeded random based on a single numeric seed */
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/* Fisher-Yates shuffle with seed */
function shuffleArray(arr, seed) {
  const shuffled = [...arr];
  let currentSeed = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomVal = seededRandom(currentSeed);
    currentSeed += 1;
    const j = Math.floor(randomVal * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/* Get unique seed for the current day */
function getDailySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

/* Layout-filling algorithm: prioritize filling gaps */
function fillLayout(explorations) {
  const seed = getDailySeed();
  const shuffled = shuffleArray(explorations, seed);
  const result = [];
  const used = new Set();

  for (const item of shuffled) {
    if (!used.has(item.id)) {
      result.push(item);
      used.add(item.id);
    }
  }
  return result;
}

/* Media preview component: renders video or image based on mediaType */
function MediaPreview({ item, className = "" }) {
  if (item.mediaType === "video" && item.videoEmbedUrl) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
      >
        <ReactPlayer
          url={item.videoEmbedUrl}
          width="100%"
          height="100%"
          controls
          playing={false}
          className="rounded-lg shadow-2xl border border-white/5 overflow-hidden"
        />
      </div>
    );
  }

  if (item.mediaType === "video" && item.videoFile) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
      >
        <video
          src={item.videoFile}
          controls
          playsInline
          preload="metadata"
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/5"
        />
      </div>
    );
  }

  // Default: image
  return (
    <motion.img
      key={item.id}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      src={item.image}
      alt={item.title}
      className={`max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/5 ${className}`}
    />
  );
}

function ExplorationCard({ exp, isHovering, onHoverChange, targetRef }) {
  let itemClasses = "col-span-1 row-span-1 aspect-square";
  if (exp.aspect_ratio === "16:9") {
    // 16:9 spans 2 columns but matches 1:1 height
    itemClasses = "col-span-1 sm:col-span-2 row-span-1";
    itemClasses += " aspect-[16/9] sm:aspect-[16/9]";
    itemClasses += " sm:h-full";
  } else if (exp.aspect_ratio === "9:16") {
    // 9:16 spans 1 column, 2 rows to fill downward
    itemClasses = "col-span-1 row-span-1 sm:row-span-2";
    itemClasses += " aspect-[9/16] sm:aspect-[9/16]";
    itemClasses += " sm:h-full";
  } else {
    // 1:1
    itemClasses += " sm:h-full";
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onClick={() => onHoverChange(null, exp)}
      className={`group relative rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-pointer border-0 hover:ring-2 hover:ring-neutral-200 dark:hover:ring-neutral-700 transition-all ${itemClasses}`}
    >
      <div
        ref={
          exp.aspect_ratio === "16:9" || exp.aspect_ratio === "9:16"
            ? targetRef
            : null
        }
        className="w-full h-full"
      >
        <img
          src={exp.image}
          alt={exp.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pointer-events-none">
        <h4 className="text-sm font-semibold text-white leading-tight line-clamp-2">
          {exp.title}
        </h4>
      </div>
    </motion.div>
  );
}

export default function ExplorationPage() {
  const { theme } = useTheme();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [explorations, setExplorations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  // Cursor state
  const [isCursorHovering, setIsCursorHovering] = useState(false);

  const handleCardClick = useCallback((e, exp) => {
    if (e) e.stopPropagation();
    setSelectedItem(exp);
  }, []);

  // Lock body scroll when popup is visible
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedItem]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await cmsFetch({ type: "explorations" });
        if (data) {
          setExplorations(data);

          // Auto open modal if slug is present in URL
          if (slug) {
            const matchedItem = data.find((item) => item.slug === slug);
            if (matchedItem) {
              setSelectedItem(matchedItem);
            } else {
              // Slug not found, maybe redirect to base exploration page
              navigate("/exploration", { replace: true });
            }
          }
        }
      } catch (err) {
        console.error("Failed to load explorations:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug, navigate]);

  const currentIndex = useMemo(() => {
    return explorations.findIndex((item) => item.id === selectedItem?.id);
  }, [explorations, selectedItem]);

  const handlePrev = (e) => {
    e.stopPropagation();
    if (explorations.length === 0) return;
    const prevIndex =
      (currentIndex - 1 + explorations.length) % explorations.length;
    setSelectedItem(explorations[prevIndex]);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (explorations.length === 0) return;
    const nextIndex = (currentIndex + 1) % explorations.length;
    setSelectedItem(explorations[nextIndex]);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (!selectedItem) return;
    const url = `${window.location.origin}/exploration/${selectedItem.slug}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch((err) => {
        toast.error("Failed to copy link");
        console.error("Failed to copy: ", err);
      });
  };

  const ITEMS_PER_PAGE = 12;

  // Apply layout-filling shuffle
  const layoutExplorations = useMemo(() => {
    return fillLayout(explorations);
  }, [explorations]);

  const totalPages = Math.ceil(layoutExplorations.length / ITEMS_PER_PAGE);
  const paginatedExplorations = useMemo(() => {
    return layoutExplorations.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );
  }, [layoutExplorations, currentPage]);

  return (
    <>
      <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#080809] text-attio-text-primary-light dark:text-attio-text-primary-dark flex flex-col justify-between">
        <PageMeta
          title="UI/UX Explorations — Alifia Hamzah"
          description="Browse UI/UX design explorations by Alifia Hamzah. Visual experiments, design concepts, and creative explorations in product design."
          keywords="UI/UX explorations, design concepts, visual experiments, product design, Alifia Hamzah explorations"
          canonical="https://hamzah.design/exploration"
          schema={
            explorations.length > 0
              ? {
                  "@context": "https://schema.org",
                  "@type": "CollectionPage",
                  name: "UI/UX Explorations by Alifia Hamzah",
                  description:
                    "Browse UI/UX design explorations by Alifia Hamzah. Visual experiments, design concepts, and creative explorations in product design.",
                  url: "https://hamzah.design/exploration",
                  mainEntity: {
                    "@type": "ItemList",
                    itemListElement: explorations.map((e, idx) => ({
                      "@type": "ListItem",
                      position: idx + 1,
                      url: `https://hamzah.design/exploration/${e.slug}`,
                      name: e.title || `Exploration ${e.slug}`,
                    })),
                  },
                }
              : undefined
          }
        />
        {/* <Navbar /> */}

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
              width: isCursorHovering ? 96 : 0,
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
                  <div className="inline-flex items-center text-xs font-semibold text-white dark:text-black whitespace-nowrap">
                    View Detail
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </Cursor>

        <main
          aria-label="Exploration page content"
          className="relative z-10 bg-[#FAFAF9] dark:bg-[#080809] flex-1 border-b border-attio-border-light dark:border-attio-border-dark transition-colors duration-300"
        >
          <div className="max-w-[1440px] mx-auto px-0 lg:px-6">
            <div className="border-l-0 border-r-0 lg:border-l lg:border-r border-attio-border-light dark:border-attio-border-dark min-h-full bg-white dark:bg-[#0A0A0B]">
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
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#0A0A0B] pointer-events-none" />
                  </div>

                  <div className="relative z-10">
                    <h1 className="font-serif-attio text-[30px] sm:text-[36px] lg:text-[46px] leading-tight text-black dark:text-white">
                      Exploration
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                      Visual design explorations and creative experiments.
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="px-5 sm:px-5 lg:px-5 xl:px-5 py-5">
                  {loading ? (
                    <div className="relative w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-4 gap-5 md:gap-4 lg:gap-8 xl:gap-8 2xl:gap-8 auto-rows-auto sm:auto-rows-[280px] lg:auto-rows-[300px] grid-flow-row-dense">
                      {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                        <SkeletonLoader
                          key={i}
                          className="rounded-xl aspect-square sm:aspect-auto h-full w-full"
                        />
                      ))}
                    </div>
                  ) : layoutExplorations.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3 text-neutral-400">
                      <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-attio-border-light dark:border-attio-border-dark flex items-center justify-center">
                        <Icon
                          icon="solar:gallery-linear"
                          className="w-8 h-8 text-neutral-300 dark:text-neutral-600"
                        />
                      </div>
                      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        No explorations yet.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="relative w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-4 gap-5 md:gap-4 lg:gap-8 xl:gap-8 2xl:gap-8 auto-rows-auto sm:auto-rows-[280px] lg:auto-rows-[300px] grid-flow-row-dense">
                        {paginatedExplorations.map((exp) => {
                          const is16by9 = exp.aspect_ratio === "16:9";
                          const is9by16 = exp.aspect_ratio === "9:16";

                          let itemClasses =
                            "col-span-1 row-span-1 aspect-square sm:aspect-auto sm:h-full w-full";
                          if (is16by9) {
                            // 16:9 spans 2 cols, matching height via explicit auto-rows on sm and up
                            itemClasses =
                              "col-span-1 sm:col-span-2 row-span-1 aspect-[16/9] sm:aspect-auto sm:h-full w-full";
                          } else if (is9by16) {
                            // 9:16 spans 2 rows to fill downward on sm and up
                            itemClasses =
                              "col-span-1 row-span-1 sm:row-span-2 aspect-[9/16] sm:aspect-auto sm:h-full w-full";
                          }

                          return (
                            <motion.div
                              key={exp.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                              onClick={() => setSelectedItem(exp)}
                              onMouseEnter={() => setIsCursorHovering(true)}
                              onMouseLeave={() => setIsCursorHovering(false)}
                              className={`group relative rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-pointer border-0 hover:ring-2 hover:ring-neutral-200 dark:hover:ring-neutral-700 transition-all ${itemClasses}`}
                            >
                              <img
                                src={exp.image}
                                alt={exp.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                              />

                              {/* Hover overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pointer-events-none">
                                <h4 className="text-sm font-semibold text-white leading-tight line-clamp-2">
                                  {exp.title}
                                </h4>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Shadcn UI Pagination */}
                      {totalPages >= 1 && (
                        <div className="pt-8 mt-8">
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
                                (_, i) => i + 1,
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
                                      Math.min(totalPages, p + 1),
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

        {/* Detail Popup — portaled to body */}
        {typeof document !== "undefined" &&
          createPortal(
            <AnimatePresence>
              {selectedItem && (
                <motion.div
                  key="exploration-popup"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[9999] bg-[#09090b] flex flex-col justify-between text-white font-sans"
                  style={{ backgroundColor: "rgba(9, 9, 11, 0.98)" }}
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
                        <span className="text-xs font-bold text-white block">
                          Alifia Hamzah
                        </span>
                        <span className="text-[10px] text-neutral-400 block font-medium">
                          Product Designer
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-semibold tracking-tight text-neutral-200 hidden sm:block max-w-md truncate">
                      {selectedItem.title}
                    </h3>

                    {/* Close Button */}
                    <div className="relative w-10 h-10 select-none">
                      <div className="absolute top-12 right-0">
                        <ClosePopup
                          onClose={() => {
                            setSelectedItem(null);
                            setShowInfo(false);
                          }}
                        />
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
                      <Icon
                        icon="solar:alt-arrow-left-linear"
                        className="w-6 h-6"
                      />
                    </button>

                    {/* Active Media Preview */}
                    <div className="w-full h-full flex items-center justify-center select-none p-2 relative">
                      <MediaPreview item={selectedItem} />
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={handleNext}
                      className="absolute right-4 md:right-6 p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white cursor-pointer transition-all z-20 hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg"
                      title="Next"
                    >
                      <Icon
                        icon="solar:alt-arrow-right-linear"
                        className="w-6 h-6"
                      />
                    </button>
                  </div>

                  {/* BOTTOM BAR (Thumbnails + Actions Dock) */}
                  <div className="w-full flex flex-col items-center gap-4 py-6 border-t border-white/10 bg-[#09090b]/80 backdrop-blur z-20 relative">
                    {/* Horizontal Scrollable Thumbnail Pagination */}
                    <div
                      className="w-full max-w-[85vw] md:max-w-[70vw] overflow-x-auto py-1"
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
                      <div className="flex justify-start md:justify-center items-center gap-2 mx-auto w-max px-4">
                        {explorations.map((exp) => {
                          const isActive = exp.id === selectedItem.id;
                          return (
                            <button
                              key={exp.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(exp);
                              }}
                              className={`w-14 h-10 rounded-md overflow-hidden bg-neutral-800 border-2 transition-all flex-shrink-0 cursor-pointer ${
                                isActive
                                  ? "border-white scale-110 shadow-lg"
                                  : "border-transparent opacity-40 hover:opacity-80"
                              }`}
                            >
                              <img
                                src={exp.image}
                                alt={exp.title}
                                className="w-full h-full object-cover"
                              />
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
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowInfo(!showInfo);
                        }}
                        className={`p-2 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                          showInfo
                            ? "bg-white text-[#09090b] hover:bg-neutral-200"
                            : "hover:bg-white/10 text-neutral-300 hover:text-white"
                        }`}
                        title="Toggle Info"
                      >
                        <Icon
                          icon="solar:info-circle-linear"
                          className="w-5 h-5"
                        />
                      </button>
                    </div>
                    {/* Info Card - non-floating normal flex flow container */}
                    <AnimatePresence>
                      {showInfo && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="w-[92%] max-w-md bg-[#121215]/95 border border-white/10 rounded-2xl text-left shadow-2xl z-30 overflow-hidden font-sans"
                        >
                          <div className="p-5 space-y-3">
                            <div>
                              <h4 className="text-base font-semibold text-white leading-snug">
                                {selectedItem.title}
                              </h4>
                              <p className="text-xs text-neutral-450 mt-2 leading-relaxed whitespace-pre-line">
                                {selectedItem.description.trim()}
                              </p>
                            </div>

                            {/* Keywords Tags */}
                            {selectedItem.keywords && (
                              <div className="space-y-1.5 pt-1.5 border-t border-white/5">
                                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">
                                  Keywords
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {selectedItem.keywords
                                    .split(",")
                                    .map((kw, i) => (
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
                    </AnimatePresence>{" "}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body,
          )}
      </div>
      <Toaster position="bottom-center" />
    </>
  );
}
