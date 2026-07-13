import { useState, useCallback, useEffect } from 'react';
import { Icon } from '@iconify/react';

export default function VideoPopup({ url, caption, isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleBackdrop = useCallback((e) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getEmbedUrl = () => {
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtube.com') && u.searchParams.has('v')) {
        return `https://www.youtube.com/embed/${u.searchParams.get('v')}?autoplay=1&rel=0`;
      }
      if (u.hostname.includes('youtu.be')) {
        return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1&rel=0`;
      }
      if (u.hostname.includes('vimeo.com')) {
        return `https://player.vimeo.com/video${u.pathname}?autoplay=1`;
      }
    } catch {}
    return url;
  };

  const isEmbed = /youtube|vimeo|youtu\.be/i.test(url);
  const embedUrl = isEmbed ? getEmbedUrl() : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={caption || 'Video player'}
    >
      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="Close video"
        >
          <Icon icon="lucide:x" className="w-5 h-5" />
        </button>

        {isEmbed && embedUrl ? (
          <iframe
            src={embedUrl}
            title={caption || 'Embedded video'}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={url}
            controls
            autoPlay
            className="w-full h-full"
            playsInline
          >
          </video>
        )}

        {caption && (
          <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-sm text-white">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
