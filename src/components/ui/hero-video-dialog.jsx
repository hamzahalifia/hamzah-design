import { useState, useEffect, useRef, useCallback } from "react"
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "../../lib/utils" // Adjusted path for cn

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
}

export function HeroVideoDialog({
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className,
  caption,
}) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const selectedAnimation = animationVariants[animationStyle]

  // Determine if the video is an embed (YouTube/Vimeo) or a direct video file
  const isEmbed = /youtube\.com|youtu\.be|vimeo\.com/i.test(videoSrc);

  const getEmbedUrl = useCallback((url) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtube.com') && u.searchParams.has('v')) {
        return `https://www.youtube.com/embed/${u.searchParams.get('v')}?autoplay=1&rel=0`;
      }
      if (u.hostname.includes('youtu.be')) {
        return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1&rel=0`;
      }
      if (u.hostname.includes('vimeo.com')) {
        // For Vimeo, ensure the embed URL is correct. Add autoplay.
        return `https://player.vimeo.com/video${u.pathname}?autoplay=1`;
      }
    } catch {}
    return url; // Fallback for cases that are not standard embed links
  }, []);

  const embedUrl = isEmbed ? getEmbedUrl(videoSrc) : null;

  // Handle keyboard events for closing
  useEffect(() => {
    const onKey = (e) => {
      if (isVideoOpen && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')) {
        setIsVideoOpen(false);
      }
    };
    if (isVideoOpen) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when dialog is open
    } else {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isVideoOpen]);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Play video"
        className="group relative cursor-pointer border-0 bg-transparent p-0 w-full"
        onClick={() => setIsVideoOpen(true)}>
        <img
          src={thumbnailSrc || (isEmbed ? `https://img.youtube.com/vi/${new URL(videoSrc).searchParams.get('v') || new URL(videoSrc).pathname.slice(1)}/hqdefault.jpg` : null)} // Attempt to get YouTube thumbnail
          alt={thumbnailAlt}
          width={1920}
          height={1080}
          className="w-full rounded-md border shadow-lg transition-all duration-200 ease-out group-hover:brightness-[0.8]" />
        <div
          className="absolute inset-0 flex scale-[0.9] items-center justify-center rounded-2xl transition-all duration-200 ease-out group-hover:scale-100">
          <div
            className="bg-primary/10 flex size-28 items-center justify-center rounded-full backdrop-blur-md">
            <div
              className={`from-primary/30 to-primary relative flex size-20 scale-100 items-center justify-center rounded-full bg-linear-to-b shadow-md transition-all duration-200 ease-out group-hover:scale-[1.2]`}>
              <Icon icon="solar:play-bold"
                className="size-8 scale-100 fill-white text-white transition-transform duration-200 ease-out group-hover:scale-105"
                style={{
                  filter:
                    "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))",
                }} />
            </div>
          </div>
        </div>
      </button>
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            role="button"
            tabIndex={0}
            onClick={() => setIsVideoOpen(false)}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
            <motion.div
              {...selectedAnimation}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative mx-4 aspect-video w-full max-w-4xl md:mx-0"
              onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking on the video container */}
              <motion.button
                onClick={() => setIsVideoOpen(false)}
                className="absolute -top-12 right-0 md:-right-12 z-10 rounded-full bg-neutral-900/50 p-2 text-xl text-white ring-1 backdrop-blur-md dark:bg-neutral-100/50 dark:text-black">
                <Icon icon="lucide:x" className="w-5 h-5" />
              </motion.button>
              <div
                className="relative isolate z-1 size-full overflow-hidden rounded-2xl border-2 border-white">
                {isEmbed ? (
                   <iframe
                   src={embedUrl}
                   title={caption || "Hero Video player"}
                   className="mt-0 size-full rounded-2xl"
                   allowFullScreen
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                 ></iframe>
                ) : (
                  <video
                    src={videoSrc}
                    poster={thumbnailSrc}
                    controls
                    controlsList="nodownload"
                    preload="metadata"
                    className="w-full h-full object-contain"
                    playsInline
                    autoPlay
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
