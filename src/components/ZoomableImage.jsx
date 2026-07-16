import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function ZoomableImage({ src, alt, className = "" }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const touchStartRef = useRef({ distance: 0, scale: 1, x: 0, y: 0, posX: 0, posY: 0 });
  const mouseStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0, isDragging: false });

  // Reset zoom when image source changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [src]);

  // Attach non-passive wheel event listener to prevent page scrolling on zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const zoomIntensity = 0.15;
      const delta = -e.deltaY;
      
      setScale((prevScale) => {
        const nextScale = Math.min(Math.max(prevScale + (delta > 0 ? zoomIntensity : -zoomIntensity), 1), 5);
        if (nextScale === 1) {
          setPosition({ x: 0, y: 0 });
        }
        return nextScale;
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // Pinch gesture
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const distance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      touchStartRef.current = {
        distance,
        scale,
        x: 0,
        y: 0,
        posX: position.x,
        posY: position.y
      };
    } else if (e.touches.length === 1 && scale > 1) {
      // Pan gesture
      const t = e.touches[0];
      touchStartRef.current = {
        distance: 0,
        scale,
        x: t.clientX,
        y: t.clientY,
        posX: position.x,
        posY: position.y
      };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const distance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const factor = distance / touchStartRef.current.distance;
      
      setScale((prevScale) => {
        const nextScale = Math.min(Math.max(touchStartRef.current.scale * factor, 1), 5);
        if (nextScale === 1) {
          setPosition({ x: 0, y: 0 });
        }
        return nextScale;
      });
    } else if (e.touches.length === 1 && scale > 1) {
      e.preventDefault();
      const t = e.touches[0];
      const dx = t.clientX - touchStartRef.current.x;
      const dy = t.clientY - touchStartRef.current.y;
      setPosition({
        x: touchStartRef.current.posX + dx,
        y: touchStartRef.current.posY + dy
      });
    }
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      e.preventDefault();
      mouseStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        posX: position.x,
        posY: position.y,
        isDragging: true
      };
    }
  };

  const handleMouseMove = (e) => {
    if (mouseStartRef.current.isDragging && scale > 1) {
      e.preventDefault();
      const dx = e.clientX - mouseStartRef.current.x;
      const dy = e.clientY - mouseStartRef.current.y;
      setPosition({
        x: mouseStartRef.current.posX + dx,
        y: mouseStartRef.current.posY + dy
      });
    }
  };

  const handleMouseUpOrLeave = () => {
    mouseStartRef.current.isDragging = false;
  };

  const handleDoubleClick = () => {
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2.5);
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onDoubleClick={handleDoubleClick}
      className="w-full h-full overflow-hidden flex items-center justify-center relative cursor-grab active:cursor-grabbing"
      style={{ touchAction: "none" }}
    >
      <motion.img
        src={src}
        alt={alt}
        animate={{
          scale,
          x: position.x,
          y: position.y
        }}
        transition={{ type: "spring", stiffness: 400, damping: 35, mass: 0.3 }}
        className={`max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/5 pointer-events-none select-none ${className}`}
      />

      {/* Floating reset indicator when zoomed */}
      {scale > 1 && (
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full pointer-events-none select-none z-30">
          Zoom: {Math.round(scale * 100)}% (Double-click to reset)
        </div>
      )}
    </div>
  );
}
