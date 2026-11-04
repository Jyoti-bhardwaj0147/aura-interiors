import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="block bg-aura-white">
      <div className="mx-auto w-[calc(100%-88px)] max-w-[1360px] max-[1050px]:w-[calc(100%-64px)] max-[760px]:w-[calc(100%-40px)] relative flex min-h-svh items-center py-[120px]">
        <Link className="inline-flex items-center gap-[10px] text-[18px] leading-[.9] font-bold tracking-[.18em] [&_b]:font-display [&_b]:text-[43px] [&_b]:leading-none [&_b]:font-normal [&_b]:tracking-[-.12em] [&_b_span]:text-orange [&>span]:flex [&>span]:flex-col [&>span]:gap-[5px] [&_small]:text-[8px] [&_small]:font-semibold [&_small]:tracking-[.4em] absolute top-8 left-0 max-[760px]:top-6" href="/" aria-label="Aura Interiors, back to home">
          <b>A<span>.</span></b><span>AURA<small>INTERIORS</small></span>
        </Link>
        <div className="w-full min-w-0 max-w-[740px]">
          <p className="m-0 flex items-center gap-[14px] text-[11px] font-bold tracking-[.19em] text-orange [&>span]:h-px [&>span]:w-[26px] [&>span]:bg-current"><span />404 / PAGE NOT FOUND</p>
          <h1 className="mt-[23px] mb-[18px] font-display text-[clamp(3.1rem,5.2vw,6.1rem)] leading-[1.08] font-normal tracking-[-.045em] max-[560px]:text-[clamp(3rem,11vw,4.3rem)]">This space is <em>yet to be found.</em></h1>
          <p className="mb-8 max-w-[530px] text-[15px] leading-[1.9] text-muted">The page you&apos;re looking for isn&apos;t here. Let&apos;s take you back to the beginning.</p>
          <Link className="inline-flex min-h-[54px] cursor-pointer items-center justify-between gap-[42px] border-0 bg-orange px-[22px] py-4 text-[11px] font-bold uppercase tracking-[.12em] text-white transition-[background,transform] duration-250 hover:-translate-y-[2px] hover:bg-[#cf6408] disabled:cursor-wait disabled:opacity-60 disabled:hover:translate-y-0" href="/">Back to home <ArrowUpRight size={18} /></Link>
        </div>
      </div>
    </main>
  );
}
