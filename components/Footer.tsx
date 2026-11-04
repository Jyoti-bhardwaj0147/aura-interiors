"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import AuraLogo from "./AuraLogo";

export default function Footer({ links, email }: { links: string[][]; email: string }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const reveal = gsap.fromTo(element.querySelectorAll("[data-footer-reveal]"),
        { y: 28 }, { y: 0, duration: 1.1, stagger: 0.12, ease: "power3.out", paused: true });
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { reveal.play(); observer.disconnect(); }
      }, { threshold: 0.12 });
      observer.observe(element);
      return () => observer.disconnect();
    }, element);
    return () => media.revert();
  }, []);

  return (
    <footer ref={root} className="aura-footer">
      <div className="aura-footer-shell">
        <div className="aura-footer-heading" data-footer-reveal>
          <a className="aura-footer-brand" href="#top" aria-label="Aura Interiors, back to top">
            <AuraLogo className="h-12 w-12 shrink-0" />
            <span>AURA<small>INTERIORS</small></span>
          </a>
          <span className="aura-footer-caption">DESIGNED WITH INTENTION</span>
        </div>
        <div className="aura-footer-main">
          <p className="aura-footer-statement" data-footer-reveal>Spaces with soul.<br /><span className=""><em>Stories with substance.</em></span></p>
          <nav className="aura-footer-nav" aria-label="Footer navigation" data-footer-reveal>
            {links.map(([name, href], index) => <a key={name} href={href}><span className="aura-footer-index">0{index + 1}</span><span>{name}</span><ArrowUpRight size={16} aria-hidden="true" /></a>)}
          </nav>
        </div>
        {email && <a className="aura-footer-email" href={`mailto:${email}`} data-footer-reveal><span>{email}</span><ArrowUpRight size={20} aria-hidden="true" /></a>}
        <div className="aura-footer-bottom">
          <span>© AURA INTERIORS</span>
          
        </div>
      </div>
    </footer>
  );
}
