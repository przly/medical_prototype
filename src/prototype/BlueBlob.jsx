"use client";
import * as React from "react";
import { useEffect, useId, useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
export const ORB_BLUE = "#0198FF";
const EYE_RADIUS = 10;
const MOUTH_PATH = "M 126 162 Q 150 181 174 162";
// Circle centers and points along the smile, including the rounded stroke.
// Bound the complete face, rather than limiting each axis independently.
const FACE_OUTLINE = [
    { x: -37.5, y: -20, radius: EYE_RADIUS },
    { x: 37.5, y: -20, radius: EYE_RADIUS },
    ...Array.from({ length: 33 }, (_, index) => {
        const t = index / 32;
        return { x: -24 + 48 * t, y: 12 + 38 * t * (1 - t), radius: 4.5 };
    }),
];
function getFaceTarget(dx, dy, padding) {
    const distanceSquared = dx * dx + dy * dy;
    if (distanceSquared === 0)
        return { x: 0, y: 0 };
    let amount = 1;
    for (const point of FACE_OUTLINE) {
        const radius = 115 - padding - point.radius;
        const b = 2 * (point.x * dx + point.y * dy);
        const c = point.x * point.x + point.y * point.y - radius * radius;
        const limit = (-b + Math.sqrt(b * b - 4 * distanceSquared * c)) / (2 * distanceSquared);
        amount = Math.min(amount, limit);
    }
    return { x: dx * amount, y: dy * amount };
}
/** Perfectly circular, entirely vector orb. React + Motion; no assets or CSS required. */
export function BlueBlob({ followCursor = true, lookAround = true, blink = true, animated = true, size = 300, color = "#1DA8ED", facePadding = 32, className, style, label = "Bluu orb", }) {
    const svgRef = useRef(null);
    const id = useId().replace(/:/g, "");
    const reducedMotion = useReducedMotion();
    const eyelid = useMotionValue(EYE_RADIUS);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    // A light, highly damped spring: fast response without overshoot or trailing.
    const faceX = useSpring(x, { stiffness: 1100, damping: 42, mass: 0.35 });
    const faceY = useSpring(y, { stiffness: 1100, damping: 42, mass: 0.35 });
    const padding = Math.min(60, Math.max(0, Number.isFinite(facePadding) ? facePadding : 32));
    const canBlink = blink && animated && !reducedMotion;
    const canLookAround = lookAround && animated && !reducedMotion;
    useEffect(() => {
        eyelid.set(EYE_RADIUS);
        if (!canBlink)
            return;
        let timer;
        let animation;
        const schedule = () => {
            timer = window.setTimeout(() => {
                animation = animate(eyelid, [EYE_RADIUS, 0.8, 0.8, EYE_RADIUS], { duration: 0.24, times: [0, 0.3, 0.6, 1], ease: "easeInOut" });
                schedule();
            }, 3800 + Math.random() * 3000);
        };
        schedule();
        return () => {
            window.clearTimeout(timer);
            animation?.stop();
            eyelid.set(EYE_RADIUS);
        };
    }, [canBlink, eyelid]);
    useEffect(() => {
        if (reducedMotion || (!followCursor && !canLookAround)) {
            x.set(0);
            y.set(0);
            return;
        }
        let bounds = svgRef.current?.getBoundingClientRect();
        let idleTimer;
        let glanceX;
        let glanceY;
        const measure = () => { bounds = svgRef.current?.getBoundingClientRect(); };
        const stopIdle = () => {
            window.clearTimeout(idleTimer);
            glanceX?.stop();
            glanceY?.stop();
        };
        const scheduleIdle = (delay) => {
            if (!canLookAround || document.hidden)
                return;
            idleTimer = window.setTimeout(() => {
                if (document.hidden)
                    return;
                const angle = Math.random() * Math.PI * 2;
                const target = Math.random() < 0.2
                    ? { x: 0, y: 0 }
                    : getFaceTarget(Math.cos(angle) * 1000, Math.sin(angle) * 1000, padding);
                const distance = 0.4 + Math.random() * 0.5;
                const transition = { duration: 0.35 + Math.random() * 0.2, ease: "easeInOut" };
                glanceX = animate(x, target.x * distance, transition);
                glanceY = animate(y, target.y * distance, transition);
                scheduleIdle(1400 + Math.random() * 1800);
            }, delay);
        };
        const reset = () => {
            stopIdle();
            if (canLookAround)
                scheduleIdle(700 + Math.random() * 600);
            else {
                x.set(0);
                y.set(0);
            }
        };
        const move = (event) => {
            if (!followCursor)
                return;
            if (!bounds?.width || !bounds.height)
                return;
            // Pointer input always interrupts an automatic glance immediately.
            stopIdle();
            const target = getFaceTarget((event.clientX - bounds.left - bounds.width / 2) * 300 / bounds.width, (event.clientY - bounds.top - bounds.height / 2) * 300 / bounds.height, padding);
            // Set targets immediately on input; Motion updates the DOM without React renders.
            x.set(target.x);
            y.set(target.y);
            scheduleIdle(2200 + Math.random() * 800);
        };
        const leave = (event) => { if (!event.relatedTarget)
            reset(); };
        const visibility = () => {
            stopIdle();
            if (!document.hidden)
                scheduleIdle(1200);
        };
        const observer = new ResizeObserver(measure);
        if (svgRef.current)
            observer.observe(svgRef.current);
        window.addEventListener("pointermove", move, { passive: true });
        window.addEventListener("pointerout", leave, { passive: true });
        window.addEventListener("pointercancel", reset);
        window.addEventListener("blur", reset);
        window.addEventListener("resize", measure, { passive: true });
        window.addEventListener("scroll", measure, { passive: true, capture: true });
        document.addEventListener("visibilitychange", visibility);
        scheduleIdle(1200 + Math.random() * 900);
        return () => {
            stopIdle();
            observer.disconnect();
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerout", leave);
            window.removeEventListener("pointercancel", reset);
            window.removeEventListener("blur", reset);
            window.removeEventListener("resize", measure);
            window.removeEventListener("scroll", measure, true);
            document.removeEventListener("visibilitychange", visibility);
        };
    }, [followCursor, canLookAround, reducedMotion, padding, x, y]);
    return (<div className={className} style={{ width: size, maxWidth: "100%", aspectRatio: "1", display: "inline-block", verticalAlign: "middle", ...style }}>
      <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%" role={label === null ? undefined : "img"} aria-hidden={label === null ? true : undefined} aria-labelledby={label === null ? undefined : `${id}-title`} data-bluu-orb="" style={{ display: "block", overflow: "visible" }}>
        {label !== null ? <title id={`${id}-title`}>{label}</title> : null}
        <defs>
          <radialGradient id={`${id}-glass`} cx="50%" cy="35%" r="65%">
            <stop offset="0" stopColor={color}/>
            <stop offset="0.26" stopColor="#3AB8F6"/>
            <stop offset="0.49" stopColor="#74CCF7"/>
            <stop offset="0.76" stopColor="#CCECFC"/>
            <stop offset="0.94" stopColor="#F5FCFF"/>
            <stop offset="1" stopColor="#FFFFFF"/>
          </radialGradient>
          <radialGradient id={`${id}-rim`} cx="50%" cy="50%" r="50%">
            <stop offset="0.69" stopColor="#FFFFFF" stopOpacity="0"/>
            <stop offset="0.87" stopColor="#F3FCFF" stopOpacity="0.25"/>
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.95"/>
          </radialGradient>
          <filter id={`${id}-halo`} x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation="4"/>
          </filter>
          <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="170%" colorInterpolationFilters="sRGB">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0077C6" floodOpacity="0.28"/>
          </filter>
        </defs>
        <circle cx="150" cy="150" r="115" fill="none" stroke="#D8FAFF" strokeWidth="5" opacity="0.64" filter={`url(#${id}-halo)`}/>
        <circle data-blob-body="" cx="150" cy="150" r="115" fill={`url(#${id}-glass)`} filter={`url(#${id}-shadow)`}/>
        <circle cx="150" cy="150" r="115" fill={`url(#${id}-rim)`}/>
        <circle cx="150" cy="150" r="114.5" fill="none" stroke="#F5FDFF" strokeWidth="1.8" opacity="0.88"/>
        <motion.g data-blob-face="" data-face-padding={padding} style={{ x: faceX, y: faceY }} fill="#FFFFFF">
          <motion.ellipse data-blob-eye="left" cx="112.5" cy="130" rx={EYE_RADIUS} ry={eyelid} style={{ rotate: 0 }}/>
          <motion.ellipse data-blob-eye="right" cx="187.5" cy="130" rx={EYE_RADIUS} ry={eyelid} style={{ rotate: 0 }}/>
          <path data-blob-mouth="" d={MOUTH_PATH} fill="none" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round"/>
        </motion.g>
      </svg>
    </div>);
}
export default BlueBlob;
