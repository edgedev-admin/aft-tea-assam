"use client";
import { Menu, X } from "lucide-react";
import { useState } from "react";
const links = ["Home", "About", "Gallery", "Our Projects", "Contact"];
export function MobileMenu() { const [open, setOpen] = useState(false); return <><button className="menu" aria-label="Open navigation" onClick={() => setOpen(true)}><Menu size={25}/></button>{open && <div className="drawer"><button aria-label="Close navigation" onClick={() => setOpen(false)}><X size={28}/></button>{links.map(x => <a href={x === "Home" ? "#home" : `#${x.toLowerCase().replaceAll(" ", "-")}`} onClick={() => setOpen(false)} key={x}>{x}</a>)}<a className="button" href="#contact" onClick={() => setOpen(false)}>Get a Free Quote</a></div>}</>; }
