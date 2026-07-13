import { useState, useEffect } from 'react';

export default function ScrollProgress({ startRef, endRef }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!startRef?.current || !endRef?.current) return;

    let ticking = false;

    function update() {
      const start = startRef.current.getBoundingClientRect().top + window.scrollY;
      const end = endRef.current.getBoundingClientRect().top + window.scrollY + endRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      
      const scrollY = window.scrollY;
      const totalScrollable = end - windowHeight - start;
      const currentScroll = scrollY - start;
      
      const pct = totalScrollable > 0 ? Math.min(Math.max((currentScroll / totalScrollable) * 100, 0), 100) : 0;
      
      setProgress(pct);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => window.removeEventListener('scroll', onScroll);
  }, [startRef, endRef]);

  return (
    <div
      className="fixed top-[60px] left-0 z-40 h-[2px] w-full bg-neutral-200 dark:bg-neutral-800"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full bg-black dark:bg-white transition-[width] duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
