"use client";

// Adapted from uselayouts "get-in-touch": the label blurs away, the portrait and a "YOU" chip
// spin in and merge, then the hover text slides out. Restyled with site tokens.
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const END_STATE_DELAY_MS = 460;

const textTransition = { duration: 0.24, ease: [0.2, 0, 0, 1] } as const;
const avatarSpring = { type: "spring", stiffness: 460, damping: 26, mass: 0.8 } as const;
const mergeSpring = { type: "spring", stiffness: 540, damping: 32 } as const;
const slideSpring = { type: "spring", stiffness: 360, damping: 17, mass: 0.9 } as const;

const CLUSTER_CENTER_X = 32;
const HOVER_TEXT_DELAY = 0.2;

type Phase = "idle" | "start" | "end";

export function GetInTouchLink({
  href,
  imageSrc = "/richard-portrait.jpg",
  defaultText = "Get in touch",
  hoverText = "Let's talk!",
  className,
}: {
  href: string;
  imageSrc?: string;
  defaultText?: string;
  hoverText?: string;
  className?: string;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoveredRef = useRef(false);
  const focusedRef = useRef(false);
  const reduceMotion = useReducedMotion();

  const updatePhase = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  const clearTimer = () => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const start = () => {
    if (phaseRef.current !== "idle") return;
    clearTimer();
    if (reduceMotion) {
      updatePhase("end");
      return;
    }
    updatePhase("start");
    timerRef.current = setTimeout(() => {
      updatePhase("end");
      timerRef.current = null;
    }, END_STATE_DELAY_MS);
  };

  const end = () => {
    if (hoveredRef.current || focusedRef.current) return;
    clearTimer();
    updatePhase("idle");
  };

  useEffect(() => clearTimer, []);

  const isActive = phase !== "idle";
  const isEnd = phase === "end";
  const withMotion = <T extends object>(transition: T) => (reduceMotion ? ({ duration: 0 } as const) : transition);

  return (
    <a
      href={href}
      aria-label={defaultText}
      data-phase={phase}
      onMouseEnter={() => {
        hoveredRef.current = true;
        start();
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
        end();
      }}
      onFocus={() => {
        focusedRef.current = true;
        start();
      }}
      onBlur={() => {
        focusedRef.current = false;
        end();
      }}
      className={cn(
        "relative isolate inline-flex h-12 w-full min-w-48 shrink-0 items-center justify-center overflow-hidden bg-accent font-semibold text-on-accent no-underline outline-none hover:text-on-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-invert active:scale-[0.98] sm:h-14 sm:w-auto",
        className,
      )}
    >
      {/* Invisible copy sizes the pill to its label. */}
      <span aria-hidden="true" className="invisible px-7 whitespace-nowrap">
        {defaultText}
      </span>

      <motion.span
        initial={false}
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
        animate={{
          opacity: isActive ? 0 : 1,
          y: isActive ? -28 : 0,
          filter: isActive ? "blur(4px)" : "blur(0px)",
        }}
        transition={withMotion(textTransition)}
      >
        {defaultText}
      </motion.span>

      <motion.span
        initial={false}
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-start pl-2 text-xs opacity-0"
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={withMotion(textTransition)}
      >
        <motion.span
          initial={false}
          className="flex shrink-0 items-center justify-center"
          animate={{ x: isEnd ? 0 : CLUSTER_CENTER_X }}
          transition={withMotion(slideSpring)}
        >
          <motion.span
            initial={false}
            className="relative z-0 block size-10 shrink-0 overflow-hidden rounded-full"
            animate={{ opacity: isActive ? 1 : 0, rotate: isActive ? 0 : -180, x: isActive ? 0 : -40 }}
            transition={withMotion({ ...avatarSpring, delay: isActive ? 0.04 : 0 })}
          >
            <Image src={imageSrc} alt="" fill sizes="40px" draggable={false} className="object-cover" />
          </motion.span>

          <motion.span
            initial={false}
            className="block overflow-hidden text-center text-base"
            animate={{
              opacity: isActive && !isEnd ? 1 : 0,
              scale: isActive && !isEnd ? 1 : 0.6,
              width: isActive && !isEnd ? 18 : 0,
              marginLeft: isActive && !isEnd ? 8 : 0,
              marginRight: isActive && !isEnd ? 8 : 0,
            }}
            transition={withMotion({
              ...mergeSpring,
              opacity: textTransition,
              delay: isActive && !isEnd ? 0.14 : 0,
            })}
          >
            +
          </motion.span>

          <motion.span
            initial={false}
            className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-invert-ink text-invert"
            animate={{
              opacity: isActive ? 1 : 0,
              rotate: isActive ? 0 : 180,
              x: isActive ? 0 : 40,
              marginLeft: isEnd ? -12 : 0,
            }}
            transition={withMotion({
              ...avatarSpring,
              marginLeft: mergeSpring,
              delay: isActive && !isEnd ? 0.1 : 0,
            })}
          >
            YOU
          </motion.span>
        </motion.span>

        <motion.span
          initial={false}
          className="block overflow-hidden text-sm whitespace-nowrap"
          animate={{ width: isEnd ? "auto" : 0, marginLeft: isEnd ? 10 : 0, opacity: isEnd ? 1 : 0 }}
          transition={withMotion({
            width: { ...textTransition, delay: isEnd ? HOVER_TEXT_DELAY : 0 },
            marginLeft: { ...textTransition, delay: isEnd ? HOVER_TEXT_DELAY : 0 },
            opacity: { ...textTransition, delay: isEnd ? HOVER_TEXT_DELAY : 0 },
          })}
        >
          {hoverText}
        </motion.span>
      </motion.span>
    </a>
  );
}
