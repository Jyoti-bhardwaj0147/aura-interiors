"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import AuraLogo from "./AuraLogo";

export default function Header({ links }: { links: string[][] }) {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const restoreScroll = useRef<(() => void) | null>(null);

  useEffect(() => {
    const element = panel.current;
    const headerElement = header.current;
    if (!element) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const context = gsap.context(() => {
      timeline.current = gsap
        .timeline({
          paused: true,
          onReverseComplete: () => {
            restoreScroll.current?.();
            headerElement?.classList.remove("aura-header-menu-active");
          },
        })
        .fromTo(
          element,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: reduced ? 0 : 0.8,
            ease: "power4.inOut",
          },
        )
        .fromTo(
          element.querySelectorAll("[data-menu-item]"),
          { x: reduced ? 0 : -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: reduced ? 0 : 0.55,
            stagger: reduced ? 0 : 0.07,
            ease: "power3.out",
          },
          reduced ? 0 : "-=0.35",
        );
    }, element);
    return () => {
      context.revert();
      timeline.current = null;
      restoreScroll.current?.();
      headerElement?.classList.remove("aura-header-menu-active");
    };
  }, []);

  useLayoutEffect(() => {
    const element = header.current;
    if (!element) return;
    const sections = document.querySelectorAll<HTMLElement>(
      "main > section, footer.aura-footer",
    );
    let frame = 0;
    const updateColor = () => {
      frame = 0;
      const midpoint = element.getBoundingClientRect().height / 2;
      const section = Array.from(sections).find((item) => {
        const bounds = item.getBoundingClientRect();
        return bounds.top <= midpoint && bounds.bottom > midpoint;
      });
      const background = section && getComputedStyle(section).backgroundColor;
      const channels = background?.match(/[\d.]+/g)?.map(Number);
      const brightness = channels
        ? channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
        : 0;
      element.classList.toggle("aura-header-on-light", brightness > 160);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateColor);
    };
    updateColor();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  useLayoutEffect(() => {
    if (open) {
      header.current?.classList.add("aura-header-menu-active");
      if (!restoreScroll.current) {
        const root = document.documentElement;
        const body = document.body;
        const gutterWidth = window.innerWidth - root.clientWidth;
        const previousRootOverflow = root.style.overflow;
        const previousRootGutter = root.style.scrollbarGutter;
        const previousBodyOverflow = body.style.overflow;
        const previousBodyPadding = body.style.paddingRight;
        root.style.overflow = "hidden";
        root.style.scrollbarGutter = "auto";
        body.style.overflow = "hidden";
        if (gutterWidth > 0) {
          body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + gutterWidth}px`;
        }
        restoreScroll.current = () => {
          root.style.overflow = previousRootOverflow;
          root.style.scrollbarGutter = previousRootGutter;
          body.style.overflow = previousBodyOverflow;
          body.style.paddingRight = previousBodyPadding;
          restoreScroll.current = null;
        };
      }
      timeline.current?.play();
      const firstLink = panel.current?.querySelector<HTMLAnchorElement>("a");
      firstLink?.focus();
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setOpen(false);
          button.current?.focus({ preventScroll: true });
        }
        if (event.key === "Tab") {
          const items = [
            button.current,
            ...Array.from(
              panel.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
            ),
          ].filter((item) => item !== null);
          const first = items[0];
          const last = items[items.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }
      };
      window.addEventListener("keydown", onKeyDown);
      return () => {
        window.removeEventListener("keydown", onKeyDown);
      };
    }
    timeline.current?.reverse();
    // A zero-duration or not-yet-started timeline may not fire its callback.
    if (!timeline.current || timeline.current.progress() === 0) {
      restoreScroll.current?.();
      header.current?.classList.remove("aura-header-menu-active");
    }
  }, [open]);

  const hover = (
    event: React.SyntheticEvent<HTMLAnchorElement>,
    active: boolean,
  ) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(event.currentTarget.querySelector("[data-label]"), {
      x: active ? 14 : 0,
      duration: 0.35,
      ease: "power3.out",
      overwrite: true,
    });
  };

  return (
    <>
      <header ref={header} className="aura-header-header">
        <a
          className={"aura-header-brand"}
          href="#top"
          aria-label="Aura Interiors, back to top"
        >
          <AuraLogo className="aura-header-logo" />
          <span>
            <strong>AURA</strong>
            <small>INTERIORS</small>
          </span>
        </a>
        <button
          ref={button}
          className={"aura-header-toggle"}
          type="button"
          aria-expanded={open}
          aria-controls="aura-menu"
          onClick={() => setOpen(!open)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <span
            className={`aura-header-icon ${open ? "aura-header-iconOpen" : ""}`}
            aria-hidden="true"
          >
            <i />
            <i />
          </span>
        </button>
      </header>
      <div
        ref={panel}
        id="aura-menu"
        className={"aura-header-panel"}
        aria-hidden={!open}
        inert={!open}
        data-lenis-prevent
      >
        <div className="aura-header-scroll">
          <nav className={"aura-header-nav"} aria-label="Main navigation">
            {/* <p data-menu-item className={"aura-header-eyebrow"}>EXPLORE AURA</p> */}
            {links.map(([name, href]) => (
              <a
                data-menu-item
                key={name}
                href={href}
                onClick={() => setOpen(false)}
                onMouseEnter={(e) => hover(e, true)}
                onMouseLeave={(e) => hover(e, false)}
                onFocus={(e) => hover(e, true)}
                onBlur={(e) => hover(e, false)}
              >
                <span data-label>{name}</span>
                <span className={"aura-header-arrow"} aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
