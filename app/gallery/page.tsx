import type { Metadata } from "next";
import Image from "next/image";
import { AftPage, AftSection } from "../../components/aft-page";
export const metadata: Metadata = { title: "Gallery | AFT Tea Factory", description: "A visual collection of Assam tea landscapes, leaves and speciality tea." };
const images=[['/images/tea/assam-dawn.png','Assam tea landscape'],['/images/tea/about-1.jpg','Tea leaf detail'],['/images/tea/product-1.jpg','Speciality tea'],['/images/tea/product-2.jpg','Loose tea leaves'],['/images/tea/about-3.jpg','Tea leaf'],['/images/tea/product-3.jpg','Assam black tea']];
export default function GalleryPage(){return <AftPage kicker="Gallery" title="From landscape\nto leaf." intro="A collection of tea-related imagery used across AFT’s tea story. These are illustrative tea visuals and are not represented as factory documentation." image="/images/tea/assam-dawn.png"><AftSection kicker="Tea in view" title="Assam, tea and craft"><div className="aft-gallery">{images.map(([src,alt])=><figure key={src}><Image src={src} alt={alt} fill sizes="(max-width: 760px) 50vw, 33vw"/><figcaption>{alt}</figcaption></figure>)}</div></AftSection></AftPage>}
