import React from 'react';

const SkeletonLoader = ({ className }) => {
  return (
    <div
      className={`bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-md ${className}`}
    />
  );
};

export default SkeletonLoader;
