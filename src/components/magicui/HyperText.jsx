import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const HyperText = ({
  children,
  className,
  duration = 0.8,
  delay = 0,
  as: Component = "span",
  startOnHover = true,
  ...props
}) => {
  const [displayText, setDisplayText] = useState(children.split(""));
  const [isAnimating, setIsAnimating] = useState(false);
  const iterations = useRef(0);

  const triggerAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    iterations.current = 0;
  };

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      if (iterations.current < children.length) {
        setDisplayText((prevText) =>
          prevText.map((char, i) => {
            if (char === " ") return " ";
            if (i < iterations.current) {
              return children[i];
            }
            return alphabets[Math.floor(Math.random() * alphabets.length)];
          })
        );
        iterations.current += 0.5;
      } else {
        setDisplayText(children.split(""));
        setIsAnimating(false);
        clearInterval(interval);
      }
    }, (duration * 1000) / (children.length * 2));

    return () => clearInterval(interval);
  }, [children, duration, isAnimating]);

  return (
    <Component
      onMouseEnter={() => {
        if (startOnHover) triggerAnimation();
      }}
      className={cn("inline-block cursor-pointer select-none", className)}
      {...props}
    >
      {displayText.map((letter, i) => (
        <motion.span key={i} className="inline-block">
          {letter}
        </motion.span>
      ))}
    </Component>
  );
};
