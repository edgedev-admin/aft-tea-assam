"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Leaf, Layers3, Star, UsersRound } from "lucide-react";
import { Reveal, RevealHeading } from "./reveal";
import "../app/testimonials.css";
import "../app/carousel-motion.css";

const milestones = [[UsersRound, "2019", "Commercial production begins"], [Layers3, "₹99,999", "Golden Pearl auction price / kg"], [Star, "DIBRUGARH", "Assam origin"], [UsersRound, "EKORATOLI CLONAL", "Registered tea mark"]] as const;
const testimonials = [
  { name: "Sample testimonial", role: "Demo content", initials: "S", text: "Sample content shown solely to demonstrate the testimonial carousel layout until approved customer feedback is provided." },
  { name: "Sarah M.", role: "Homeowner", initials: "SM", text: "The team completely transformed our backyard into a peaceful retreat. Their attention to detail, plant selection, and care made the entire process smooth and enjoyable." },
  { name: "Sample testimonial", role: "Demo content", initials: "S", text: "Sample content shown solely to demonstrate the testimonial carousel layout until approved customer feedback is provided." },
] as const;

export function ResponsiveTestimonialsSection() {
  const [active, setActive] = useState(1);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [cardWidth, setCardWidth] = useState(600);
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
    const updateCardWidth = () => {
      const viewport = window.innerWidth;
      setCardWidth(viewport <= 600 ? viewport - 68 : viewport <= 900 ? Math.min(viewport * .76, 600) : 600);
    };
    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, []);

  useEffect(() => {
    if (reduce || paused || !visible) return;
    const timer = window.setTimeout(() => move(1), 4000);
    return () => window.clearTimeout(timer);
  }, [active, paused, reduce, visible]);

  const trackOffset = active * (cardWidth + 22) + cardWidth / 2;
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
        <div className="testimonial-track responsive-testimonial-track" style={{ "--track-offset": `${trackOffset}px` } as React.CSSProperties}>{testimonials.map((item, index) => <article className={`testimonial-card ${index === active ? "is-active" : ""}`} key={`${item.name}-${index}`} aria-hidden={index !== active}><div className="stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, star) => <Star key={star} size={20}/>)}</div><p>“{item.text}”</p><div className="card-divider"><span/><Leaf size={20}/><span/></div><div className="testimonial-person"><span>{item.initials}</span><div><b>{item.name}</b><small>{item.role}</small></div></div></article>)}</div>
        <button className="carousel-control next" onClick={() => move(1)} aria-label="Next testimonial"><ChevronRight size={19}/></button>
      </div></Reveal>
      <div className="carousel-dots">{testimonials.map((_, index) => <button aria-label={`Show testimonial ${index + 1}`} className={index === active ? "active" : ""} key={index} onClick={() => setActive(index)}/>)}</div>
    </div>
  </section>;
}
