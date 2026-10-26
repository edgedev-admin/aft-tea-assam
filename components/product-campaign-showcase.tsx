import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { productCampaigns } from "../lib/photographic-stories";
import { CloudinaryImage } from "./cloudinary-image";
import styles from "./product-campaign-showcase.module.css";

export function ProductCampaignShowcase() {
  return (
    <div className={styles.showcase} aria-label="Ajanta Tea campaign photography">
      {productCampaigns.map((campaign, index) => (
        <article className={styles.campaign} data-layout={index + 1} key={campaign.name}>
          <figure>
            <CloudinaryImage
              src={campaign.photo.src}
              alt={campaign.photo.alt}
              fill
              quality={90}
              sizes={index === 0 ? "(max-width: 760px) 100vw, 62vw" : "(max-width: 760px) 100vw, 38vw"}
            />
          </figure>
          <div className={styles.copy}>
            <p>{campaign.descriptor}</p>
            <h3>{campaign.name}</h3>
            <span>{campaign.copy}</span>
            <Link href={campaign.href}>View tea <ArrowUpRight aria-hidden="true" size={16} /></Link>
          </div>
        </article>
      ))}
    </div>
  );
}
