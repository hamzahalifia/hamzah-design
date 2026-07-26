import React, { useEffect } from 'react';

export function GlowInitializer() {
  useEffect(() => {
    let items = [];
    
    const updateElements = () => {
      const selectors = '.glow-border, .glow-border-b, .glow-border-r, .glow-border-l, .glow-border-t, [data-glow-card]';
      const els = document.querySelectorAll(selectors);
      items = Array.from(els).map(el => ({
        element: el,
        rect: el.getBoundingClientRect()
      }));
    };

    updateElements();

    window.addEventListener('resize', updateElements);
    window.addEventListener('scroll', updateElements, { passive: true });
    
    // Watch for DOM mutations (like route changes or dynamic content loadings) to re-index items
    const observer = new MutationObserver(updateElements);
    observer.observe(document.body, { childList: true, subtree: true });

    const handleMouseMove = (e) => {
      for (const item of items) {
        if (!item.element) continue;
        const rect = item.rect;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        item.element.style.setProperty('--mouse-x', `${x}px`);
        item.element.style.setProperty('--mouse-y', `${y}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', updateElements);
      window.removeEventListener('scroll', updateElements);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return null;
}

export default GlowInitializer;
