import React, { useEffect, useRef } from 'react';
import { playClickSound, playHoverSound, playScrollSound } from '../lib/sound';

export default function SoundManager() {
  const lastHoveredElement = useRef(null);
  const lastScrollY = useRef(0);
  const lastScrollX = useRef(0);
  const scrollAccumulator = useRef(0);
  const lastScrollTime = useRef(0);

  useEffect(() => {
    // 1. Hover listener (Event delegation using mouseover/mouseout)
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      // Find closest interactive element
      const interactive = target.closest('a, button, [role="button"], [data-clickable], .cursor-pointer, .clickable-component, .sound-trigger');

      if (interactive) {
        if (interactive !== lastHoveredElement.current) {
          lastHoveredElement.current = interactive;
          playHoverSound();
        }
      } else {
        lastHoveredElement.current = null;
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      const relatedTarget = e.relatedTarget;

      // If we move completely outside the interactive element, clear the ref
      if (lastHoveredElement.current && (!relatedTarget || !lastHoveredElement.current.contains(relatedTarget))) {
        lastHoveredElement.current = null;
      }
    };

    // 2. Click listener
    const handleClick = (e) => {
      const target = e.target;
      if (!target) return;

      const interactive = target.closest('a, button, [role="button"], [data-clickable], .cursor-pointer, .clickable-component, .sound-trigger');
      if (interactive) {
        playClickSound();
      }
    };

    // 3. Scroll listener
    lastScrollY.current = window.scrollY;
    lastScrollX.current = window.scrollX;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentScrollX = window.scrollX;
      
      const deltaY = Math.abs(currentScrollY - lastScrollY.current);
      const deltaX = Math.abs(currentScrollX - lastScrollX.current);
      
      scrollAccumulator.current += deltaY + deltaX;
      
      lastScrollY.current = currentScrollY;
      lastScrollX.current = currentScrollX;

      // Play tick sound every 60px of scrolling
      if (scrollAccumulator.current >= 60) {
        const now = Date.now();
        // Throttle to maximum once every 60ms to prevent audio glitches / overlap
        if (now - lastScrollTime.current > 60) {
          playScrollSound();
          lastScrollTime.current = now;
        }
        scrollAccumulator.current = 0;
      }
    };

    // Attach listeners
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick, { capture: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Clean up
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick, { capture: true });
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null; // This component registers listeners and doesn't render visual content
}
