import React, { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import {
  cmsFetch,
  SINGLE_CASE_STUDY_QUERY,
  RELATED_CASE_STUDIES_QUERY,
} from "../lib/cmsendpoint";
import PageMeta from "./SEO/PageMeta";
import { toast } from "sonner";
import TableOfContents from "./TableOfContents";
import LexicalRenderer, { extractTableOfContents, lexicalToPlainText } from "./LexicalRenderer";
import { cn } from "../lib/utils";
import { buttonVariants } from "./ui/button";
import ScrollProgress from "./ScrollProgress";
import RelatedStudies from "./RelatedStudies";
import VideoPopup from "./VideoPopup"; // Import VideoPopup
import ReactPlayer from "react-player"; // For video embeds
import SkeletonLoader from "./ui/SkeletonLoader";

// Lazy load heavy components
const FooterReveal = React.lazy(() => import("./FooterReveal"));
const NotFound = React.lazy(() => import("./NotFound"));

const getReadingTime = (content) => {
  if (!content) return 1;
  try {
    const text = lexicalToPlainText(content);
    const words = text.split(/\s+/).filter((w) => w.length > 0).length;
    // Standard reading speed is 200 Words Per Minute (WPM)
    return Math.max(1, Math.ceil(words / 200));
  } catch (e) {
    console.error("Error calculating reading time:", e);
    return 1;
  }
};

export default function WorkDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("videoAutoPlay");
      return saved === null ? true : saved === "true";
    }
    return true;
  });

  const handleToggleAutoPlay = () => {
    const nextVal = !autoPlayEnabled;
    setAutoPlayEnabled(nextVal);
    if (typeof window !== "undefined") {
      localStorage.setItem("videoAutoPlay", String(nextVal));
      window.dispatchEvent(new Event("videoAutoPlayChange"));
    }
    toast.success(`Video autoplay turned ${nextVal ? "ON" : "OFF"}`);
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied to clipboard!");
    }).catch((err) => {
      console.error("Failed to copy link: ", err);
      toast.error("Failed to copy link");
    });
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const url = window.location.href;
    const shareData = {
      title: data?.title || document.title,
      text: data?.description || "",
      url: url,
    };

    if (navigator.share) {
      navigator.share(shareData)
        .then(() => {
          toast.success("Successfully shared!");
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error("Error sharing: ", err);
            copyToClipboard(url);
          }
        });
    } else {
      copyToClipboard(url);
    }
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    const isMac = typeof window !== "undefined" && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const shortcut = isMac ? 'Cmd + D' : 'Ctrl + D';
    toast.info(`Press ${shortcut} to bookmark this page!`, {
      description: "Modern browsers require manual shortcuts to add bookmarks for security.",
    });
  };
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [related, setRelated] = useState([]);
  const [activeTocId, setActiveTocId] = useState(null);

  // Refs for ScrollProgress (start=title, end=related section or body)
  const titleRef = useRef(null);
  const contentEndRef = useRef(null);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("default", { month: "short", year: "numeric" });
  };

  const tableOfContents = useMemo(() => {
    if (!data?.content) return [];
    return extractTableOfContents(data.content);
  }, [data?.content]);

  const handleTocClick = (event, id) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) {
      console.warn(`TOC target not found: ${id}`);
      return;
    }

    setActiveTocId(id);
    const headerOffset = 120;
    const elementTop = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: Math.max(elementTop - headerOffset, 0),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    async function getWork() {
      if (!slug) return;
      setLoading(true);
      setIsNotFound(false);
      setRelated([]);
      setActiveTocId(null);
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const isPreview = searchParams.get('preview') === 'true';
        
        const match = await cmsFetch(SINGLE_CASE_STUDY_QUERY(slug), { 
          slug, 
          preview: isPreview 
        });
        if (!match) {
          setIsNotFound(true);
          setData(null);
        } else {
          setData(match);
          // Fetch related studies
          try {
            const rel = await cmsFetch(
              RELATED_CASE_STUDIES_QUERY(match._id, match.slug),
            );
            setRelated(rel || []);
          } catch {
            setRelated([]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch case study:", err);
        setIsNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    getWork();
  }, [slug]);

  useEffect(() => {
    if (!tableOfContents.length || typeof window === "undefined") return undefined;

    const flatItems = tableOfContents.flatMap((section) => [
      section,
      ...(section.children || []),
    ]);

    const getHeadingElements = () => flatItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    let ticking = false;

    const updateActiveHeading = () => {
      const headingElements = getHeadingElements();
      if (!headingElements.length) {
        ticking = false;
        return;
      }

      const activationOffset = 160;
      const headingsAboveOffset = headingElements.filter(
        (element) => element.getBoundingClientRect().top <= activationOffset,
      );
      const nextActiveId = headingsAboveOffset.at(-1)?.id || headingElements[0].id;

      setActiveTocId((currentId) => (currentId === nextActiveId ? currentId : nextActiveId));
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateActiveHeading);
    };

    updateActiveHeading();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", updateActiveHeading);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", updateActiveHeading);
    };
  }, [tableOfContents]);

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
              <div className="px-4 sm:px-8 lg:px-16 xl:px-20">
                <SkeletonLoader className="w-full h-6 mb-2" />
                <SkeletonLoader className="w-full h-6 mb-2" />
                <SkeletonLoader className="w-3/4 h-6 mb-8" />
                <div className="mb-10 grid grid-cols-2 md:grid-cols-3 gap-6 p-6 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900/50">
                  <div className="space-y-2">
                    <SkeletonLoader className="w-1/3 h-4" />
                    <SkeletonLoader className="w-2/3 h-5" />
                  </div>
                  <div className="space-y-2">
                    <SkeletonLoader className="w-1/3 h-4" />
                    <SkeletonLoader className="w-2/3 h-5" />
                  </div>
                  <div className="space-y-2">
                    <SkeletonLoader className="w-1/3 h-4" />
                    <SkeletonLoader className="w-2/3 h-5" />
                  </div>
                </div>
                <SkeletonLoader className="w-full h-80 mb-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isNotFound || !data) {
    return (
      <Suspense
        fallback={
          <div className="h-screen w-full bg-background flex items-center justify-center">
            <Icon
              icon="svg-spinners:180-ring"
              className="w-8 h-8 text-foreground/50"
            />
          </div>
        }
      >
        <NotFound />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#080809] text-attio-text-primary-light dark:text-attio-text-primary-dark flex flex-col justify-between">
      <PageMeta
        title={data.seoTitle || data.title}
        description={data.seoDescription || data.description}
        keywords={`case study, ${data.title}, ${data.company}, product design, UI/UX`}
        canonical={`https://hamzah.design/work/${data.slug}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: data.title,
          description: data.description,
          image: data.heroImage,
          author: {
            "@type": "Person",
            name: "Alifia Hamzah",
            url: "https://hamzah.design",
          },
          publisher: {
            "@type": "Organization",
            name: "Alifia Hamzah Portfolio",
            logo: {
              "@type": "ImageObject",
              url: "https://hamzah.design/images/general/profilephoto.webp",
            },
          },
          datePublished: data.publishedAt,
          mainEntityOfPage: `https://hamzah.design/work/${data.slug}`,
        }}
      />

      {/* ScrollProgress — anchored from title to end of content */}
      <ScrollProgress startRef={titleRef} endRef={contentEndRef} />

      <main
        aria-label="Work detail page content"
        className="relative z-10 bg-[#FAFAF9] dark:bg-[#080809] flex-1 border-b border-attio-border-light dark:border-attio-border-dark transition-colors duration-300"
      >
        <div className="max-w-[1440px] mx-auto px-0 lg:px-6">
          <div className="border-l-0 border-r-0 lg:border-l lg:border-r border-attio-border-light dark:border-attio-border-dark min-h-full bg-white dark:bg-[#0A0A0B]">
            <div className="w-full py-8 md:py-12">
              {/* Breadcrumb */}
              <div className="px-4 sm:px-8 lg:px-16 xl:px-20 pb-3 border-b border-dashed border-neutral-200 dark:border-neutral-800">
                <nav
                  className="text-sm text-neutral-500 dark:text-neutral-400"
                  aria-label="Breadcrumb"
                >
                  <ol className="flex items-center gap-1.5">
                    <li>
                      <Link
                        to="/work"
                        className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                      >
                        Work
                      </Link>
                    </li>
                    <li
                      className="text-neutral-300 dark:text-neutral-600"
                      aria-hidden="true"
                    >
                      /
                    </li>
                    <li className="text-neutral-900 dark:text-neutral-100 font-medium truncate max-w-[300px] sm:max-w-[500px]">
                      {data.title}
                    </li>
                  </ol>
                </nav>
              </div>

              {/* Back + Header Actions */}
              <div className="px-4 sm:px-8 lg:px-16 xl:px-20 pt-6 flex items-center justify-between w-full">
                {/* Left Group */}
                <div className="flex items-center gap-3.5">
                  <Link
                    to="/work"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "icon" }),
                      "shrink-0",
                    )}
                    aria-label="Back to Work"
                  >
                    <Icon
                      icon="lucide:chevron-left"
                      className="w-4 h-4 text-neutral-800 dark:text-neutral-200"
                    />
                  </Link>
                  <span className="text-sm font-normal text-neutral-900 dark:text-neutral-100 select-none">
                    {getReadingTime(data.content)} min read
                  </span>
                </div>

                {/* Right Group: Share, Save */}
                <div className="flex items-center gap-3">
                  {/* Share Trigger */}
                  <button
                    onClick={handleShare}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "icon" }),
                      "shrink-0 cursor-pointer flex items-center justify-center",
                    )}
                    title="Copy Share Link"
                  >
                    <Icon
                      icon="solar:share-linear"
                      className="w-4 h-4 text-neutral-800 dark:text-neutral-200"
                    />
                  </button>

                  {/* Save Trigger (Bookmark Instruction) */}
                  <button
                    onClick={handleBookmark}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "icon" }),
                      "shrink-0 cursor-pointer flex items-center justify-center",
                    )}
                    title="Bookmark Page"
                  >
                    <Icon
                      icon="solar:bookmark-linear"
                      className="w-4 h-4 text-neutral-800 dark:text-neutral-200"
                    />
                  </button>
                </div>
              </div>

              {/* Title — scroll start anchor */}
              <div
                ref={titleRef}
                className="px-4 sm:px-8 lg:px-16 xl:px-20 pt-3 pb-6"
              >
                <h1 className="font-serif-attio text-4xl md:text-5xl lg:text-6xl font-medium text-black dark:text-white leading-tight tracking-tight">
                  {data.title}
                </h1>
              </div>

              {/* Thumbnail */}
              <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800">
                <img
                  src={data.heroImage}
                  alt={data.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content — Grid layout */}
              <div className="py-3 sm:py-8 lg:py-16 xl:py-20 px-4 sm:px-8 lg:px-16 xl:px-20 grid grid-cols-1 md:grid-cols-[1fr,200px] lg:grid-cols-[1fr,240px] gap-8 lg:gap-12 max-w-[1440px] mx-auto">
                  <div className="min-w-0">
                    {data.description && (
                      <p className="mb-8 text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-4xl">
                        {data.description}
                      </p>
                    )}
                    {/* Grid info */}
                    <div className="mb-10 grid grid-cols-2 md:grid-cols-3 gap-6 p-6 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900/50">
                      {data.role && (
                        <div>
                          <span className="block text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1">
                            Role
                          </span>
                          <p className="font-medium text-neutral-900 dark:text-neutral-100">
                            {data.role}
                          </p>
                        </div>
                      )}
                      {data.company && (
                        <div>
                          <span className="block text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1">
                            Company
                          </span>
                          <p className="font-medium text-neutral-900 dark:text-neutral-100">
                            {data.company}
                          </p>
                        </div>
                      )}
                      {data.year && (
                        <div>
                          <span className="block text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1">
                            Year
                          </span>
                          <p className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
                            {data.year}
                          </p>
                        </div>
                      )}
                      {(data.startDate || data.endDate) && (
                        <div>
                          <span className="block text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1">
                            Timeline
                          </span>
                          <p className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
                            {data.startDate ? formatDate(data.startDate) : ""}
                            {data.endDate ? ` — ${formatDate(data.endDate)}` : ""}
                          </p>
                        </div>
                      )}
                      {data.teamMembers && data.teamMembers.length > 0 && (
                        <div>
                          <span className="block text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1">
                            Contributors
                          </span>
                          <div className="flex -space-x-2">
                            {data.teamMembers.slice(0, 3).map((m, i) => (
                              <div key={i} className="group relative">
                                <a
                                  href={m.linkedinURL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0A0A0B] object-cover bg-neutral-200 dark:bg-neutral-800 hover:scale-110 transition-transform duration-200 flex items-center justify-center overflow-hidden block"
                                >
                                  <img
                                    src={m.photo}
                                    alt={m.fullName}
                                    className="w-full h-full object-cover"
                                  />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Main Lexical Content */}
                    <div ref={contentEndRef}>
                      <LexicalRenderer content={data.content} />
                    </div>
                  </div>

                  {/* ToC Sidebar */}
                  {tableOfContents.length > 0 && (
                    <div className="hidden md:block sticky top-28 self-start">
                      <TableOfContents 
                          items={tableOfContents} 
                          activeId={activeTocId} 
                          onItemClick={handleTocClick}
                      />
                    </div>
                  )}
              </div>

              {/* Related Studies */}
              <RelatedStudies studies={related} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer Reveal (Lazy Loaded) */}
      <Suspense fallback={null}>
        <FooterReveal />
      </Suspense>
    </div>
  );
}
