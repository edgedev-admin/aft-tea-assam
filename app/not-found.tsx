import Link from "next/link";
import { ArrowUpRight, Leaf } from "lucide-react";
import "./not-found.css";

export default function NotFound() {
  return <main className="not-found"><div className="not-found-mark"><Leaf aria-hidden="true"/></div><p className="not-found-label">404 · AFT Tea Factory</p><h1>This page is not part of our tea collection.</h1><p>Return to AFT Tea Factory to explore Assam tea and the story behind it.</p><Link className="not-found-link" href="/">Return home <ArrowUpRight size={16}/></Link></main>;
}
