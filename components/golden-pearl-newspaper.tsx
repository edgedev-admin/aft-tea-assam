import Link from "next/link";
import { CloudinaryImage } from "./cloudinary-image";
import styles from "./golden-pearl-newspaper.module.css";

export function GoldenPearlNewspaper() {
  return (
    <section className={styles.newspaper} aria-labelledby="golden-pearl-newspaper-title">
      <div className={styles.sheet}>
        <header className={styles.masthead}>
          <div className={styles.meta}>GUWAHATI<br />MONDAY<br /><time dateTime="2022-02-14">FEBRUARY 14, 2022</time></div>
          <div className={styles.mastheadBrand}>
            <p className={styles.mastheadTitle}>The AFT Tea Chronicle</p>
            <p className={styles.mastheadSubtitle}>AFT TECHNO TRADE <span aria-hidden="true">·</span> DIKOM &amp; LAHOWAL</p>
          </div>
          <div className={styles.meta}>ESTD. 2018<br />UPPER ASSAM<br />SPECIAL EDITION</div>
        </header>

        <div className={styles.stripe} aria-hidden="true" />

        <h2 id="golden-pearl-newspaper-title" className={styles.headline}>
          Assam Golden Pearl tea sold at record <span>₹99,999</span> per kg
        </h2>
        <p className={styles.deck}>Handcrafted speciality tea from Dibrugarh makes headlines at Guwahati Tea Auction Centre</p>

        <div className={styles.story}>
          <article className={styles.article}>
            <div className={styles.byline}>NEWS FEATURE</div>
            <p><span className={styles.dateline}>GUWAHATI, FEB 14:</span> A one-kilogram lot of Nahorchukbari Golden Pearl tea, produced at Lahowal near Dibrugarh by AFT Techno Trade, fetched ₹99,999 per kg at the Guwahati Tea Auction Centre.</p>
            <p>The speciality tea was purchased by Assam Tea Traders and sold through Parcon (India) Pvt. Ltd. It attracted attention for its distinctive handcrafted processing and premium quality.</p>
            <p>The achievement places the tea among Assam&apos;s most notable speciality offerings and draws attention to the skill of small growers and local producers.</p>
          </article>

          <figure className={styles.hero}>
            <div className={styles.photo}>
              <div className={styles.teaDetail} aria-hidden="true" />
              <CloudinaryImage
                className={styles.product}
                src="/images/story/golden-pearl-jar.png"
                alt="Nahorchukbari Golden Pearl tea in its glass jar with yellow label"
                fill
                quality={90}
                sizes="(max-width: 700px) 92vw, (max-width: 1120px) 62vw, 55vw"
              />
            </div>
            <figcaption>Nahorchukbari Golden Pearl, the speciality tea that fetched ₹99,999 per kg at auction. Product image supplied by AFT Techno Trade.</figcaption>
          </figure>

          <aside className={styles.sidebar}>
            <div>
              <div className={styles.pullQuote} aria-hidden="true">“</div>
              <h3>A milestone for Assam&apos;s speciality tea</h3>
            </div>
            <div>
              <p>The ₹99,999 price matched the benchmark achieved by Manohari Gold in December 2021.</p>
              <p>Nahorchukbari, established in 2018, sources fresh tea leaves from small growers in the region.</p>
              <p className={styles.priceContext}>Historical result for a one-kilogram auction lot on 14 February 2022—not a current selling price.</p>
            </div>
          </aside>
        </div>

        <div className={styles.featureRow}>
          <section>
            <h3>A milestone for Assam&apos;s speciality tea segment</h3>
            <p>The auction result highlights the growing recognition of handcrafted speciality teas from Assam.</p>
          </section>
          <section>
            <h3>Built on local strength</h3>
            <p>Local small growers play an important role in supplying leaves for speciality tea production.</p>
          </section>
          <section>
            <h3>Greater global recognition</h3>
            <p>High-value auction results have brought increased attention to Assam&apos;s distinctive tea offerings.</p>
          </section>
        </div>

        <footer className={styles.source}>
          <p><strong>Editorial recreation for the AFT Techno Trade website.</strong> This is not an official page or reproduction of The Assam Tribune. Based on historical reporting from <a href="https://assamtribune.com/assam/assam-golden-pearl-tea-sold-at-record-rs-99999-per-kg-1354674" target="_blank" rel="noopener noreferrer">The Assam Tribune</a> and <a href="https://eastmojo.com/assam/2022/02/14/golden-pearl-tea-line-fetches-%E2%82%B91-lakh-in-debut-auction-at-gtac/" target="_blank" rel="noopener noreferrer">EastMojo</a>.</p>
          <Link href="/teas/golden-pearl">Read the Golden Pearl story <span aria-hidden="true">↗</span></Link>
        </footer>
      </div>
    </section>
  );
}
