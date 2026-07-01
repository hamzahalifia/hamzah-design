import React, { useCallback, useEffect, useMemo, useRef } from "react";
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
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

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
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animationFrameId;
    let widthToUse = width || container.clientWidth;
    let heightToUse = height || container.clientHeight;

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
            i * (squareSize + gridGap),
            j * (squareSize + gridGap),
            squareSize,
            squareSize
          );
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!container) return;
      widthToUse = width || container.clientWidth;
      heightToUse = height || container.clientHeight;
      setupCanvas(canvas, widthToUse, heightToUse);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [squareSize, gridGap, flickerChance, memoizedColor, maxOpacity, speed, setupCanvas, width, height]);

  return (
    <div ref={containerRef} className={cn("h-full w-full pointer-events-none", className)}>
      <canvas ref={canvasRef} className="pointer-events-none" />
    </div>
  );
};
