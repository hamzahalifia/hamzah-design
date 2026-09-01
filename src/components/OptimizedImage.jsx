import React from 'react';

// Your ImageKit URL Endpoint
const IMAGEKIT_ENDPOINT = 'https://ik.imagekit.io/nr1gjsmwr/';
const DEFAULT_CMS_BASE = 'https://hamzah-design-cms.vercel.app';

function sanitizeCmsUrl(url = '') {
  if (!url) return '';
  return String(url).replace(/https?:\/\/hamzah-design-cms\.onrender\.com/g, DEFAULT_CMS_BASE);
}

const RAW_CMS_BASE =
  import.meta.env.PUBLIC_PAYLOAD_BASE_URL ||
  DEFAULT_CMS_BASE;
const CMS_BASE = sanitizeCmsUrl(RAW_CMS_BASE) || DEFAULT_CMS_BASE;
const R2_ENDPOINT =
  import.meta.env.PUBLIC_R2_ENDPOINT ||
  '';
const R2_BUCKET = import.meta.env.PUBLIC_R2_BUCKET || '';

function trimSlashes(value = '') {
  return value.replace(/^\/+|\/+$/g, '');
}

function getOptimizableBases() {
  const bases = [CMS_BASE, R2_ENDPOINT]
    .filter(Boolean)
    .map((base) => base.replace(/\/+$/g, ''));

  if (R2_ENDPOINT && R2_BUCKET) {
    bases.push(`${R2_ENDPOINT.replace(/\/+$/g, '')}/${trimSlashes(R2_BUCKET)}`);
  }

  return bases;
}

/**
 * A component to automatically optimize images from the CMS using ImageKit.
 * It transforms URLs to use ImageKit's real-time optimization.
 * 
 * @param {string} src - The original image URL from the CMS.
 * @param {string} alt - The alt text for the image.
 * @param {number} [width] - The display width of the image.
 * @param {number} [height] - The display height of the image.
 * @param {string} [className] - CSS classes for styling.
 * @param {'lazy'|'eager'} [loading='lazy'] - The native loading attribute.
 * @param {'high'|'low'|'auto'} [fetchpriority] - The fetch priority hint.
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  fetchpriority,
  ...props
}) => {
  const sanitizedSrc = sanitizeCmsUrl(src);
  if (!sanitizedSrc) {
    return null;
  }

  // If the src is not from our CMS, use it as is (e.g., local images, SVGs).
  const optimizableBases = getOptimizableBases();
  const shouldOptimize = optimizableBases.some((base) => sanitizedSrc.startsWith(base));

  if (!shouldOptimize) {
    return (
      <img
        src={sanitizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={loading}
        fetchpriority={fetchpriority}
        {...props}
      />
    );
  }

  // Construct the ImageKit URL
  let imagePath;
  try {
    // Works for absolute URLs like "https://..."
    const urlObject = new URL(sanitizedSrc);
    imagePath = urlObject.pathname;
  } catch (e) {
    // Falls back for relative paths like "/media/image.webp"
    imagePath = sanitizedSrc;
  }
  
  // Define ImageKit transformations
  // f-auto: Automatically selects the best format (AVIF/WebP).
  // q-auto: Automatically adjusts quality.
  // w-auto: Responsive width based on container.
  // dpr-auto: Adjusts for device pixel ratio.
  const transformation = `tr:f-auto,q-auto,w-auto,dpr-auto`;

  const optimizedSrc = `${IMAGEKIT_ENDPOINT}${transformation}${imagePath}`;

  // For LCP elements, we must use 'eager' loading, not 'lazy'.
  const effectiveLoading = fetchpriority === 'high' ? 'eager' : loading;

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={effectiveLoading}
      fetchpriority={fetchpriority}
      {...props}
    />
  );
};

export default OptimizedImage;
