import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./base.css";
import "./mobile-optimizations.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });

export const metadata: Metadata = { title: "AFT Tea Factory | AFT Techno Trade", description: "Assam tea shaped by local growing knowledge and manufacturing expertise." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={`${inter.variable} ${playfair.variable}`}>{children}</body></html>; }
