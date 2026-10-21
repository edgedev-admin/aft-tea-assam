import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./final-contact-cta.module.css";

export function FinalContactCta() {
  return (
    <section className={styles.section} aria-labelledby="final-contact-title">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Partner with AFT Techno Trade</p>
        <h2 id="final-contact-title">Your next tea begins with a conversation.</h2>
        <p className={styles.body}>
          From classic Assam CTC to specialty tea selections and custom supply
          requirements, tell us what you&apos;re looking for. Our team welcomes enquiries
          from retailers, wholesalers and business partners.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primary} href="/wholesale">
            Discuss Your Requirements <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
          <Link className={styles.secondary} href="/teas">
            Explore Our Tea Collections
          </Link>
        </div>
      </div>
      <figure className={styles.media}>
        <Image
          src="/media/product-campaigns/Gold Tea 2.png"
          alt="Ajanta Gold Assam tea pack photographed among green tea leaves"
          fill
          quality={90}
          sizes="(max-width: 800px) 100vw, 50vw"
        />
      </figure>
    </section>
  );
}
