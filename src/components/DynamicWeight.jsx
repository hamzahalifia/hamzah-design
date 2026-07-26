import * as React from "react";
import { useEffect, useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";

const VARIABLE_FONT_STACK =
    '"Geist Variable", "InterVariableFramer", "Inter Variable", "Inter", system-ui, sans-serif';

const MAX_REACH = 400;

export default function DynamicWeight(props) {
    const {
        label = "More execution.",
        fromWeight = 500,
        toWeight = 700,
        strength = 60,
        fontSize,
        color = "currentColor",
        transition = {
            type: "tween",
            duration: 0.2,
            ease: "easeOut",
        },
        className = "",
        style = {},
    } = props;

    const reach = Math.max(
        1,
        (Math.max(1, Math.min(100, strength)) / 100) * MAX_REACH
    );

    const containerRef = useRef(null);
    const letterRefs = useRef([]);
    const letterFactorsRef = useRef([]);
    const lastFrameRef = useRef(0);
    const mousePositionRef = useRef({ x: -99999, y: -99999 });

    useEffect(() => {
        const updatePosition = (clientX, clientY) => {
            const el = containerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            mousePositionRef.current = {
                x: clientX - rect.left,
                y: clientY - rect.top,
            };
        };

        const handleMouseMove = (ev) => updatePosition(ev.clientX, ev.clientY);
        const handleTouchMove = (ev) => {
            if (ev.touches.length === 0) return;
            updatePosition(ev.touches[0].clientX, ev.touches[0].clientY);
        };
        const handleMouseLeave = () => {
            mousePositionRef.current = { x: -99999, y: -99999 };
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("mouseleave", handleMouseLeave);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    const fromSettings = `'wght' ${fromWeight}`;

    useAnimationFrame((now) => {
        const container = containerRef.current;
        if (!container) return;
        const containerRect = container.getBoundingClientRect();
        const mx = mousePositionRef.current.x;
        const my = mousePositionRef.current.y;

        const prevT = lastFrameRef.current || now;
        const dtSec = Math.min(0.1, Math.max(0, (now - prevT) / 1000));
        lastFrameRef.current = now;

        const tau = Math.max(0.016, transition?.duration ?? 0.2);
        const a = 1 - Math.exp(-dtSec / tau);

        for (let i = 0; i < letterRefs.current.length; i++) {
            const letterEl = letterRefs.current[i];
            if (!letterEl) continue;
            const rect = letterEl.getBoundingClientRect();
            const cx = rect.left + rect.width / 2 - containerRect.left;
            const cy = rect.top + rect.height / 2 - containerRect.top;
            const dx = mx - cx;
            const dy = my - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const target = Math.min(Math.max(1 - dist / reach, 0), 1);
            const prev = letterFactorsRef.current[i] ?? 0;
            const f = prev + (target - prev) * a;
            letterFactorsRef.current[i] = f;

            const w = Math.round(fromWeight + (toWeight - fromWeight) * f);
            if (letterEl.style.fontWeight !== String(w)) {
                letterEl.style.fontWeight = String(w);
            }
            letterEl.style.fontVariationSettings = `'wght' ${w}`;
        }
    });

    const srOnlyStyle = {
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0,0,0,0)",
        whiteSpace: "nowrap",
        borderWidth: 0,
    };

    const innerSpanStyle = {
        fontFamily: VARIABLE_FONT_STACK,
        color,
        textAlign: "center",
        display: "block",
        width: "100%",
        lineHeight: 1.1,
        ...(fontSize ? { fontSize } : {}),
    };

    const words = label ? label.split(" ") : [];
    let letterIndex = 0;

    const handleLocalMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mousePositionRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    return (
        <div
            ref={containerRef}
            className={`pointer-events-auto ${className}`}
            onMouseMove={handleLocalMouseMove}
            onMouseLeave={() => {
                mousePositionRef.current = { x: -99999, y: -99999 };
            }}
            style={{
                position: "relative",
                display: "inline-block",
                cursor: "pointer",
                ...style,
            }}
        >
            {words.length === 0 ? null : (
                <span style={innerSpanStyle}>
                    <span style={srOnlyStyle}>{label}</span>
                    {words.map((word, wi) => {
                        const wordLetters = word.split("");
                        return (
                            <React.Fragment key={wi}>
                                <span
                                    aria-hidden
                                    style={{
                                        display: "inline-block",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {wordLetters.map((letter, li) => {
                                        const idx = letterIndex++;
                                        return (
                                            <motion.span
                                                key={li}
                                                ref={(el) => {
                                                    letterRefs.current[idx] = el;
                                                }}
                                                style={{
                                                    display: "inline-block",
                                                    fontWeight: fromWeight,
                                                    fontVariationSettings: fromSettings,
                                                    transition: "font-weight 0.15s ease-out",
                                                }}
                                            >
                                                {letter}
                                            </motion.span>
                                        );
                                    })}
                                </span>
                                {wi < words.length - 1 && (
                                    <span
                                        aria-hidden
                                        style={{
                                            display: "inline-block",
                                        }}
                                    >
                                        &nbsp;
                                    </span>
                                )}
                            </React.Fragment>
                        );
                    })}
                </span>
            )}
        </div>
    );
}
