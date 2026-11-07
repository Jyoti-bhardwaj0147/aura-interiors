"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatWeDo, { services } from "../components/WhatWeDo";
import Image from "next/image";
import InitialLoader from "./initial-loader";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

const img = {
  hero: "/images/hero.jpg",
  studio: "/images/studio.jpg",
  villa: "/images/villa.jpg",
  apartment: "/images/apartment.jpg",
  office: "/images/office.jpg",
  residence: "/images/residence.jpg",
  detail: "/images/detail.jpg",
};
const projects = [
  {
    title: "The Solace Residence",
    type: "Residential",
    image: img.residence,
    gallery: [img.residence, img.detail, img.studio],
    copy: "A quiet composition of natural stone, soft light, and spaces made for everyday rituals.",
  },
  {
    title: "Casa Aurelia",
    type: "Villas",
    image: img.villa,
    gallery: [img.villa, img.studio, img.detail],
    copy: "An expansive retreat shaped by warm materials and a connection to the outdoors.",
  },
  {
    title: "The Line Apartment",
    type: "Apartments",
    image: img.apartment,
    gallery: [img.apartment, img.residence, img.studio],
    copy: "A thoughtful urban home where sculptural details meet easy, considered living.",
  },
  {
    title: "Atelier House",
    type: "Commercial",
    image: img.office,
    gallery: [img.office, img.detail, img.studio],
    copy: "A welcoming workspace with room for focus, collaboration, and new ideas.",
  },
];
const processSteps = [
  ["Consultation", "We listen, explore your vision, and understand the space."],
  ["Planning", "We define the scope, priorities, timeline, and possibilities."],
  [
    "Concept Development",
    "Mood, material, and layout come together in a clear direction.",
  ],
  [
    "Design Execution",
    "The design takes shape with attention to every detail.",
  ],
  [
    "Final Delivery",
    "A considered handover, ready for the life you will make there.",
  ],
];
const reasons = [
  [
    "Creative excellence",
    "A design-led point of view with your way of living at its center.",
  ],
  [
    "Premium materials",
    "Considered finishes, lasting quality, and details worth noticing.",
  ],
  [
    "Personal collaboration",
    "An open, attentive process that makes room for your ideas.",
  ],
  [
    "Timely delivery",
    "Clear milestones and thoughtful coordination through every stage.",
  ],
];
const links = [
  ["Studio", "#studio"],
  ["Projects", "#projects"],
  ["Services", "#services"],
  ["Process", "#process"],
  ["Contact", "#contact"],
];

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`${className} motion-reduce:!transform-none`}
      initial={{ y: 28 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduced ? 0 : 0.7 }}
    >
      {children}
    </motion.div>
  );
}
function Label({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`m-0 flex items-center gap-3 text-[10px] font-semibold uppercase leading-[1.6] tracking-[.24em] text-orange max-[560px]:gap-2.5 max-[560px]:text-[9px] max-[560px]:tracking-[.2em] ${className}`}
    >
      <span aria-hidden="true" className="flex shrink-0 items-center gap-1.5">
        <span className="h-px w-8 bg-current opacity-70 max-[560px]:w-6" />
        <span className="h-1 w-1 rotate-45 border border-current" />
      </span>
      <span>{children}</span>
    </p>
  );
}
function More({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      className="group relative isolate inline-flex min-h-[56px] max-w-full items-center justify-between gap-8 overflow-hidden rounded-[15px] border border-ink/55 bg-transparent py-2 pl-5 pr-2 text-[11px] font-bold uppercase tracking-[.12em] text-ink transition-[color,background-color,border-color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-transparent hover:text-aura-white motion-reduce:transform-none motion-reduce:transition-none"
      href={href}
    >
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-orange via-[#f5a448] to-pastel opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:transition-none" />
      <span>{children}</span>
      <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-[15px] border border-ink/35 bg-ink/5 transition-[background-color,border-color,transform] duration-300 group-hover:translate-x-0.5 group-hover:border-transparent group-hover:bg-ink/10 motion-reduce:transform-none motion-reduce:transition-none">
        <ArrowRight size={18} strokeWidth={1.7} />
      </span>
    </a>
  );
}

export default function Home() {
  const [filter, setFilter] = useState("All projects");
  const [selected, setSelected] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const reducedMotion = useReducedMotion();
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
  const address = process.env.NEXT_PUBLIC_STUDIO_ADDRESS || "";
  const phone = process.env.NEXT_PUBLIC_STUDIO_PHONE || "";
  const shown =
    filter === "All projects"
      ? projects
      : projects.filter((p) => p.type === filter);

  useEffect(() => {
    document.body.style.overflow = selected !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (selected === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowRight")
        setSlide((n) => (n + 1) % projects[selected].gallery.length);
      if (e.key === "ArrowLeft")
        setSlide(
          (n) =>
            (n - 1 + projects[selected].gallery.length) %
            projects[selected].gallery.length,
        );
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [selected]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!email) {
      setError(
        "Online inquiries are being set up. Please add the studio contact email to activate this form.",
      );
      return;
    }
    const form = new FormData(e.currentTarget);
    setSending(true);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form.entries())),
      });
      if (!res.ok)
        throw new Error(
          "Unable to send your inquiry right now. Please try again.",
        );
      setSent(true);
      (e.target as HTMLFormElement).reset();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <InitialLoader />
      <Header links={links} />
      <main id="top">
        <section className="relative flex [box-shadow:rgba(50,50,93,0.25)_0px_13px_27px_-5px,rgba(0,0,0,0.3)_0px_8px_16px_-8px] h-[min(900px,100svh)] min-h-[650px] items-center bg-cover bg-center text-white [&_h1]:mb-[30px] [&_h1]:max-w-[1000px] [&_h1]:font-display [&_h1]:text-[clamp(4.7rem,8.7vw,10.2rem)] [&_h1]:leading-[.94] [&_h1]:font-normal [&_h1]:tracking-[-.045em] max-[760px]:h-[88svh] max-[760px]:min-h-[760px] max-[760px]:[&_h1]:text-[clamp(4rem,12vw,6.5rem)] max-[560px]:min-h-[760px] max-[560px]:[&_h1]:text-[clamp(3.55rem,13vw,5rem)] max-[390px]:[&_h1]:text-[3.45rem]" style={{ backgroundImage: `url(${img.hero})` }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={img.hero}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(13,12,10,.44)_0%,rgba(17,15,11,.18)_57%,rgba(17,15,11,.1)_100%),linear-gradient(0deg,#0003,transparent_28%)]" />
          <div className="mx-auto w-[calc(100%-88px)] max-w-[1360px] max-[1050px]:w-[calc(100%-64px)] max-[760px]:w-[calc(100%-40px)] relative z-[1] pt-[70px] max-[760px]:pt-[60px]">
            <p className="mb-[25px] text-[11px] font-bold tracking-[.2em]">
              INTERIOR DESIGN & ARCHITECTURE STUDIO
            </p>
            <h1 className="font-display">
              Spaces that
              <br />
              <em>feel like you.</em>
            </h1>
            <p className="max-w-[430px] text-base leading-[1.75] text-[#f6f0e8] max-[560px]:text-sm">
              We create quietly remarkable interiors where every detail has a
              purpose, and every space tells a story.
            </p>
            <div className="mt-[34px] flex flex-wrap items-center gap-3 max-[560px]:flex-col max-[560px]:items-stretch">
              
              <a
                className="group relative isolate inline-flex min-h-[56px] min-w-[170px] max-w-full items-center justify-between gap-8 overflow-hidden rounded-[15px] bg-gradient-to-r from-pastel via-[#f5a448] to-orange py-2 pl-5 pr-2 text-[11px] font-bold uppercase tracking-[.12em] text-white [box-shadow:0_8px_24px_rgba(240,123,17,0.3)] transition-[color,transform,box-shadow] duration-300 ease-out hover:scale-105 hover:[box-shadow:0_12px_28px_rgba(240,123,17,0.4)] active:scale-95 focus-visible:!outline-none focus-visible:ring-2 focus-visible:ring-pastel focus-visible:ring-offset-2 focus-visible:ring-offset-ink motion-reduce:transform-none motion-reduce:transition-none"
                href="#projects"
              >
                <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-orange via-[#f5a448] to-pastel opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none" />
                <span>Explore our work</span>
                <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-[15px] bg-white/15 transition-[background-color,transform] duration-300 group-hover:translate-x-0.5 group-hover:bg-white/25 motion-reduce:transform-none motion-reduce:transition-none">
                  <ArrowUpRight size={18} strokeWidth={1.7} />
                </span>
              </a>
              <a
                className="group inline-flex min-h-[56px] items-center justify-between gap-8 rounded-[15px] border border-white/65 bg-black/10 py-2 pl-5 pr-2 text-[11px] font-bold uppercase tracking-[.12em] text-white [box-shadow:0_8px_24px_rgba(240,123,17,0.3)] backdrop-blur-sm transition-[background-color,border-color,transform,box-shadow] duration-300 ease-out hover:scale-105 hover:border-white hover:bg-white/15 hover:[box-shadow:0_12px_28px_rgba(240,123,17,0.4)] active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                href="#studio"
              >
                <span>Discover the studio</span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[15px] border border-white/35 transition-[background-color,transform] duration-300 group-hover:translate-x-0.5 group-hover:bg-white/15 motion-reduce:transform-none motion-reduce:transition-none">
                  <ArrowRight size={18} strokeWidth={1.7} />
                </span>
              </a>
            </div>
          </div>
          <a
            className="group absolute bottom-6 left-1/2 z-[1] flex min-h-[74px] -translate-x-1/2 flex-col items-center justify-center gap-2 whitespace-nowrap rounded-[15px] px-5 py-2 text-[10px] font-bold tracking-[.18em] text-white transition-colors duration-300 hover:text-pastel max-[560px]:bottom-4 motion-reduce:transition-none"
            href="#studio"
          >
            <span>SCROLL TO EXPLORE</span>
            <motion.span
              className="grid h-7 w-7 place-items-center rounded-full border border-white/60 transition-colors duration-300 group-hover:border-pastel motion-reduce:transition-none"
              animate={reducedMotion ? undefined : { y: [0, 5, 0] }}
              transition={reducedMotion ? undefined : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown size={16} strokeWidth={1.6} />
            </motion.span>
          </a>
         
        </section>

        <section
          className="scroll-mt-[76px] py-[130px] max-[760px]:py-20 bg-aura-white"
          id="studio"
        >
          <div className="mx-auto w-[calc(100%-88px)] max-w-[1360px] max-[1050px]:w-[calc(100%-64px)] max-[760px]:w-[calc(100%-40px)] grid grid-cols-[1fr_1.04fr] items-center gap-[9%] max-[1050px]:gap-[6%] max-[760px]:grid-cols-1 max-[760px]:gap-[50px]">
            <Reveal>
              <Label>THE STUDIO</Label>
              <h2 className="mt-[23px] mb-[30px] font-display text-[clamp(3.1rem,5.2vw,6.1rem)] leading-[1.08] font-normal tracking-[-.045em] max-[560px]:text-[clamp(3rem,11vw,4.3rem)]">
                A more <em>meaningful</em>
                <br />
                way to live.
              </h2>
              <p className="mb-[22px] max-w-[580px] text-[clamp(1.25rem,1.8vw,1.6rem)] leading-[1.5]">
                At Aura Interiors, we believe beautiful spaces begin with
                understanding the people who inhabit them.
              </p>
              <p className="mb-8 max-w-[530px] text-[15px] leading-[1.9] text-muted">
                Our approach balances architectural clarity with a softer, more
                personal sensibility. From the first conversation to the
                finishing touch, we bring intention to every decision and care
                to every detail.
              </p>
              <More href="#services">Our approach</More>
              <div className="mt-[72px] flex gap-[65px] max-[760px]:mt-[45px] max-[560px]:gap-[35px] [&>div]:flex [&>div]:flex-col [&>div]:gap-2 [&_strong]:font-display [&_strong]:text-[3.6rem] [&_strong]:leading-[.9] [&_strong]:font-normal max-[560px]:[&_strong]:text-[2.8rem] [&_span]:text-[10px] [&_span]:tracking-[.12em] [&_span]:text-muted [&_span]:font-normal max-[560px]:[&_span]:text-[9px]">
                <div>
                  <strong><em>01</em></strong>
                  <span>ONE VISION, YOURS</span>
                </div>
                <div>
                  <strong><em>360°</em></strong>
                  <span>THOUGHTFUL DESIGN</span>
                </div>
              </div>
            </Reveal>
            <Reveal className="relative pb-[22px] pl-6 max-[760px]:max-w-[590px] max-[560px]:pl-3">
              <div className="relative h-[620px] rounded-[15px] [box-shadow:rgba(50,50,93,0.25)_0px_13px_27px_-5px,rgba(0,0,0,0.3)_0px_8px_16px_-8px] max-[1050px]:h-[520px] max-[560px]:h-[400px]">
                <Image
                  src={img.studio}
                  alt="Refined neutral interior with layered materials"
                  fill
                  className="rounded-[15px]"
                  sizes="(max-width: 850px) 100vw, 45vw"
                  unoptimized
                />
              </div>
              
              
            </Reveal>
          </div>
        </section>

        <section
          className="scroll-mt-[76px] py-[130px] max-[760px]:py-20 bg-ivory"
          id="projects"
        >
          <div className="mx-auto w-[calc(100%-88px)] max-w-[1360px] max-[1050px]:w-[calc(100%-64px)] max-[760px]:w-[calc(100%-40px)]">
            <Reveal className="flex items-end justify-between gap-10 max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-0 [&>p:last-child]:mb-8 [&>p:last-child]:max-w-[300px] [&>p:last-child]:text-[15px] [&>p:last-child]:leading-[1.8] [&>p:last-child]:text-muted max-[760px]:[&>p:last-child]:mb-[30px]">
              <div>
                <Label>SELECTED WORK</Label>
                <h2 className="mt-[23px] mb-[30px] font-display text-[clamp(3.1rem,5.2vw,6.1rem)] leading-[1.08] font-normal tracking-[-.045em] max-[560px]:text-[clamp(3rem,11vw,4.3rem)]">
                  Our <em>projects.</em>
                </h2>
              </div>
              <p>
                Each space is a distinct expression of its people, place, and
                possibilities.
              </p>
            </Reveal>
            <div
              className="mt-4 mb-[33px] flex flex-wrap gap-[10px]"
              role="group"
              aria-label="Filter projects"
            >
              {[
                "All projects",
                "Residential",
                "Villas",
                "Apartments",
                "Commercial",
              ].map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`cursor-pointer border rounded-[15px] px-[17px] py-[10px] text-[11px] transition-colors duration-200 max-[390px]:px-[11px] max-[390px]:py-2 ${filter === name ? "border-ink bg-ink text-white" : "border-[#cbbda9] bg-transparent text-[#6f665b] hover:border-ink hover:bg-ink hover:text-white"}`}
                  aria-pressed={filter === name}
                  onClick={() => setFilter(name)}
                >
                  {name}
                </button>
              ))}
            </div>
            <motion.div
              layout
              className="grid grid-cols-2 gap-x-7 gap-y-[42px] max-[560px]:grid-cols-1 max-[560px]:gap-7"
            >
              {shown.map((p) => (
                <motion.button
                  layout
                  className="group min-w-0 cursor-pointer border-0 bg-transparent p-0 text-left text-inherit"
                  type="button"
                  key={p.title}
                  onClick={() => {
                    setSelected(projects.indexOf(p));
                    setSlide(0);
                  }}
                >
                  <span className="relative block aspect-[1.28] rounded-[15px] [box-shadow:rgba(50,50,93,0.25)_0px_13px_27px_-5px,rgba(0,0,0,0.3)_0px_8px_16px_-8px] overflow-hidden bg-[#d7c8b6] max-[560px]:aspect-[1.15]">
                    <Image
                      src={p.image}
                      alt={p.title + " interior"}
                      className="object-cover transition-transform rounded-[15px] duration-700 group-hover:scale-[1.045]"
                      fill
                      sizes="(max-width: 700px) 100vw, 50vw"
                      unoptimized
                    />
                    <span className="absolute right-[23px] rounded-[15px] bottom-[23px] grid h-12 w-12 translate-y-3 place-items-center bg-orange text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight />
                    </span>
                  </span>
                  <span className="flex items-center justify-between border-b border-[#c6bbaa] py-[19px] [&>span]:flex [&>span]:flex-col [&>span]:gap-[7px] [&_small]:text-[10px] [&_small]:tracking-[.14em] [&_small]:text-orange [&_strong]:font-display [&_strong]:text-[1.9rem] [&_strong]:font-normal max-[560px]:[&_strong]:text-[1.6rem]">
                    <span>
                      <small>{p.type.toUpperCase()} · SELECTED WORK</small>
                      <strong>{p.title}</strong>
                    </span>
                    <ArrowUpRight size={22} strokeWidth={1.3} />
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="bg-[#39342f] py-[110px] text-center text-ivory max-[560px]:py-20 [&>div>span]:text-[10px] [&>div>span]:tracking-[.22em]">
          <div className="mx-auto w-[calc(100%-88px)] max-w-[1360px] max-[1050px]:w-[calc(100%-64px)] max-[760px]:w-[calc(100%-40px)]">
            <Label className="justify-center text-pastel">OUR PHILOSOPHY</Label>
            <Reveal>
              <p className="mx-auto mt-[31px] mb-[33px] max-w-[950px] font-display text-[clamp(2.8rem,5.2vw,5.6rem)] leading-[1.16] tracking-[-.045em] max-[560px]:text-[2.8rem]">
                “Design is more than what you see. It is how a space{" "}
                <em>makes you feel.</em>”
              </p>
            </Reveal>
            <span>AURA INTERIORS</span>
          </div>
        </section>

        <section
          className="hidden scroll-mt-[76px] py-[130px] max-[760px]:py-20 bg-aura-white"
          id="services"
        >
          <div className="mx-auto w-[calc(100%-88px)] max-w-[1360px] max-[1050px]:w-[calc(100%-64px)] max-[760px]:w-[calc(100%-40px)] grid grid-cols-[.86fr_1.14fr] gap-[10%] max-[1050px]:gap-[6%] max-[760px]:grid-cols-1 max-[760px]:gap-[50px] [&>div:first-child]:sticky [&>div:first-child]:top-10 [&>div:first-child]:self-start max-[760px]:[&>div:first-child]:static">
            <Reveal>
              <Label>WHAT WE DO</Label>
              <h2 className="mt-[23px] mb-[30px] font-display text-[clamp(3.1rem,5.2vw,6.1rem)] leading-[1.08] font-normal tracking-[-.045em] max-[560px]:text-[clamp(3rem,11vw,4.3rem)]">
                Services made
                <br />
                for <em>living well.</em>
              </h2>
              <p className="mb-8 max-w-[530px] text-[15px] leading-[1.9] text-muted">
                From a single room to an entire property, our team brings a
                complete design perspective to every scale of project.
              </p>
              <More href="#consultation">Start a conversation</More>
            </Reveal>
            <div className="">
              {services.map(([title, copy], i) => (
                <Reveal key={title}>
                  <div className="grid grid-cols-[45px_1fr_24px] items-start gap-[14px] border-b border-line py-[25px] [&>span]:pt-[7px] [&>span]:text-[11px] [&>span]:text-orange [&_h3]:mb-[7px] [&_h3]:font-display [&_h3]:text-[2.25rem] [&_h3]:font-normal [&_p]:text-[13px] [&_p]:leading-[1.6] [&_p]:text-muted">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{copy}</p>
                    </div>
                    <ArrowUpRight size={20} strokeWidth={1.3} />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <WhatWeDo>
          <Label>WHAT WE DO</Label>
          <h2 id="what-we-do-heading" className="mt-[23px] mb-[30px] font-display text-[clamp(3.1rem,5.2vw,6.1rem)] leading-[1.08] font-normal tracking-[-.045em] max-[560px]:text-[clamp(3rem,11vw,4.3rem)]">
            Services made<br />for <em>living well.</em>
          </h2>
          <p className="mb-8 max-w-[530px] text-[15px] leading-[1.9] text-muted">
            From a single room to an entire property, our team brings a
            complete design perspective to every scale of project.
          </p>
          <More href="#consultation">Start a conversation</More>
        </WhatWeDo>

              <section className="scroll-mt-[76px] py-[130px] max-[760px]:py-20 bg-ivory">
          <div className="mx-auto w-[calc(100%-88px)] max-w-[1360px] max-[1050px]:w-[calc(100%-64px)] max-[760px]:w-[calc(100%-40px)] grid grid-cols-2 items-center gap-[10%] max-[760px]:grid-cols-1 max-[760px]:gap-[50px]">
            <Reveal>
              <Label>THE PEOPLE BEHIND THE SPACES</Label>
              <h2 className="mt-[23px] mb-[30px] font-display text-[clamp(3.1rem,5.2vw,6.1rem)] leading-[1.08] font-normal tracking-[-.045em] max-[560px]:text-[clamp(3rem,11vw,4.3rem)]">
                Creative minds.
                <br />
                <em>Shared vision.</em>
              </h2>
            </Reveal>
            <Reveal>
              <p className="mb-[22px] max-w-[580px] text-[clamp(1.25rem,1.8vw,1.6rem)] leading-[1.5]">
                Every project is a collaboration of perspectives and craft.
              </p>
              <p className="mb-8 max-w-[530px] text-[15px] leading-[1.9] text-muted">
                Our studio brings together interior designers, architects,
                project managers, and creative specialists to shape spaces that
                work beautifully and feel deeply personal.
              </p>
              <div className="mt-[30px] flex flex-wrap gap-[10px] [&_span]:rounded-[15px]  [&_span]:border [&_span]:border-[#c8b9a6] [&_span]:px-[13px] [&_span]:py-[11px] [&_span]:text-[10px] [&_span]:tracking-[.11em]">
                <span>INTERIOR DESIGNERS</span>
                <span>ARCHITECTS</span>
                <span>PROJECT MANAGERS</span>
                <span>CREATIVE SPECIALISTS</span>
              </div>
            </Reveal>
          </div>
        </section>
       

        <section
          className="scroll-mt-[76px] py-[130px] max-[760px]:py-20 bg-aura-white"
          id="process"
        >
          <div className="mx-auto w-[calc(100%-88px)] max-w-[1360px] max-[1050px]:w-[calc(100%-64px)] max-[760px]:w-[calc(100%-40px)] grid grid-cols-2 gap-[12%] max-[1050px]:gap-[6%] max-[760px]:grid-cols-1 max-[760px]:gap-[50px]">
            <Reveal>
              <Label>HOW WE WORK</Label>
              <h2 className="mt-[23px] mb-[30px] font-display text-[clamp(3.1rem,5.2vw,6.1rem)] leading-[1.08] font-normal tracking-[-.045em] max-[560px]:text-[clamp(3rem,11vw,4.3rem)]">
                A journey from
                <br />
                <em>idea to home.</em>
              </h2>
              <p className="mb-8 max-w-[530px] text-[15px] leading-[1.9] text-muted">
                A considered process keeps the experience collaborative, clear,
                and as enjoyable as the outcome.
              </p>
              <div className="relative mt-9 h-[390px] rounded-[15px] [box-shadow:rgba(50,50,93,0.25)_0px_13px_27px_-5px,rgba(0,0,0,0.3)_0px_8px_16px_-8px] max-[760px]:h-[320px]">
                <Image
                  src={img.detail}
                  alt="Warm architectural details and interior finishes"
                  className="rounded-[15px]"
                  fill
                  sizes="(max-width: 850px) 100vw, 40vw"
                  unoptimized
                />
              </div>
            </Reveal>
            <div className="pt-[52px] max-[760px]:pt-0">
              {processSteps.map(([title, copy], i) => (
                <Reveal key={title}>
                  <div className="grid grid-cols-[80px_1fr] gap-5 border-b border-line pt-6 pb-[30px] [&>span]:font-display [&>span]:text-[2.4rem] [&>span]:font-normal [&>span]:text-orange [&_h3]:mb-2 [&_h3]:font-display [&_h3]:text-[1.85rem] [&_h3]:font-normal [&_p]:text-[13px] [&_p]:leading-[1.7] [&_p]:text-muted">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{copy}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        

        <section
          className="scroll-mt-[76px] py-[130px] max-[760px]:py-20 bg-[#342f2a] text-ivory"
          id="consultation"
        >
          <div className="mx-auto w-[calc(100%-88px)] max-w-[1360px] max-[1050px]:w-[calc(100%-64px)] max-[760px]:w-[calc(100%-40px)] grid grid-cols-[.85fr_1.15fr] items-start gap-[10%] max-[760px]:grid-cols-1 max-[760px]:gap-9">
            <Reveal>
              <Label className="text-pastel">LET&apos;S BEGIN</Label>
              <h2 className="mt-[23px] mb-[30px] font-display text-[clamp(3.1rem,5.2vw,6.1rem)] leading-[1.08] font-normal tracking-[-.045em] max-[560px]:text-[clamp(3rem,11vw,4.3rem)]">
                Tell us about
                <br />
                <em>your vision.</em>
              </h2>
              <p className="mb-8 max-w-[530px] text-[15px] leading-[1.9] text-[#d5c8b8]">
                A beautiful space starts with a conversation. Share a few
                details and let&apos;s explore what we can create together.
              </p>
              <div className="mt-[58px] max-[760px]:mt-8 [&_p]:border-b [&_p]:border-white/20 [&_p]:py-[13px] [&_p]:text-sm [&_span]:mr-4 [&_span]:text-[11px] [&_span]:text-pastel">
                <p>
                  <span>01</span> Tell us about your project
                </p>
                <p>
                  <span>02</span> We review your brief
                </p>
                <p>
                  <span>03</span> We arrange a conversation
                </p>
              </div>
            </Reveal>
            <Reveal className="bg-ivory p-[43px] text-ink max-[560px]:px-5 max-[560px]:py-[26px] rounded-[15px]">
              {sent ? (
                <div
                  className="flex min-h-[420px] flex-col items-start justify-center [&>svg]:text-orange [&_h3]:mt-6 [&_h3]:mb-[10px] [&_h3]:font-display [&_h3]:text-[2.6rem] [&_h3]:font-normal [&_p]:leading-[1.6] [&_p]:text-muted [&_button]:mt-[25px] [&_button]:flex [&_button]:items-center [&_button]:gap-3 [&_button]:border-0 [&_button]:border-b [&_button]:border-ink [&_button]:bg-transparent [&_button]:pb-2"
                  role="status"
                >
                  <Check size={30} />
                  <h3>Thank you for reaching out.</h3>
                  <p>
                    Your inquiry has been received. We&apos;ll be in touch soon.
                  </p>
                  <button type="button" onClick={() => setSent(false)}>
                    Send another inquiry <ArrowRight size={17} />
                  </button>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <div className="flex justify-between border-b  border-[#cdbfae] pb-[23px] text-[10px] font-bold tracking-[.17em] [&>span:last-child]:text-orange">
                    <span>PROJECT INQUIRY</span>
                    <span>01 / 03</span>
                  </div>
                  <div className="mt-[29px] grid grid-cols-2 gap-x-5 gap-y-[25px] max-[560px]:grid-cols-1 max-[560px]:gap-y-5">
                    <label className="flex flex-col gap-[10px] text-[10px] font-bold tracking-[.13em]">
                      YOUR NAME
                      <input
                        className="min-w-0 w-full rounded-none border-0 border-b border-[#bbac99] bg-transparent px-0 py-[11px] text-[13px] font-normal tracking-normal text-ink outline-none placeholder:text-[#8b8175] focus:border-orange"
                        name="name"
                        placeholder="Your full name"
                        required
                        minLength={2}
                      />
                    </label>
                    <label className="flex flex-col gap-[10px] text-[10px] font-bold tracking-[.13em]">
                      EMAIL ADDRESS
                      <input
                        className="min-w-0 w-full rounded-none border-0 border-b border-[#bbac99] bg-transparent px-0 py-[11px] text-[13px] font-normal tracking-normal text-ink outline-none placeholder:text-[#8b8175] focus:border-orange"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                      />
                    </label>
                    <label className="flex flex-col gap-[10px] text-[10px] font-bold tracking-[.13em]">
                      PHONE NUMBER
                      <input
                        className="min-w-0 w-full rounded-none border-0 border-b border-[#bbac99] bg-transparent px-0 py-[11px] text-[13px] font-normal tracking-normal text-ink outline-none placeholder:text-[#8b8175] focus:border-orange"
                        name="phone"
                        type="tel"
                        placeholder="Your contact number"
                      />
                    </label>
                    <label className="flex flex-col gap-[10px] text-[10px] font-bold tracking-[.13em]">
                      PROJECT TYPE
                      <select
                        className="min-w-0 w-full rounded-none border-0 border-b border-[#bbac99] bg-transparent px-0 py-[11px] text-[13px] font-normal tracking-normal text-ink outline-none placeholder:text-[#8b8175] focus:border-orange"
                        name="projectType"
                        defaultValue=""
                        required
                      >
                        <option value="" disabled>
                          Select a project type
                        </option>
                        <option>Residential interiors</option>
                        <option>Luxury villa</option>
                        <option>Modern apartment</option>
                        <option>Commercial space</option>
                        <option>Architecture</option>
                        <option>Renovation</option>
                        <option>Other</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-[10px] text-[10px] font-bold tracking-[.13em]">
                      ESTIMATED BUDGET
                      <select
                        className="min-w-0 w-full rounded-none border-0 border-b border-[#bbac99] bg-transparent px-0 py-[11px] text-[13px] font-normal tracking-normal text-ink outline-none placeholder:text-[#8b8175] focus:border-orange"
                        name="budget"
                        defaultValue=""
                      >
                        <option value="">Prefer to discuss</option>
                        <option>Under $25,000</option>
                        <option>$25,000 – $75,000</option>
                        <option>$75,000 – $150,000</option>
                        <option>$150,000+</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-[10px] text-[10px] font-bold tracking-[.13em]">
                      PREFERRED DATE
                      <input
                        className="min-w-0 w-full rounded-none border-0 border-b border-[#bbac99] bg-transparent px-0 py-[11px] text-[13px] font-normal tracking-normal text-ink outline-none placeholder:text-[#8b8175] focus:border-orange"
                        name="date"
                        type="date"
                      />
                    </label>
                    <label className="col-span-full max-[560px]:col-auto flex flex-col gap-[10px] text-[10px] font-bold tracking-[.13em]">
                      TELL US ABOUT YOUR SPACE
                      <textarea
                        className="min-w-0 w-full rounded-none border-0 border-b border-[#bbac99] bg-transparent px-0 py-[11px] text-[13px] font-normal tracking-normal text-ink outline-none placeholder:text-[#8b8175] focus:border-orange resize-y"
                        name="message"
                        placeholder="What are you dreaming of?"
                        rows={4}
                        required
                        minLength={10}
                      />
                    </label>
                  </div>
                  {error && (
                    <p
                      className="mt-[15px] text-[13px] text-[#a23616]"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}
                  <button
                    className="group mt-[26px] inline-flex min-h-[56px] w-full items-center justify-between gap-8 rounded-[15px] border border-[#d76709] bg-orange py-2 pl-5 pr-2 text-[11px] font-bold uppercase tracking-[.12em] text-white shadow-[0_10px_24px_rgba(38,35,31,.12)] transition-[background-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#cf6408] hover:shadow-[0_14px_28px_rgba(38,35,31,.16)] disabled:cursor-wait disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-orange disabled:hover:shadow-[0_10px_24px_rgba(38,35,31,.12)] motion-reduce:transform-none motion-reduce:transition-none"
                    type="submit"
                    disabled={sending}
                  >
                    <span>{sending ? "Sending…" : "Send your inquiry"}</span>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[15px] bg-white/15 transition-[background-color,transform] duration-300 group-hover:translate-x-0.5 group-hover:bg-white/25 group-disabled:transform-none group-disabled:bg-white/15 motion-reduce:transform-none motion-reduce:transition-none">
                      <ArrowUpRight size={18} strokeWidth={1.7} />
                    </span>
                  </button>
                  <p className="mt-3 text-[11px] text-muted">
                    Your details are used only to respond to your inquiry.
                  </p>
                </form>
              )}
            </Reveal>
          </div>
        </section>

        <section
          className="scroll-mt-[76px] py-[130px] max-[760px]:py-20 bg-aura-white"
          id="contact"
        >
          <div className="mx-auto w-[calc(100%-88px)] max-w-[1360px] max-[1050px]:w-[calc(100%-64px)] max-[760px]:w-[calc(100%-40px)] grid grid-cols-2 items-center gap-[10%] max-[1050px]:gap-[6%] max-[760px]:grid-cols-1 max-[760px]:gap-[25px]">
            <Reveal>
              <Label>FIND US</Label>
              <h2 className="mt-[23px] mb-[30px] font-display text-[clamp(3.1rem,5.2vw,6.1rem)] leading-[1.08] font-normal tracking-[-.045em] max-[560px]:text-[clamp(3rem,11vw,4.3rem)]">
                Let&apos;s make
                <br />
                <em>something beautiful.</em>
              </h2>
              <p className="mb-8 max-w-[530px] text-[15px] leading-[1.9] text-muted">
                We collaborate with clients near and far. Share your ideas and
                let&apos;s begin the conversation.
              </p>
              <div className="mt-10 flex flex-col gap-[17px] [&>a]:flex [&>a]:items-center [&>a]:gap-[15px] [&>a]:text-sm [&>span]:flex [&>span]:items-center [&>span]:gap-[15px] [&>span]:text-sm [&_svg]:text-orange">
                {email && (
                  <a href={`mailto:${email}`}>
                    <Mail size={19} />
                    {email}
                  </a>
                )}
                {phone && (
                  <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>
                    <Phone size={19} />
                    {phone}
                  </a>
                )}
                <span>
                  <MapPin size={19} />
                  {address || "Studio visits by appointment"}
                </span>
              </div>
              
            </Reveal>
            <Reveal className="relative h-[400px] overflow-hidden rounded-[15px] bg-[#e4d7c6] max-[760px]:h-[320px] [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0 [&>a]:absolute [&>a]:right-3 [&>a]:bottom-3 [&>a]:flex [&>a]:items-center [&>a]:gap-2 [&>a]:bg-aura-white [&>a]:p-[11px] [&>a]:text-[11px]">
              {address ? (
                <>
                  <iframe
                    title="Aura Interiors studio location"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                    loading="lazy"
                    className="rounded-[15px]"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Google Maps <ArrowUpRight size={16} />
                  </a>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-[35px] text-center text-[#817669] [&_svg]:mb-[23px] [&_svg]:text-orange [&_span]:text-[11px] [&_span]:tracking-[.17em] [&_p]:max-w-[230px] [&_p]:text-[13px] [&_p]:leading-[1.6]">
                  <MapPin size={32} strokeWidth={1.2} />
                  <span>STUDIO LOCATION</span>
                  <p>
                   
                  </p>
                </div>
              )}
            </Reveal>
          </div>
        </section>
      </main>
      <Footer links={links} email={email} />
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            className="fixed right-7  bottom-[calc(28px+env(safe-area-inset-bottom))] rounded-[15px] z-30 grid h-[50px] w-[50px] cursor-pointer place-items-center border-0 bg-orange text-white shadow-[0_8px_25px_#0003] transition-[background,transform] duration-250 hover:-translate-y-[3px] hover:bg-[#cf6408] max-[760px]:right-5 max-[760px]:bottom-[calc(20px+env(safe-area-inset-bottom))] max-[760px]:h-11 max-[760px]:w-11"
            type="button"
            aria-label="Back to top"
            title="Back to top"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: 12 }}
            transition={{ duration: reducedMotion ? 0 : 0.25 }}
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: reducedMotion ? "auto" : "smooth",
              })
            }
          >
            <ArrowUp size={21} strokeWidth={1.7} />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#171411ed] p-[22px] max-[560px]:p-[10px]"
            role="dialog"
            aria-modal="true"
            aria-label={projects[selected].title + " gallery"}
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <div
              className="relative w-full max-w-[1050px] bg-ivory"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-[14px] right-[14px] z-[2] grid h-[42px] w-[42px] cursor-pointer place-items-center border-0 bg-aura-white"
                type="button"
                aria-label="Close gallery"
                onClick={() => setSelected(null)}
              >
                <X />
              </button>
              <div className="relative h-[min(64vh,650px)] [box-shadow:rgba(50,50,93,0.25)_0px_13px_27px_-5px,rgba(0,0,0,0.3)_0px_8px_16px_-8px] max-[560px]:h-[52vh]">
                <Image
                  src={projects[selected].gallery[slide]}
                  alt={projects[selected].title + " image " + (slide + 1)}
                  fill
                  sizes="90vw"
                  unoptimized
                />
              </div>
              <div className="flex items-center justify-between gap-[25px] p-[20px_30px] max-[560px]:items-end max-[560px]:p-4 [&_span]:text-[10px] [&_span]:tracking-[.12em] [&_span]:text-orange [&_h3]:my-[5px] [&_h3]:font-display [&_h3]:text-[2rem] [&_h3]:font-normal max-[560px]:[&_h3]:text-[1.55rem] [&_p]:text-xs [&_p]:text-muted max-[560px]:[&_p]:hidden">
                <div>
                  <span>
                    {projects[selected].type.toUpperCase()} ·{" "}
                    {String(slide + 1).padStart(2, "0")} / 03
                  </span>
                  <h3>{projects[selected].title}</h3>
                  <p>{projects[selected].copy}</p>
                </div>
                <div className="flex shrink-0 gap-2 [&_button]:grid [&_button]:h-[38px] [&_button]:w-[38px] [&_button]:cursor-pointer [&_button]:place-items-center [&_button]:border [&_button]:border-[#b9aa98] [&_button]:bg-transparent">
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={() => setSlide((slide - 1 + 3) % 3)}
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={() => setSlide((slide + 1) % 3)}
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
