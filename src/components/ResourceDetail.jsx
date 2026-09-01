import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import PageMeta from "./SEO/PageMeta";
import FooterReveal from "./FooterReveal";
import LexicalRenderer, { lexicalToPlainText } from "./LexicalRenderer";
import SkeletonLoader from "./ui/SkeletonLoader";
import OptimizedImage from "./OptimizedImage";
import { fetchSingleResource } from "../lib/cmsendpoint";
import { cn } from "../lib/utils";
import { buttonVariants } from "./ui/button";
import ScrollProgress from "./ScrollProgress";
import { RainbowButton } from "./ui/rainbow-button";
import { RollingText } from "./magicui/RollingText";
import { toast } from "sonner";

const getReadingTime = (content) => {
  if (!content) return 1;
  try {
    const text = lexicalToPlainText(content);
    const words = text.split(/\s+/).filter((w) => w.length > 0).length;
    return Math.max(1, Math.ceil(words / 200));
  } catch (e) {
    return 1;
  }
};

export default function ResourceDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoved, setIsLoved] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const titleRef = useRef(null);
  const contentEndRef = useRef(null);

  useEffect(() => {
    async function loadResource() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchSingleResource(slug);
        setData(res);
      } catch (err) {
        console.error("Failed to load resource detail:", err);
        setError("Resource not found");
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadResource();
    }
  }, [slug]);

  // Sync love status from localStorage
  useEffect(() => {
    if (data?.slug && typeof window !== "undefined") {
      const loved = localStorage.getItem(`love_res_${data.slug}`) === "true";
      setIsLoved(loved);
    }
  }, [data?.slug]);

  const handleToggleLove = (e) => {
    e.stopPropagation();
    if (!data?.slug) return;
    const nextVal = !isLoved;
    setIsLoved(nextVal);
    if (typeof window !== "undefined") {
      localStorage.setItem(`love_res_${data.slug}`, String(nextVal));
    }
    if (nextVal) {
      toast.success("Saved to your favorites ❤️");
    } else {
      toast.info("Removed from your favorites");
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => toast.success("Link copied to clipboard"))
        .catch(() => toast.error("Failed to copy link"));
    }
  };

  // Compile media slides for carousel (Thumbnail + Gallery Images + Gallery Video)
  const slides = useMemo(() => {
    if (!data) return [];
    const list = [];
    if (data.image) {
      list.push({ type: "image", url: data.image, title: data.title });
    }
    if (data.gallery?.images && data.gallery.images.length > 0) {
      data.gallery.images.forEach((imgUrl, i) => {
        if (imgUrl && imgUrl !== data.image) {
          list.push({ type: "image", url: imgUrl, title: `${data.title} screenshot ${i + 1}` });
        }
      });
    }
    if (data.gallery?.video) {
      list.push({ type: "video", url: data.gallery.video, title: `${data.title} video` });
    }
    return list;
  }, [data]);

  // Autoplay carousel timer (every 5 seconds)
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length, isPaused]);

  const handlePrevSlide = () => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#080809]">
        <div className="max-w-[1440px] mx-auto px-0 lg:px-6">
          <div className="border-l-0 border-r-0 lg:border-l lg:border-r border-attio-border-light dark:border-attio-border-dark min-h-full bg-white dark:bg-[#0A0A0B]">
            <div className="w-full py-8 md:py-12">
              <div className="px-4 sm:px-8 lg:px-16 xl:px-20 pb-3 border-b border-dashed border-neutral-200 dark:border-neutral-800">
                <SkeletonLoader className="w-1/4 h-4 mb-3" />
              </div>
              <div className="px-4 sm:px-8 lg:px-16 xl:px-20 pt-6 flex items-center gap-3">
                <SkeletonLoader className="w-9 h-9 rounded-full" />
                <SkeletonLoader className="w-24 h-7" />
              </div>
              <div className="px-4 sm:px-8 lg:px-16 xl:px-20 pt-3 pb-6">
                <SkeletonLoader className="w-3/4 h-12 mb-2" />
                <SkeletonLoader className="w-1/2 h-8" />
              </div>
              <SkeletonLoader className="aspect-video w-full h-auto mb-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#080809] text-neutral-900 dark:text-neutral-100 flex flex-col justify-between">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-24 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
            <Icon icon="solar:danger-triangle-linear" className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">Resource Not Found</h1>
          <p className="text-sm text-neutral-500 max-w-md mx-auto">
            The resource you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-black text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Icon icon="solar:arrow-left-linear" className="w-4 h-4" />
            Back to Resources
          </Link>
        </div>
        <FooterReveal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#080809] text-attio-text-primary-light dark:text-attio-text-primary-dark flex flex-col justify-between">
      <PageMeta
        title={data.seoTitle || `${data.title} — Resources by Alifia Hamzah`}
        description={data.seoDescription || data.description}
        keywords={`resource, ${data.title}, ${data.type?.name}, product design, UI kit, template`}
        ogImage={data.ogImage || data.image}
        canonical={`https://hamzah.design/resources/${data.slug}`}
      />

      <ScrollProgress startRef={titleRef} endRef={contentEndRef} />

      <main
        aria-label="Resource detail page content"
        className="relative z-10 bg-[#FAFAF9] dark:bg-[#080809] flex-1 border-b border-attio-border-light dark:border-attio-border-dark transition-colors duration-300"
      >
        <div className="max-w-[1440px] mx-auto px-0 lg:px-6">
          <div className="border-l-0 border-r-0 lg:border-l lg:border-r border-attio-border-light dark:border-attio-border-dark min-h-full bg-white dark:bg-[#0A0A0B]">
            <div className="w-full pt-4 pb-8 md:pt-6 md:pb-12">
              {/* Back + Header Actions */}
              <div className="px-4 sm:px-8 lg:px-16 xl:px-20 pt-0 flex items-center justify-between w-full">
                <div className="flex items-center gap-3.5">
                  <Link
                    to="/resources"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "icon" }),
                      "shrink-0"
                    )}
                    aria-label="Back to Resources"
                  >
                    <Icon
                      icon="lucide:chevron-left"
                      className="w-4 h-4 text-neutral-800 dark:text-neutral-200"
                    />
                  </Link>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleShare}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "icon" }),
                      "shrink-0 cursor-pointer flex items-center justify-center"
                    )}
                    title="Copy Share Link"
                  >
                    <Icon
                      icon="solar:share-linear"
                      className="w-4 h-4 text-neutral-800 dark:text-neutral-200"
                    />
                  </button>

                  <button
                    onClick={handleToggleLove}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "icon" }),
                      "shrink-0 cursor-pointer flex items-center justify-center transition-colors duration-300",
                      isLoved &&
                        "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-950/30"
                    )}
                    title={isLoved ? "Remove from favorites" : "Save to favorites"}
                  >
                    <Icon
                      icon={isLoved ? "solar:heart-bold" : "solar:heart-linear"}
                      className={cn(
                        "w-4 h-4 transition-transform duration-300 active:scale-125",
                        isLoved ? "text-red-500 scale-110" : "text-neutral-800 dark:text-neutral-200"
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Title Header - Eye-catching Category Badge Only (No Icon) */}
              <div ref={titleRef} className="px-4 sm:px-8 lg:px-16 xl:px-20 pt-3 pb-6 space-y-3">
                {data.type?.name && (
                  <div className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md border border-neutral-800 dark:border-neutral-200 tracking-wide">
                    <span>{data.type.name}</span>
                  </div>
                )}

                <h1 className="font-serif-attio text-4xl md:text-5xl lg:text-6xl font-medium text-black dark:text-white leading-tight tracking-tight">
                  {data.title}
                </h1>
              </div>

              {/* Media Carousel (Same size as Case Study Thumbnail, with Autoplay & Prev/Next) */}
              {slides.length > 0 && (
                <div
                  className="relative aspect-video bg-neutral-100 dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800 overflow-hidden group select-none"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0.8, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0.8, x: -20 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="w-full h-full relative"
                    >
                      {slides[currentSlide].type === "video" ? (
                        <video
                          src={slides[currentSlide].url}
                          controls
                          autoPlay
                          muted
                          loop
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <OptimizedImage
                          src={slides[currentSlide].url}
                          alt={slides[currentSlide].title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Carousel Prev/Next Overlay Controls */}
                  {slides.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                        title="Previous Slide"
                      >
                        <Icon icon="solar:alt-arrow-left-linear" className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                        title="Next Slide"
                      >
                        <Icon icon="solar:alt-arrow-right-linear" className="w-5 h-5" />
                      </button>

                      {/* Carousel Slide Indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                        {slides.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                              idx === currentSlide ? "bg-white w-5" : "bg-white/40 hover:bg-white/70"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Main Content Layout (Single Full Width Column, No Right Aside) */}
              <div className="py-8 lg:py-16 px-4 sm:px-8 lg:px-16 xl:px-20 max-w-4xl mx-auto w-full">
                <div className="min-w-0 w-full">
                  {data.description && (
                    <p className="mb-8 text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                      {data.description}
                    </p>
                  )}

                  {/* CTA Button: Get Template (Free + Icon) or Buy Template · $price (Paid, No Icon) */}
                  {data.link && (
                    <RainbowButton
                      asChild
                      className="w-full sm:w-auto text-base font-semibold btn-radius-lg mb-10"
                      style={{ height: "48px" }}
                    >
                      <a
                        href={data.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6"
                      >
                        <RollingText>
                          {data.priceType === "paid" && data.price > 0
                            ? `Buy Template · $${data.price}`
                            : "Get Template"}
                        </RollingText>
                        {(data.priceType === "free" || !data.price) && (
                          <Icon icon="solar:download-minimalistic-bold" className="w-4 h-4 ml-1" />
                        )}
                      </a>
                    </RainbowButton>
                  )}

                  {/* Consolidated Metadata Summary Grid */}
                  <div className="mb-12 grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900/50">
                    {data.type?.name && (
                      <div>
                        <span className="block text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1.5">
                          Category
                        </span>
                        <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                          {data.type.name}
                        </p>
                      </div>
                    )}

                    {data.platform?.name && (
                      <div>
                        <span className="block text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1.5">
                          Platform
                        </span>
                        <div className="flex items-center gap-2 font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                          {data.platform.logo && (
                            <img src={data.platform.logo} alt={data.platform.name} className="w-6 h-6 object-contain" />
                          )}
                          <span>{data.platform.name}</span>
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="block text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1.5">
                        Price
                      </span>
                      <p className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100">
                        {data.priceType === "free" ? "Free Download" : `$${data.price}`}
                      </p>
                    </div>

                    {data.version && (
                      <div>
                        <span className="block text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1.5">
                          Version
                        </span>
                        <p className="font-mono font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                          {data.version}
                        </p>
                      </div>
                    )}

                    {data.techStacks && data.techStacks.length > 0 && (
                      <div className="col-span-2 sm:col-span-4 pt-4 border-t border-neutral-200/80 dark:border-neutral-800/80">
                        <span className="block text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">
                          Tech Stack
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          {data.techStacks.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 flex items-center gap-2 shadow-2xs"
                            >
                              {tech.logo && <img src={tech.logo} alt={tech.name} className="w-5 h-5 object-contain" />}
                              <span>{tech.name}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RichText Overview (No TOC) */}
                  {data.content && (
                    <div className="prose dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200">
                      <LexicalRenderer content={data.content} />
                    </div>
                  )}

                  <div ref={contentEndRef} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterReveal />
    </div>
  );
}
