import React from 'react';

// Your ImageKit URL Endpoint
const IMAGEKIT_ENDPOINT = 'https://ik.imagekit.io/nr1gjsmwr/';

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
  if (!src) {
    return null;
  }

  // If the src is not from our CMS, use it as is (e.g., local images, SVGs).
  if (!src.startsWith(import.meta.env.PUBLIC_PAYLOAD_BASE_URL || import.meta.env.VITE_CMS_BASE_URL)) {
    return (
      <img
        src={src}
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
    const urlObject = new URL(src);
    imagePath = urlObject.pathname;
  } catch (e) {
    // Falls back for relative paths like "/media/image.webp"
    imagePath = src;
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
