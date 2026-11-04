import AuraLogo from "../components/AuraLogo";

export default function Loading() {
  return (
    <main className="grid min-h-svh place-items-center bg-ivory px-5 py-10" role="status" aria-live="polite">
      <div className="text-center">
        <AuraLogo className="mx-auto h-20 w-20" />
        <p className="mt-[15px] mb-7 text-[11px] font-bold tracking-[.3em]">AURA INTERIORS</p>
        <p className="mb-[18px] text-[13px] text-muted">Preparing your experience</p>
        <span className="mx-auto block h-[2px] w-40 overflow-hidden bg-[#cbbda9] [&>span]:block [&>span]:h-full [&>span]:w-full [&>span]:animate-loading-progress [&>span]:bg-orange motion-reduce:[&>span]:animate-none" aria-hidden="true"><span /></span>
      </div>
    </main>
  );
}
