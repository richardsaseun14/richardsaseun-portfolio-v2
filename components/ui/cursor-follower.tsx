"use client";

import { useEffect, useRef, useState } from "react";

const DOT_SMOOTHNESS = 0.2;
const RING_SMOOTHNESS = 0.1;
const INTERACTIVE = "a, button, img, input, textarea, select, [role='button']";

const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;
/** Scales a per-60fps-frame smoothing factor to the real frame time, so speed matches on any refresh rate. */
const frameFactor = (smoothness: number, dtMs: number) => 1 - Math.pow(1 - smoothness, (dtMs * 60) / 1000);

/**
 * Dot + ring that trail the pointer; the ring grows over interactive elements.
 * Positions are written straight to the DOM each frame so the loop never re-renders React.
 */
export function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const mouse = { x: 0, y: 0 };
    const dot = { x: 0, y: 0 };
    const ring = { x: 0, y: 0 };
    let started = false;
    let frame = 0;
    let last = performance.now();

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!started) {
        // Snap on first move so the follower doesn't fly in from the corner.
        Object.assign(dot, mouse);
        Object.assign(ring, mouse);
        started = true;
      }
      setVisible(true);
    };
    // Delegated, so links rendered after a route change still count.
    const onOver = (e: PointerEvent) => {
      setHovering(e.target instanceof Element && e.target.closest(INTERACTIVE) !== null);
    };
    const onLeave = () => setVisible(false);

    const tick = (now: number) => {
      // Clamp so a backgrounded tab doesn't jump on return.
      const dt = Math.min(now - last, 100);
      last = now;
      const dotF = frameFactor(DOT_SMOOTHNESS, dt);
      const ringF = frameFactor(RING_SMOOTHNESS, dt);
      dot.x = lerp(dot.x, mouse.x, dotF);
      dot.y = lerp(dot.y, mouse.y, dotF);
      ring.x = lerp(ring.x, mouse.x, ringF);
      ring.y = lerp(ring.y, mouse.y, ringF);
      if (dotRef.current) dotRef.current.style.transform = `translate(${dot.x}px, ${dot.y}px) translate(-50%, -50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%, -50%)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-200"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div ref={dotRef} className="absolute top-0 left-0 size-2 rounded-full bg-ink will-change-transform" />
      <div
        ref={ringRef}
        className="absolute top-0 left-0 rounded-full border border-ink will-change-transform transition-[width,height] duration-300"
        style={{ width: hovering ? 44 : 28, height: hovering ? 44 : 28 }}
      />
    </div>
  );
}
