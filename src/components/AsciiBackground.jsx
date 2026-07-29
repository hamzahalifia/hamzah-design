import React, { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

// --- Fast 2D Simplex Noise Generator ---
const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

const grad2 = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const p = new Uint8Array(256);
for (let i = 0; i < 256; i++) p[i] = Math.floor(Math.random() * 256);
const perm = new Uint8Array(512);
const permMod12 = new Uint8Array(512);
for (let i = 0; i < 512; i++) {
  perm[i] = p[i & 255];
  permMod12[i] = perm[i] % 8;
}

function simplex2D(xin, yin) {
  let n0 = 0,
    n1 = 0,
    n2 = 0;
  const s = (xin + yin) * F2;
  const i = Math.floor(xin + s);
  const j = Math.floor(yin + s);
  const t = (i + j) * G2;
  const X0 = i - t;
  const Y0 = j - t;
  const x0 = xin - X0;
  const y0 = yin - Y0;

  let i1, j1;
  if (x0 > y0) {
    i1 = 1;
    j1 = 0;
  } else {
    i1 = 0;
    j1 = 1;
  }

  const x1 = x0 - i1 + G2;
  const y1 = y0 - j1 + G2;
  const x2 = x0 - 1.0 + 2.0 * G2;
  const y2 = y0 - 1.0 + 2.0 * G2;

  const ii = i & 255;
  const jj = j & 255;
  const gi0 = permMod12[ii + perm[jj]];
  const gi1 = permMod12[ii + i1 + perm[jj + j1]];
  const gi2 = permMod12[ii + 1 + perm[jj + 1]];

  let t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 >= 0) {
    t0 *= t0;
    n0 = t0 * t0 * (grad2[gi0][0] * x0 + grad2[gi0][1] * y0);
  }

  let t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 >= 0) {
    t1 *= t1;
    n1 = t1 * t1 * (grad2[gi1][0] * x1 + grad2[gi1][1] * y1);
  }

  let t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 >= 0) {
    t2 *= t2;
    n2 = t2 * t2 * (grad2[gi2][0] * x2 + grad2[gi2][1] * y2);
  }

  return 70.0 * (n0 + n1 + n2);
}

export default function AsciiBackground({
  imageSrc = "/images/general/footer_acsii.webp",
  fontSize = 11,
  brightness = 0.04,
  contrast = 1.28,
  fxStrength = 0.45,
  noiseScale = 22,
  noiseSpeed = 0.6,
  hoverStrength = 49,
  areaSize = 449,
  spread = 1.35,
  spacing = 1.30, // Increased character spacing for better readability
  className = "",
}) {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const mousePosRef = useRef({ x: -9999, y: -9999, active: false });
  const pulsesRef = useRef([]); // Click vortex pulses
  const animFrameRef = useRef(null);
  const hoverActiveFactorRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let isComponentMounted = true;
    let imgDataCache = null; // Float32Array of image luminance
    let imgWidth = 0;
    let imgHeight = 0;

    // Load source image offscreen
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
      if (!isComponentMounted) return;

      const offCanvas = document.createElement("canvas");
      const offCtx = offCanvas.getContext("2d");

      // High quality sampling resolution
      const maxDim = 800;
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }

      offCanvas.width = w;
      offCanvas.height = h;
      offCtx.drawImage(img, 0, 0, w, h);

      const pixels = offCtx.getImageData(0, 0, w, h).data;
      imgWidth = w;
      imgHeight = h;

      const lumArray = new Float32Array(w * h);
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3] / 255;
        // Grayscale luminance
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        lumArray[i / 4] = lum * a;
      }
      imgDataCache = lumArray;
    };

    // Responsive Canvas Resize
    const handleResize = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Mouse events
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mousePosRef.current.active = false;
    };

    // Click handler for localized boom effect (compounds on spam click)
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let nearbyCount = 0;
      pulsesRef.current.forEach((p) => {
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 150) {
          nearbyCount++;
          // Boost existing pulse strength and maxRadius
          p.strength = Math.min(p.strength + 0.4, 3.5);
          p.maxRadius = Math.min(p.maxRadius + 30, 250);
        }
      });

      const strength = 1.0 + nearbyCount * 0.5;
      const maxRadius = Math.min(100 + nearbyCount * 25, 220);
      const speed = 350 + nearbyCount * 50;

      pulsesRef.current.push({
        x: clickX,
        y: clickY,
        radius: 0,
        maxRadius: maxRadius,
        speed: speed,
        strength: strength,
        state: "expanding",
        holdTime: 0.35,
        fadeTime: 0.35,
        holdElapsed: 0,
        fadeElapsed: 0,
      });
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("click", handleClick);

    // Main Animation / Render Loop
    let lastTime = performance.now();
    let startTime = performance.now();

    const render = (now) => {
      if (!isComponentMounted) return;

      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsed = (now - startTime) / 1000;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!imgDataCache || imgWidth === 0 || imgHeight === 0) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      // Update active click vortex pulses (expanding, holding, and fading states)
      for (let i = pulsesRef.current.length - 1; i >= 0; i--) {
        const p = pulsesRef.current[i];
        if (p.state === "expanding") {
          p.radius += p.speed * dt;
          if (p.radius >= p.maxRadius) {
            p.radius = p.maxRadius;
            p.state = "holding";
          }
        } else if (p.state === "holding") {
          p.holdElapsed += dt;
          if (p.holdElapsed >= p.holdTime) {
            p.state = "fading";
          }
        } else if (p.state === "fading") {
          p.fadeElapsed += dt;
          if (p.fadeElapsed >= p.fadeTime) {
            pulsesRef.current.splice(i, 1);
          }
        }
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // --- Spaced Character Dimensions ---
      const charWidth = fontSize * 0.75 * spacing;
      const charHeight = fontSize * 1.25 * spacing;

      const cols = Math.floor(width / charWidth);
      const rows = Math.floor(height / charHeight);

      // --- Object-Fit: COVER calculation ---
      const scaleX = width / imgWidth;
      const scaleY = height / imgHeight;
      const coverScale = Math.max(scaleX, scaleY); // FILL container!

      const sampleW = width / coverScale;
      const sampleH = height / coverScale;
      const offsetX = (imgWidth - sampleW) / 2;
      const offsetY = (imgHeight - sampleH) / 2;

      ctx.font = `${fontSize}px Inter, Geist, monospace`;
      ctx.textBaseline = "top";

      const mouse = mousePosRef.current;
      const isMouseActive = mouse.active && mouse.x >= 0 && mouse.y >= 0;
      const activePulses = pulsesRef.current;

      // Smoothly interpolate hover active factor for fluid cursor entry/exit transition
      if (isMouseActive) {
        hoverActiveFactorRef.current += (1.0 - hoverActiveFactorRef.current) * 8.0 * dt;
      } else {
        hoverActiveFactorRef.current += (0.0 - hoverActiveFactorRef.current) * 8.0 * dt;
      }
      const hoverFactor = hoverActiveFactorRef.current;

      const t = elapsed * noiseSpeed;
      const isDark = theme === "dark";

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const normX = c / cols;
          const normY = r / rows;

          // Static Image sampling
          const srcX = Math.floor(offsetX + normX * sampleW);
          const srcY = Math.floor(offsetY + normY * sampleH);

          const clampedSrcX = Math.min(Math.max(srcX, 0), imgWidth - 1);
          const clampedSrcY = Math.min(Math.max(srcY, 0), imgHeight - 1);

          let lum = imgDataCache[clampedSrcY * imgWidth + clampedSrcX];

          // Contrast & Brightness adjustment
          lum = (lum - 0.5) * contrast + 0.5 + brightness;
          lum = Math.min(Math.max(lum, 0), 1);

          // Noise Field FX moving → (horizontally modulating binary intensity)
          const nVal = simplex2D(
            normX * noiseScale - t,
            normY * noiseScale * 0.5,
          );
          const activeLum = Math.min(
            Math.max(lum + nVal * fxStrength * 0.2, 0),
            1,
          );

          let posX = c * charWidth;
          let posY = r * charHeight;

          // --- Localized Click Boom Effect ---
          if (activePulses.length > 0) {
            for (let pi = 0; pi < activePulses.length; pi++) {
              const pulse = activePulses[pi];
              const pdx = posX - pulse.x;
              const pdy = posY - pulse.y;
              const pdist = Math.sqrt(pdx * pdx + pdy * pdy);

              if (pdist < pulse.radius && pdist > 0.001) {
                let decay = 1.0;
                if (pulse.state === "expanding") {
                  decay = 1.0 - (pulse.radius / pulse.maxRadius) * 0.2; // slight decay during expansion
                } else if (pulse.state === "holding") {
                  decay = 0.8;
                } else if (pulse.state === "fading") {
                  const fadeProgress = pulse.fadeElapsed / pulse.fadeTime;
                  decay = 0.8 * (1.0 - fadeProgress);
                }

                const distanceFactor = 1.0 - pdist / pulse.radius;
                const intensity = distanceFactor * decay * pulse.strength;

                // Push force outward from center
                const pushForce = intensity * 95;
                posX += (pdx / pdist) * pushForce;
                posY += (pdy / pdist) * pushForce;
              }
            }
          }

          // --- Mouse Hover Attract Effect ---
          if (hoverFactor > 0.001) {
            const dx = mouse.x - posX;
            const dy = mouse.y - posY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < areaSize && dist > 0.001) {
              const normDist = dist / areaSize;
              const force = Math.pow(1.0 - normDist, spread);
              const pullAmount = force * hoverStrength * hoverFactor;

              posX += (dx / dist) * pullAmount;
              posY += (dy / dist) * pullAmount;
            }
          }

          // --- Binary Character Selection & Color Mapping ---
          let charDigit = "0";

          // Deterministic binary variation using grid hash
          const bitHash = ((c * 31 + r * 17 + Math.floor(elapsed * 2)) & 1);

          if (activeLum > 0.38) {
            charDigit = bitHash === 0 ? "1" : "0";
          } else if (activeLum > 0.18) {
            charDigit = "0";
          } else {
            charDigit = bitHash === 0 ? "0" : "1";
          }

          // Color & Opacity styling for Dark Mode vs Light Mode
          let fillStyle = "";
          if (isDark) {
            if (activeLum > 0.4) {
              fillStyle = "rgba(255, 255, 255, 0.92)"; // Crisp bright 0/1
            } else if (activeLum > 0.2) {
              fillStyle = "rgba(255, 255, 255, 0.50)"; // Mid-tone 0/1
            } else if (activeLum > 0.08) {
              fillStyle = "rgba(255, 255, 255, 0.18)"; // Faint background 0/1
            } else {
              fillStyle = "rgba(255, 255, 255, 0.05)"; // Ultra faint 0/1
            }
          } else {
            // Light Mode Polish
            if (activeLum > 0.4) {
              fillStyle = "rgba(15, 23, 42, 0.92)"; // Deep dark slate 0/1
            } else if (activeLum > 0.2) {
              fillStyle = "rgba(51, 65, 85, 0.55)"; // Medium slate 0/1
            } else if (activeLum > 0.08) {
              fillStyle = "rgba(148, 163, 184, 0.22)"; // Light slate background 0/1
            } else {
              fillStyle = "rgba(203, 213, 225, 0.10)"; // Faint light mode 0/1
            }
          }

          ctx.fillStyle = fillStyle;
          ctx.fillText(charDigit, posX, posY);
        }
      }



      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isComponentMounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
        canvas.removeEventListener("click", handleClick);
      }
    };
  }, [
    imageSrc,
    fontSize,
    brightness,
    contrast,
    fxStrength,
    noiseScale,
    noiseSpeed,
    hoverStrength,
    areaSize,
    spread,
    spacing,
    theme,
  ]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="block w-full h-full pointer-events-auto cursor-pointer"
      />
    </div>
  );
}
