import React from 'react';

const PIXEL_FONT_STYLES = {
  square: {
    fontFamily: '"Courier New", Courier, monospace',
    letterSpacing: '0.05em',
    textShadow: '1px 0 0 currentColor',
  },
  grid: {
    fontFamily: 'monospace',
    letterSpacing: '0.03em',
    textShadow: '1px 1px 0 rgba(0,0,0,0.15), -1px -1px 0 rgba(0,0,0,0.15)',
  },
  circle: {
    fontFamily: 'monospace',
    letterSpacing: '0.04em',
    textShadow: '1px 0 0 currentColor, -1px 0 0 currentColor',
  },
  triangle: {
    fontFamily: 'monospace',
    letterSpacing: '0.02em',
    textShadow: '1px 0 0 currentColor, 0 -1px 0 currentColor, -1px 0 0 currentColor',
  },
  line: {
    fontFamily: 'monospace',
    letterSpacing: '0.06em',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
    textDecorationThickness: '1px',
  },
};

export function PixelParagraph({
  text = '',
  pixelWords = [],
  font = 'square',
  as: Tag = 'p',
  className = '',
  pixelWordClassName = '',
}) {
  // Split text preserving spaces and punctuation
  const parts = text.split(/(\s+)/);

  const pixelStyle = PIXEL_FONT_STYLES[font] || PIXEL_FONT_STYLES.square;

  return (
    <Tag className={className}>
      {parts.map((part, idx) => {
        // Preserve whitespace as-is
        if (/^\s+$/.test(part)) {
          return part;
        }

        // Check if this word (stripped of trailing punctuation) matches any pixel word
        const cleanWord = part.replace(/[.,!?;:'"]+$/, '');
        const trailingPunctuation = part.slice(cleanWord.length);
        const isPixel = pixelWords.some(
          (pw) => pw.toLowerCase() === cleanWord.toLowerCase()
        );

        if (isPixel) {
          return (
            <React.Fragment key={idx}>
              <span
                className={pixelWordClassName}
                style={pixelStyle}
              >
                {cleanWord}
              </span>
              {trailingPunctuation}
            </React.Fragment>
          );
        }

        return part;
      })}
    </Tag>
  );
}

export default PixelParagraph;