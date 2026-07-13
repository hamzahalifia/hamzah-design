import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export function Tilt({
  children,
  rotationFactor = 8,
  isRevese = false,
  className,
  ...props
}) {
  const ref = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = useCallback(
    (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const offsetX = (e.clientX - centerX) / (rect.width / 2);
      const offsetY = (e.clientY - centerY) / (rect.height / 2);

      const factor = isRevese ? -rotationFactor : rotationFactor;
      setRotateY(offsetX * factor);
      setRotateX(-offsetY * factor);
    },
    [rotationFactor, isRevese]
  );

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ perspective: 1000 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default Tilt;