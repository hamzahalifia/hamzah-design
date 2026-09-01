import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import PageMeta from "./SEO/PageMeta";
import FooterReveal from "./FooterReveal";
import LexicalRenderer from "./LexicalRenderer";
import SkeletonLoader from "./ui/SkeletonLoader";
import OptimizedImage from "./OptimizedImage";
import { fetchSingleResource } from "../lib/cmsendpoint";

export default function ResourceDetail() {
  const { slug } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  useEffect(() => {
    async function loadResource() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSingleResource(slug);
        setResource(data);
      } catch (err) {
        console.error("Failed to load resource detail:", err);
        setError("Resource not found or failed to load.");
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadResource();
    }
  }, [slug]);

  const allMediaItems = React.useMemo(() => {
    if (!resource) return [];
    const media = [];
    if (resource.image) {
      media.push({ type: "image", url: resource.image, alt: resource.title });
    }
    if (resource.gallery?.images && resource.gallery.images.length > 0) {
      resource.gallery.images.slice(0, 5).forEach((imgUrl, i) => {
        if (imgUrl && imgUrl !== resource.image) {
          media.push({ type: "image", url: imgUrl, alt: `${resource.title} gallery ${i + 1}` });
        }
      });
    }
    if (resource.gallery?.video) {
      media.push({ type: "video", url: resource.gallery.video, alt: `${resource.title} video` });
    }
    return media;
  }, [resource]);

  const currentMedia = allMediaItems[selectedMediaIndex] || allMediaItems[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#080809] text-neutral-900 dark:text-neutral-100 flex flex-col justify-between">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
          <SkeletonLoader className="w-1/3 h-6 rounded-md" />
          <SkeletonLoader className="w-full h-12 rounded-lg" />
          <SkeletonLoader className="w-full h-[400px] rounded-2xl" />
        </div>
        <FooterReveal />
      </div>
    );
  }

  if (error || !resource) {
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
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#080809] text-attio-text-primary-light dark:text-attio-text-primary-dark transition-colors duration-300">
      <PageMeta
        title={resource.seoTitle || `${resource.title} — Resources by Alifia Hamzah`}
        description={resource.seoDescription || resource.description}
        ogImage={resource.ogImage || resource.image}
        canonical={`https://hamzah.design/resources/${resource.slug}`}
      />

      <main aria-label="Resource detail content" className="relative z-10 py-8 lg:py-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-6">
            <Link to="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/resources" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Resources
            </Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white truncate max-w-[200px] sm:max-w-xs font-semibold">
              {resource.title}
            </span>
          </div>

          {/* Header Info Block */}
          <div className="bg-white dark:bg-[#0A0A0B] border border-attio-border-light dark:border-attio-border-dark rounded-2xl p-6 lg:p-8 mb-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="space-y-4 flex-1">
                {/* Badges Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  {resource.type?.name && (
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                      {resource.type.name}
                    </span>
                  )}
                  {resource.version && (
                    <span className="px-2.5 py-1 text-xs font-mono font-medium rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-700/60">
                      {resource.version}
                    </span>
                  )}
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full font-mono border ${
                      resource.priceType === "free"
                        ? "bg-emerald-500 text-white border-emerald-400"
                        : "bg-black text-white dark:bg-white dark:text-black border-neutral-700 dark:border-neutral-200"
                    }`}
                  >
                    {resource.priceType === "free" ? "FREE" : `$${resource.price}`}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
                    {resource.title}
                  </h1>
                  <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mt-3 leading-relaxed">
                    {resource.description}
                  </p>
                </div>

                {/* Meta details: Platform & Tech Stacks */}
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-wrap items-center gap-6 text-xs">
                  {resource.platform?.name && (
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400 font-medium">Platform:</span>
                      <div className="flex items-center gap-1.5 font-semibold text-neutral-900 dark:text-neutral-100">
                        {resource.platform.logo && (
                          <img src={resource.platform.logo} alt={resource.platform.name} className="w-4 h-4 object-contain" />
                        )}
                        <span>{resource.platform.name}</span>
                      </div>
                    </div>
                  )}

                  {resource.techStacks && resource.techStacks.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400 font-medium">Tech Stack:</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {resource.techStacks.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-xs font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center gap-1"
                          >
                            {tech.logo && <img src={tech.logo} alt={tech.name} className="w-3 h-3 object-contain" />}
                            <span>{tech.name}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Main CTA Button */}
              {resource.link && (
                <div className="lg:self-start flex-shrink-0 pt-2 lg:pt-0">
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold text-sm hover:opacity-90 transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
                  >
                    <span>Get Resource</span>
                    <Icon icon="solar:export-linear" className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Media Gallery Section */}
          {allMediaItems.length > 0 && (
            <div className="bg-white dark:bg-[#0A0A0B] border border-attio-border-light dark:border-attio-border-dark rounded-2xl p-6 mb-8 shadow-sm space-y-4">
              {/* Main Active Media */}
              <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 relative">
                {currentMedia?.type === "video" ? (
                  <video
                    src={currentMedia.url}
                    controls
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <OptimizedImage
                    src={currentMedia?.url || resource.image}
                    alt={currentMedia?.alt || resource.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Video Embed if present */}
              {resource.gallery?.videoEmbedUrl && (
                <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                  <iframe
                    src={resource.gallery.videoEmbedUrl}
                    title={`${resource.title} video`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Thumbnails Navigation */}
              {allMediaItems.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto py-2">
                  {allMediaItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedMediaIndex(idx)}
                      className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                        idx === selectedMediaIndex
                          ? "border-neutral-900 dark:border-white scale-105 shadow-md"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      {item.type === "video" ? (
                        <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-white">
                          <Icon icon="solar:play-circle-linear" className="w-6 h-6" />
                        </div>
                      ) : (
                        <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content / Documentation Section */}
          {resource.content && (
            <div className="bg-white dark:bg-[#0A0A0B] border border-attio-border-light dark:border-attio-border-dark rounded-2xl p-6 lg:p-10 shadow-sm">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                Overview & Specifications
              </h2>
              <div className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed">
                <LexicalRenderer content={resource.content} />
              </div>
            </div>
          )}
        </div>
      </main>

      <FooterReveal />
    </div>
  );
}
