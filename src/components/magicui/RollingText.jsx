import React, { useState } from 'react';

export const RollingText = ({ children, hoverText, className }) => {
  const text = typeof children === 'string' ? children : '';
  const letters = Array.from(text);
  const hoverLetters = typeof hoverText === 'string' ? Array.from(hoverText) : Array.from(text);
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className={`inline-flex items-center select-none cursor-pointer ${className || ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
            className="relative inline-block"
            style={{
              height: '1.2em',
              lineHeight: '1.2em',
              overflow: 'hidden',
            }}
          >
            {/* Primary — slides up & out */}
            <span
              className="block"
              style={{
                transition: `transform 300ms cubic-bezier(0.33, 1, 0.68, 1) ${index * 25}ms`,
                transform: hovered ? 'translateY(-100%)' : 'translateY(0)',
              }}
            >
              {char}
            </span>

            {/* Secondary — slides up from below into place */}
            <span
              className="absolute top-0 left-0 block"
              style={{
                transition: `transform 300ms cubic-bezier(0.33, 1, 0.68, 1) ${index * 25}ms`,
                transform: hovered ? 'translateY(0)' : 'translateY(100%)',
              }}
            >
              {hoverChar}
            </span>
          </span>
        );
      })}
    </span>
  );
};