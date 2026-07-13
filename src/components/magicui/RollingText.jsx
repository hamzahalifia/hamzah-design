import React, { useRef } from 'react';

export const RollingText = ({ children, hoverText, className }) => {
  const text = typeof children === 'string' ? children : '';
  const letters = Array.from(text);
  const hoverLetters = typeof hoverText === 'string' ? Array.from(hoverText) : Array.from(text);
  const spansRef = useRef([]);

  const handleMouseEnter = () => {
    spansRef.current.forEach((el, i) => {
      if (!el) return;
      const primary = el.querySelector('[data-primary]');
      const secondary = el.querySelector('[data-secondary]');
      if (primary) {
        primary.style.transition = `transform 300ms cubic-bezier(0.33,1,0.68,1) ${i * 25}ms`;
        primary.style.transform = 'translateY(-100%)';
      }
      if (secondary) {
        secondary.style.transition = `transform 300ms cubic-bezier(0.33,1,0.68,1) ${i * 25}ms`;
        secondary.style.transform = 'translateY(0)';
      }
    });
  };

  const handleMouseLeave = () => {
    spansRef.current.forEach((el, i) => {
      if (!el) return;
      const primary = el.querySelector('[data-primary]');
      const secondary = el.querySelector('[data-secondary]');
      if (primary) {
        primary.style.transition = `transform 300ms cubic-bezier(0.33,1,0.68,1) ${i * 25}ms`;
        primary.style.transform = 'translateY(0)';
      }
      if (secondary) {
        secondary.style.transition = `transform 300ms cubic-bezier(0.33,1,0.68,1) ${i * 25}ms`;
        secondary.style.transform = 'translateY(100%)';
      }
    });
  };

  return (
    <span
      className={`inline-flex items-center select-none cursor-pointer ${className || ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {letters.map((char, index) => {
        if (char === ' ') {
          return (
            <span key={index} className="inline-block">
              &nbsp;
            </span>
          );
        }

        const hoverChar = hoverLetters[index] || char;

        return (
          <span
            key={index}
            ref={el => spansRef.current[index] = el}
            className="relative inline-block overflow-hidden"
            style={{
              height: '1.2em',
              lineHeight: '1.2em',
            }}
          >
            <span
              data-primary
              className="block"
              style={{ transform: 'translateY(0)' }}
            >
              {char}
            </span>
            <span
              data-secondary
              className="absolute top-0 left-0 block"
              style={{ transform: 'translateY(100%)' }}
            >
              {hoverChar}
            </span>
          </span>
        );
      })}
    </span>
  );
};