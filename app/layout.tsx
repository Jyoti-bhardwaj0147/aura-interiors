import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Aura Interiors | Spaces that feel like you",
  description: "Thoughtful interior design and architecture for spaces with soul. Explore Aura Interiors' work, services, and design process.",
};

const playfairDisplay = localFont({
  src: [
    { path: "./fonts/PlayfairDisplay-VariableFont_wght.ttf", style: "normal" },
    { path: "./fonts/PlayfairDisplay-Italic-VariableFont_wght.ttf", style: "italic" },
  ],
  variable: "--font-playfair-display",
  weight: "100 900",
  display: "swap",
});
const dmSans = localFont({
  src: [
    { path: "./fonts/DMSans-VariableFont_opsz,wght.ttf", style: "normal" },
    { path: "./fonts/DMSans-Italic-VariableFont_opsz,wght.ttf", style: "italic" },
  ],
  variable: "--font-dm-sans",
  weight: "100 900",
  display: "swap",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`scroll-smooth motion-reduce:scroll-auto ${playfairDisplay.variable} ${dmSans.variable}`}>
      <body className="bg-aura-white font-sans text-ink antialiased selection:bg-pastel selection:text-ink [&_button]:cursor-pointer [&_img]:object-cover [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-orange [&_:focus-visible]:outline-offset-[3px] motion-reduce:[&_*]:!transition-none motion-reduce:[&_*]:!animate-none">
        <SmoothScroll>{children}</SmoothScroll>
        
        </body>
    </html>
  );
}
