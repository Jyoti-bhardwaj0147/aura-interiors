"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const services = [
  [
    "Interior Design",
    "Thoughtful, layered interiors shaped around how you live. We bring materials, light, color, and furnishings together to create personal rooms that feel calm, comfortable, and welcoming every day.",
  ],
  ["Architecture", "Distinctive architecture shaped by your needs and its surroundings. Considered proportions, natural light, and lasting materials bring form and function together in spaces designed for comfortable living."],
  ["Space Planning", "Intelligent layouts that make every square foot matter. We balance flow, privacy, storage, and flexibility so each room works naturally with your daily routines."],
  ["Renovation", "Fresh possibilities for spaces with stories to tell. We preserve their best features while reworking layouts, finishes, and lighting to bring renewed purpose and comfort."],
  [
    "Furniture Design",
    "Custom furniture designed for your space and the way you use it. Thoughtful proportions, materials, and craftsmanship create pieces that feel integrated, useful, and distinctive for years.",
  ],
  [
    "Turnkey Solutions",
    "One seamless journey from first sketch to final detail. We coordinate design, materials, furniture, and execution through a clear process, delivering a finished space ready to enjoy.",
  ],
];

const photos = [
  ["/images/services/interior-design.jpg", "Warm living room with layered neutral furnishings"],
  ["/images/services/architecture.jpg", "Contemporary home opening onto a landscaped garden"],
  ["/images/services/space-planning.jpg", "Open interior connecting living and dining spaces"],
  ["/images/services/renovation.jpg", "Refined kitchen with natural finishes"],
  ["/images/services/furniture-design.jpg", "Considered furniture and shelving details"],
  ["/images/services/turnkey-solutions.jpg", "Complete furnished interior with coordinated finishes"],
];



export default function WhatWeDo({ children }: {
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
    const media = gsap.matchMedia();
    media.add("(min-width: 761px) and (min-height: 601px) and (prefers-reduced-motion: no-preference)", () => {
      const frame = viewport.current;
      const rail = track.current;
      if (!frame || !rail || services.length < 2) return;
      // Only hide offscreen panels once their scroll animation is available.
      frame.classList.add("aura-what-animated");
      const distance = () => rail.scrollWidth - frame.clientWidth;
      gsap.to(rail, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: frame,
          pin: true,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 1,
          invalidateOnRefresh: true,
          snap: { snapTo: 1 / (services.length - 1), inertia: false, duration: { min: 0.2, max: 0.4 } },
        },
      });
      return () => frame.classList.remove("aura-what-animated");
    }, root);
    // Font metrics can settle after the initial pin measurement.
    let mounted = true;
    void document.fonts.ready.then(() => { if (mounted) ScrollTrigger.refresh(); });
    return () => { mounted = false; media.revert(); };
  }, { scope: root, dependencies: [services.length], revertOnUpdate: true });

  return (
    <section id="what-we-do" className="bg-ivory" ref={root} aria-labelledby="what-we-do-heading">
      <div id="intro" className="flex min-h-[80svh] items-center py-[100px] [@media(max-width:760px)]:min-h-auto [@media(max-width:760px)]:py-20">
        <div className="mx-auto w-[calc(100%-88px)] max-w-[1360px] [@media(max-width:1050px)]:w-[calc(100%-64px)] [@media(max-width:760px)]:w-[calc(100%-40px)]">{children}</div>
      </div>
      <div id="panels" className="group/what overflow-clip" ref={viewport}>
        <div id="panels-container" className="[@media(min-width:761px)_and_(min-height:601px)_and_(prefers-reduced-motion:no-preference)]:group-[.aura-what-animated]/what:flex [@media(min-width:761px)_and_(min-height:601px)_and_(prefers-reduced-motion:no-preference)]:group-[.aura-what-animated]/what:flex-nowrap" ref={track}>
          {services.map(([title, copy], i) => (
            <article id={`panel-${i + 1}`} className="group/service bg-ivory py-20 even:bg-aura-white [@media(max-width:760px)]:py-[60px] [@media(min-width:761px)_and_(min-height:601px)_and_(prefers-reduced-motion:no-preference)]:group-[.aura-what-animated]/what:flex-[0_0_100%] [@media(min-width:761px)_and_(min-height:601px)_and_(prefers-reduced-motion:no-preference)]:group-[.aura-what-animated]/what:min-w-0 [@media(min-width:761px)_and_(min-height:601px)_and_(prefers-reduced-motion:no-preference)]:group-[.aura-what-animated]/what:h-svh [@media(min-width:761px)_and_(min-height:601px)_and_(prefers-reduced-motion:no-preference)]:group-[.aura-what-animated]/what:flex [@media(min-width:761px)_and_(min-height:601px)_and_(prefers-reduced-motion:no-preference)]:group-[.aura-what-animated]/what:items-center [@media(min-width:761px)_and_(min-height:601px)_and_(prefers-reduced-motion:no-preference)]:group-[.aura-what-animated]/what:pt-[100px] [@media(min-width:761px)_and_(min-height:601px)_and_(prefers-reduced-motion:no-preference)]:group-[.aura-what-animated]/what:pb-10" key={title} aria-labelledby={`aura-service-${i + 1}`}>
              <div className="mx-auto w-[calc(100%-88px)] max-w-[1360px] [@media(max-width:1050px)]:w-[calc(100%-64px)] [@media(max-width:760px)]:w-[calc(100%-40px)] grid grid-cols-2 items-center gap-[clamp(32px,6vw,96px)] [@media(max-width:760px)]:grid-cols-1 [@media(max-width:760px)]:gap-8">
                <div className="min-w-0 group-even/service:order-2 [@media(max-width:760px)]:group-even/service:order-0">
                  <span className="font-display text-[11px] leading-[1.08] tracking-[.18em] text-muted italic">{String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}</span>
                  <h3 id={`aura-service-${i + 1}`} className="mt-7 mb-6 font-display text-[clamp(2.6rem,5.2vw,6.1rem)] leading-[1.08] font-normal tracking-[-.045em] [overflow-wrap:break-word] [@media(max-width:760px)]:text-[clamp(2.6rem,11vw,4.3rem)]">{title}</h3>
                  <p className="m-0 max-w-[430px] text-[15px] leading-[1.9] text-muted">{copy}</p>
                </div>
                <div className="relative h-[min(65svh,720px)] min-h-[280px] overflow-hidden rounded-[15px] bg-line [box-shadow:rgba(50,50,93,0.25)_0px_13px_27px_-5px,rgba(0,0,0,0.3)_0px_8px_16px_-8px] [@media(max-width:760px)]:h-auto [@media(max-width:760px)]:min-h-0 [@media(max-width:760px)]:aspect-[4/3]">
                  <Image className="object-cover" src={photos[i][0]} alt={photos[i][1]} fill sizes="(max-width: 760px) 100vw, 50vw" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
