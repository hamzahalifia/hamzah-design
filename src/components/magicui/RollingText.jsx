import React from 'react';

export const RollingText = ({ children, className }) => {
  const text = typeof children === 'string' ? children : '';
  const letters = Array.from(text);

  return (
    <span className={`inline-flex items-center select-none group/roll cursor-pointer ${className || ''}`}>
      {letters.map((char, index) => {
        if (char === ' ') {
          return <span key={index} className="inline-block">&nbsp;</span>;
        }

        return (
          <span
            key={index}
            className="relative inline-block overflow-hidden"
            style={{ height: '1.2em', lineHeight: '1.2em' }}
          >
            {/* Primary Character Rolling Up */}
            <span
              style={{
                transitionDelay: `${index * 25}ms`,
              }}
              className="block transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] transform translate-y-0 group-hover/roll:-translate-y-full"
            >
              {char}
            </span>

            {/* Secondary Character Rolling In from Below */}
            <span
              style={{
                transitionDelay: `${index * 25}ms`,
              }}
              className="absolute inset-0 block transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] transform translate-y-full group-hover/roll:translate-y-0"
            >
              {char}
            </span>
          </span>
        );
      })}
    </span>
  );
};
