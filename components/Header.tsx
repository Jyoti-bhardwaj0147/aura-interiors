"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import AuraLogo from "./AuraLogo";

export default function Header({ links }: { links: string[][] }) {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const element = panel.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      timeline.current = gsap.timeline({ paused: true })
        .fromTo(element, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: reduced ? 0 : 0.8, ease: "power4.inOut" })
        .fromTo(element.querySelectorAll("[data-menu-item]"), { x: reduced ? 0 : -50, opacity: 0 }, { x: 0, opacity: 1, duration: reduced ? 0 : 0.55, stagger: reduced ? 0 : 0.07, ease: "power3.out" }, reduced ? 0 : "-=0.35");
    }, element);
    return () => { context.revert(); timeline.current = null; };
  }, []);

  useEffect(() => {
    if (open) {
      timeline.current?.play();
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const firstLink = panel.current?.querySelector<HTMLAnchorElement>("a");
      firstLink?.focus();
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") { setOpen(false); button.current?.focus(); }
        if (event.key === "Tab") {
          const items = [button.current, ...Array.from(panel.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [])].filter((item) => item !== null);
          const first = items[0];
          const last = items[items.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }
      };
      window.addEventListener("keydown", onKeyDown);
      return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
    }
    timeline.current?.reverse();
  }, [open]);

  const hover = (event: React.SyntheticEvent<HTMLAnchorElement>, active: boolean) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(event.currentTarget.querySelector("[data-label]"), { x: active ? 14 : 0, duration: 0.35, ease: "power3.out", overwrite: true });
  };

  return <>
    <header className={"aura-header-header"}>
      <a className={"aura-header-brand"} href="#top" aria-label="Aura Interiors, back to top">
        <AuraLogo className="aura-header-logo" />
        <span><strong>AURA</strong><small>INTERIORS</small></span>
      </a>
      <button ref={button} className={"aura-header-toggle"} type="button" aria-expanded={open} aria-controls="aura-menu" onClick={() => setOpen(!open)}>
        <span>{open ? "Close" : "Menu"}</span><span className={`aura-header-icon ${open ? "aura-header-iconOpen" : ""}`} aria-hidden="true"><i/><i/></span>
      </button>
    </header>
    <div ref={panel} id="aura-menu" className={"aura-header-panel"} aria-hidden={!open} inert={!open} data-lenis-prevent>
      <nav className={"aura-header-nav"} aria-label="Main navigation">
        <p data-menu-item className={"aura-header-eyebrow"}>EXPLORE AURA</p>
        {links.map(([name, href], index) => <a data-menu-item key={name} href={href} onClick={() => setOpen(false)} onMouseEnter={(e) => hover(e, true)} onMouseLeave={(e) => hover(e, false)} onFocus={(e) => hover(e, true)} onBlur={(e) => hover(e, false)}><span className={"aura-header-number"}>0{index + 1}</span><span data-label>{name}</span><span className={"aura-header-arrow"} aria-hidden="true">↗</span></a>)}
      </nav>
    </div>
  </>;
}
