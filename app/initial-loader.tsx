"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Loading from "./loading";

export default function InitialLoader() {
  const [loading, setLoading] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    let minimumElapsed = false;
    let assetsReady = false;
    const finish = () => {
      if (!cancelled && minimumElapsed && assetsReady) setLoading(false);
    };
    const onLoad = () => {
      // Font loading can finish after the document load event.
      void document.fonts.ready.then(() => {
        assetsReady = true;
        finish();
      });
    };
    const minimum = window.setTimeout(() => {
      minimumElapsed = true;
      finish();
    }, 500);
    // External assets must never leave the page behind an endless overlay.
    const timeout = window.setTimeout(() => setLoading(false), 10000);
    window.addEventListener("load", onLoad, { once: true });
    if (document.readyState === "complete") onLoad();

    return () => {
      cancelled = true;
      window.clearTimeout(minimum);
      window.clearTimeout(timeout);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return <>
    <noscript><style>{"#initial-loader { display: none !important; }"}</style></noscript>
    <AnimatePresence>
      {loading && <motion.div
        id="initial-loader"
        className="fixed inset-0 z-[100] overflow-y-auto bg-ivory"
        initial={false}
        exit={{ opacity: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.45, ease: "easeOut" }}
      >
        <Loading />
      </motion.div>}
    </AnimatePresence>
  </>;
}
