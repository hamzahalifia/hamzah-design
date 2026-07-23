import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/utils";

export const FlickeringGrid = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "#6B7280",
  width,
  height,
  className,
  maxOpacity = 0.3,
  speed = 0.05,
  align = "left",
  verticalAlign = "top",
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const memoizedColor = useMemo(() => {
    return color;
  }, [color]);

  const setupCanvas = useCallback(
    (canvas, width, height) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      return ctx;
    },
    []
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId;
    const widthToUse = width || dimensions.width;
    const heightToUse = height || dimensions.height;

    if (widthToUse === 0 || heightToUse === 0) return;

    const ctx = setupCanvas(canvas, widthToUse, heightToUse);
    if (!ctx) return;

    const cols = Math.floor(widthToUse / (squareSize + gridGap));
    const rows = Math.floor(heightToUse / (squareSize + gridGap));

    const currentOpacities = new Float32Array(cols * rows);
    const targetOpacities = new Float32Array(cols * rows);
    for (let i = 0; i < currentOpacities.length; i++) {
      const initialOpacity = Math.random() * maxOpacity;
      currentOpacities[i] = initialOpacity;
      targetOpacities[i] = initialOpacity;
    }

    const draw = () => {
      ctx.clearRect(0, 0, widthToUse, heightToUse);

      const gridWidth = cols * (squareSize + gridGap) - gridGap;
      const gridHeight = rows * (squareSize + gridGap) - gridGap;
      const offsetX = align === "right" ? widthToUse - gridWidth : 0;
      const offsetY = verticalAlign === "bottom" ? heightToUse - gridHeight : 0;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const idx = i * rows + j;
          if (Math.random() < flickerChance) {
            targetOpacities[idx] = Math.random() * maxOpacity;
          }

          // Smoothly interpolate current opacity towards target opacity
          currentOpacities[idx] += (targetOpacities[idx] - currentOpacities[idx]) * speed;

          ctx.fillStyle = memoizedColor;
          ctx.globalAlpha = currentOpacities[idx];
          ctx.fillRect(
            offsetX + i * (squareSize + gridGap),
            offsetY + j * (squareSize + gridGap),
            squareSize,
            squareSize
          );
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    dimensions,
    squareSize,
    gridGap,
    flickerChance,
    memoizedColor,
    maxOpacity,
    speed,
    setupCanvas,
    width,
    height,
    align,
    verticalAlign,
  ]);

  return (
    <div ref={containerRef} className={cn("h-full w-full pointer-events-none", className)}>
      <canvas ref={canvasRef} className="pointer-events-none" />
    </div>
  );
};
