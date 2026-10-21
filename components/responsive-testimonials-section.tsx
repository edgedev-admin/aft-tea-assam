"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Leaf, Layers3, Star, UsersRound } from "lucide-react";
import { Reveal, RevealHeading } from "./reveal";
import "../app/testimonials.css";
import "../app/carousel-motion.css";
import "../app/testimonial-mobile-fix.css";

const milestones = [[UsersRound, "2019", "Commercial production begins"], [Layers3, "₹99,999", "Golden Pearl auction price / kg"], [Star, "DIBRUGARH", "Assam origin"], [UsersRound, "EKORATOLI", "Commercial CTC range"]] as const;
const testimonials = [
  { name: "Jipal Kalita", initials: "JK", text: "Illustrative sample - not an actual customer review. Testimonial awaiting approval for AFT Techno Trade's Assam tea presentation and craft.", status: "Testimonial awaiting approval" },
  { name: "Ramesh Hazarika", initials: "RH", text: "Illustrative sample — not an actual customer review. Customer feedback to be added after confirmation.", status: "Testimonial awaiting approval" },
  { name: "Preetom Das", initials: "PD", text: "Illustrative sample — not an actual customer review. Placeholder for approved feedback about Assam tea quality and regional heritage.", status: "Testimonial awaiting approval" },
  { name: "Abhishek Bailung", initials: "AB", text: "Illustrative sample — not an actual customer review. Customer feedback to be added after confirmation.", status: "Testimonial awaiting approval" },
  { name: "Romoni Kanto", initials: "RK", text: "Illustrative sample — not an actual customer review. Placeholder for approved feedback about AFT’s craftsmanship and presentation.", status: "Testimonial awaiting approval" },
] as const;

export function ResponsiveTestimonialsSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const move = (delta: number) => setActive((value) => (value + delta + testimonials.length) % testimonials.length);

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (reduce || paused || !visible) return;
    const timer = window.setTimeout(() => move(1), 4000);
    return () => window.clearTimeout(timer);
  }, [active, paused, reduce, visible]);

  const finishSwipe = (clientX: number) => {
    if (touchStart === null) return;
    const distance = clientX - touchStart;
    setTouchStart(null);
    if (Math.abs(distance) > 42) move(distance < 0 ? 1 : -1);
  };

  return <section className="aft-testimonials" aria-labelledby="testimonials-title">
    <div className="testimonial-leaves leaves-top" aria-hidden="true"><Leaf/><Leaf/><Leaf/></div>
    <div className="testimonial-leaves leaves-bottom" aria-hidden="true"><Leaf/><Leaf/></div>
    <div className="testimonials-shell">
      <Reveal><p className="testimonials-label"><Leaf size={13}/> Testimonials</p></Reveal>
      <h2 id="testimonials-title"><RevealHeading text={"An Assam Story\nwith Industry Recognition."}/></h2>
      <Reveal delay={.18}><p className="testimonials-intro">From commercial production to a landmark speciality-tea auction, AFT&apos;s story is rooted in Assam and shaped by focused craft.</p></Reveal>
      <Reveal delay={.25}><div className="testimonials-divider"><span/><Leaf size={19}/><span/></div></Reveal>
      <div className="milestone-strip">{milestones.map(([Icon, value, label], index) => <Reveal as="article" delay={index * .09} key={value}><span><Icon size={22}/></span><div><strong>{value}</strong><p>{label}</p></div></Reveal>)}</div>
      <Reveal delay={.14}><div className="testimonial-carousel" aria-roledescription="carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={(event) => { setPaused(true); setTouchStart(event.touches[0]?.clientX ?? null); }} onTouchEnd={(event) => { finishSwipe(event.changedTouches[0]?.clientX ?? 0); setPaused(false); }}>
        <button className="carousel-control previous" onClick={() => move(-1)} aria-label="Previous testimonial"><ChevronLeft size={19}/></button>
        <div className="testimonial-track responsive-testimonial-track" style={{ "--slide-index": active } as React.CSSProperties}>{testimonials.map((item, index) => <article className={`testimonial-card ${index === active ? "is-active" : ""}`} key={`${item.name}-${index}`} aria-hidden={index !== active}><p className="testimonial-status">{item.status}</p><p>“{item.text}”</p><div className="card-divider"><span/><Leaf size={20}/><span/></div><div className="testimonial-person"><span>{item.initials}</span><div><b>{item.name}</b><small>{item.status}</small></div></div></article>)}</div>
        <button className="carousel-control next" onClick={() => move(1)} aria-label="Next testimonial"><ChevronRight size={19}/></button>
      </div></Reveal>
      <div className="carousel-dots">{testimonials.map((_, index) => <button aria-label={`Show testimonial ${index + 1}`} className={index === active ? "active" : ""} key={index} onClick={() => setActive(index)}/>)}</div>
    </div>
  </section>;
}
