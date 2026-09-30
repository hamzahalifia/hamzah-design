import React, { useState, useEffect } from 'react';

const DEFAULT_CMS_BASE = 'https://hamzah-design-cms.vercel.app';

function sanitizeCmsUrl(url = '') {
  if (!url) return '';
  return String(url).replace(/https?:\/\/hamzah-design-cms\.onrender\.com/g, DEFAULT_CMS_BASE);
}

// Known local asset fallbacks if remote CMS images fail or are temporarily unreachable
const KNOWN_FALLBACKS = {
  'door-preview-casestudies-1.webp': '/images/work/doormockup-01.webp',
  'door-preview': '/images/work/doormockup-01.webp',
  'thumbnail-door': '/images/work/thumbnail-door.webp',
};

function getKnownFallback(url) {
  if (!url) return null;
  for (const [key, fallback] of Object.entries(KNOWN_FALLBACKS)) {
    if (url.includes(key)) return fallback;
  }
  return null;
}

/**
 * OptimizedImage component for delivering CMS and local media assets.
 * Direct delivery from source with automatic URL sanitization, cache-busting,
 * lazy/eager loading, and resilient fallback handling.
 */
const OptimizedImage = ({
  src,
  alt = '',
  width,
  height,
  className = '',
  loading = 'lazy',
  fetchpriority,
  fetchPriority,
  version,
  updatedAt,
  fallbackSrc,
  ...props
}) => {
  const effectiveFetchPriority = fetchPriority || fetchpriority;
  const effectiveLoading = effectiveFetchPriority === 'high' ? 'eager' : loading;
  const sanitizedSrc = sanitizeCmsUrl(src);

  const computeInitialSrc = () => {
    if (!sanitizedSrc) return '';
    const customVersion = version || (updatedAt ? new Date(updatedAt).getTime() : null);
    if (customVersion && !sanitizedSrc.includes('v=')) {
      const sep = sanitizedSrc.includes('?') ? '&' : '?';
      return `${sanitizedSrc}${sep}v=${customVersion}`;
    }
    return sanitizedSrc;
  };

  const [currentSrc, setCurrentSrc] = useState(computeInitialSrc);
  const [retryStep, setRetryStep] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentSrc(computeInitialSrc());
    setRetryStep(0);
    setHasError(false);
  }, [src, version, updatedAt]);

  if (!sanitizedSrc) {
    return null;
  }

  const handleError = (e) => {
    if (retryStep === 0) {
      // Step 1: Try local fallback if available
      const fallback = fallbackSrc || getKnownFallback(currentSrc);
      if (fallback && fallback !== currentSrc) {
        setRetryStep(1);
        setCurrentSrc(fallback);
        return;
      }

      // If no local fallback, try stripping query params (in case of stale cache key)
      if (currentSrc.includes('?')) {
        setRetryStep(1);
        setCurrentSrc(currentSrc.split('?')[0]);
        return;
      }

      setHasError(true);
    } else if (retryStep === 1) {
      // Step 2: If stripped query also failed, try local fallback as last resort
      const fallback = fallbackSrc || getKnownFallback(sanitizedSrc);
      if (fallback && fallback !== currentSrc) {
        setRetryStep(2);
        setCurrentSrc(fallback);
        return;
      }
      setHasError(true);
    } else {
      setHasError(true);
    }

    if (props.onError) {
      props.onError(e);
    }
  };

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-600 ${className}`}
        style={{ width: width ? `${width}px` : undefined, height: height ? `${height}px` : undefined }}
        role="img"
        aria-label={alt || 'Image unavailable'}
      >
        <svg
          className="w-8 h-8 opacity-40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={effectiveLoading}
      fetchPriority={effectiveFetchPriority}
      decoding="async"
      onError={handleError}
      {...props}
    />
  );
};

export default OptimizedImage;
