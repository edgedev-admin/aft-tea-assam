export type TeaProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  teaType: string;
  image: string;
  gallery: string[];
  accent: string;
  background: string;
  description: string;
  fullDescription: string;
  characteristics: string[];
  experience: string;
  availability: string;
  enquiryEligible: boolean;
  seoTitle: string;
  seoDescription: string;
  note?: string;
  sourceUrl?: string;
};

export type CatalogOffering = {
  name: string;
  type: "Specialty tea" | "Wholesale grade" | "Consumer collection" | "Seasonal offering";
  description: string;
  availability: string;
};

export type TeaCollection = {
  id: string;
  name: string;
  positioning: string;
  description: string;
  offerings: CatalogOffering[];
};

export type TeaCatalogMediaAsset = {
  src: string;
  mobileSrc?: string;
  alt: string;
  width: number;
  height: number;
  objectPosition?: string;
};

export type TeaCatalogMedia = {
  product?: TeaCatalogMediaAsset;
  campaign?: TeaCatalogMediaAsset;
  lifestyle?: TeaCatalogMediaAsset;
};

export type TeaCatalogProduct = {
  id: string;
  label: string;
  name: string;
  grade?: string;
  description: string;
  availability: string;
  href: string;
  cta: string;
  approvalStatus: "verified" | "company-provided" | "confirmation-needed";
  media?: TeaCatalogMedia;
};

export type TeaCatalogChapter = {
  id: "nahorchukbari" | "ekoratoli" | "ajanta-tea" | "contemporary-fusion";
  index: string;
  name: string;
  positioning: string;
  headline: string;
  introduction: string;
  products: TeaCatalogProduct[];
};

export const products: TeaProduct[] = [
  {
    id: "ajanta-gold",
    slug: "ajanta-gold",
    name: "Ajanta Gold",
    brand: "Ajanta Tea",
    category: "Photographed packaged tea",
    teaType: "Classic Assam tea",
    image: "/images/products/ajanta-gold.jpg",
    gallery: ["/images/products/ajanta-gold.jpg", "/images/story/ajanta-gold-campaign.png", "/images/tea/about-3.jpg"],
    accent: "#b98818",
    background: "#f6d46b",
    description: "A classic Assam tea for a strong, comforting everyday cup, presented in Ajanta Tea's distinctive gold pack.",
    fullDescription: "Ajanta Gold brings the familiar strength and warmth of Assam tea to the everyday cup. The photographed pack identifies it as Classic Assam Tea and highlights a blend with long leaves. Its character is designed for tea drinkers who enjoy a brisk, full-bodied brew with rich colour and a satisfying aroma. AFT Techno Trade presents Ajanta Gold as part of the wider Ajanta Tea consumer collection. Current pack sizes, trade availability and the latest product specification should be confirmed directly with the team before ordering.",
    characteristics: ["Classic Assam Tea identified on the photographed pack", "Full-bodied everyday cup", "Brisk character with rich colour and aroma"],
    experience: "Well suited to a familiar morning or afternoon Assam tea ritual, including milk tea prepared to personal taste.",
    availability: "Current pack sizes and availability are confirmed by enquiry.",
    enquiryEligible: true,
    seoTitle: "Ajanta Gold Assam Tea",
    seoDescription: "Discover Ajanta Gold, a full-bodied classic Assam tea in the Ajanta Tea collection from AFT Techno Trade."
  },
  {
    id: "high-societea",
    slug: "high-societea",
    name: "High Societea",
    brand: "Ajanta Tea",
    category: "Photographed packaged tea",
    teaType: "Premium Assam tea",
    image: "/images/products/high-societea.jpg",
    gallery: ["/images/products/high-societea.jpg", "/images/story/ajanta-high-societea-campaign.jpg", "/images/tea/product-3.jpg"],
    accent: "#d7982f",
    background: "#181717",
    description: "A premium Assam tea selection with a refined black-and-gold identity and an emphasis on a rich, aromatic cup.",
    fullDescription: "High Societea is the name shown on the photographed Ajanta Tea pouch. Its black-and-gold presentation positions it as a more refined expression of classic Assam tea, intended for drinkers looking for depth, brightness and aroma in a daily cup. The company document separately names an Ajanta Societea premium CTC offering; the relationship between that written name and this photographed High Societea pack has not yet been confirmed. For that reason, this page preserves the authentic package name and avoids assigning unverified formulation details.",
    characteristics: ["High Societea name preserved from the photographed pack", "Classic Assam Tea identified on packaging", "Premium black-and-gold presentation"],
    experience: "A polished everyday Assam tea experience for drinkers who favour an aromatic, well-rounded cup.",
    availability: "Current formulation, pack sizes and availability are confirmed by enquiry.",
    enquiryEligible: true,
    seoTitle: "High Societea by Ajanta Tea",
    seoDescription: "Explore High Societea, the photographed premium Assam tea presentation in the Ajanta Tea collection."
  },
  {
    id: "kolkata-street-masala-chai",
    slug: "kolkata-street-masala-chai",
    name: "Kolkata Street Masala Chai",
    brand: "Ajanta Tea",
    category: "Photographed packaged tea",
    teaType: "Masala chai",
    image: "/images/products/kolkata-street-masala-chai.jpg",
    gallery: ["/images/products/kolkata-street-masala-chai.jpg", "/images/story/ajanta-kolkata-masala-campaign.jpg", "/images/tea/about-4.jpg"],
    accent: "#c7201c",
    background: "#f5c31e",
    description: "A bold Ajanta Tea masala chai inspired by Kolkata's street-side tea culture and made for a warming, satisfying cup.",
    fullDescription: "Kolkata Street Masala Chai takes its cue from the lively, robust tea culture of Kolkata. The documented concept brings a strong Assam tea base together with warming spice character for a bold cup that can stand up to milk. Its bright yellow pack, city artwork and direct naming give the product an energetic identity within the Ajanta Tea collection. Because the current package ingredient panel has not been supplied, this page does not publish a definitive ingredient list. Buyers should confirm the current formulation, pack sizes and availability with AFT Techno Trade.",
    characteristics: ["Kolkata-inspired Ajanta Tea packaging", "Robust tea base with warming spice character", "Developed for a bold masala chai experience"],
    experience: "A lively, warming cup inspired by street-side chai, especially suited to preparation with milk.",
    availability: "Current ingredients, pack sizes and availability are confirmed by enquiry.",
    enquiryEligible: true,
    seoTitle: "Kolkata Street Masala Chai",
    seoDescription: "Discover Kolkata Street Masala Chai from Ajanta Tea, a bold Assam tea and warming spice experience."
  },
  {
    id: "golden-pearl",
    slug: "golden-pearl",
    name: "Nahorchukbari Golden Pearl",
    brand: "Nahorchukbari",
    category: "Historic specialty micro-lot",
    teaType: "Handcrafted Assam specialty tea",
    image: "/images/story/golden-pearl-jar.png",
    gallery: ["/images/story/golden-pearl-jar.png", "/images/story/fresh-leaf.jpg", "/images/story/garden-path.jpg"],
    accent: "#d9a22a",
    background: "#1c362a",
    description: "A handcrafted Assam specialty tea whose one-kilogram lot fetched Rs 99,999 at the Guwahati Tea Auction Centre in February 2022.",
    fullDescription: "Nahorchukbari Golden Pearl represents AFT Techno Trade's specialty tea ambition. The company describes a selective process centred on tender buds, careful withering, hand-rolling and controlled finishing to form the tea's distinctive pearl-like leaf. Independent reporting confirms that a one-kilogram lot owned by AFT Techno Trade and produced at Nahorchukbari, Lahowal, was sold at the Guwahati Tea Auction Centre on 14 February 2022. Assam Tea Traders purchased the lot for Rs 99,999 per kilogram. That figure records a particular historic auction result, not a current retail price or a promise about future lots.",
    characteristics: ["Selective bud-focused specialty production", "Handcrafted pearl-like leaf", "Verified GTAC sale 7, lot 5001 on 14 February 2022"],
    experience: "A rare, small-lot expression of Upper Assam craftsmanship, intended for careful appreciation rather than everyday commodity supply.",
    availability: "Historic specialty product. Current production and availability must be confirmed directly.",
    enquiryEligible: true,
    seoTitle: "Nahorchukbari Golden Pearl Tea",
    seoDescription: "Read the verified story of Nahorchukbari Golden Pearl, AFT Techno Trade's handcrafted Assam specialty tea sold at GTAC in 2022.",
    note: "The Rs 99,999/kg figure is a verified historic auction result from February 2022, not a current price.",
    sourceUrl: "https://www.moneycontrol.com/news/trends/assam-speciality-tea-golden-pearl-auctioned-at-record-rs-99999-per-kg-8100941.html"
  }
];

export const teaCollections: TeaCollection[] = [
  {
    id: "nahorchukbari",
    name: "Nahorchukbari",
    positioning: "The art of specialty tea",
    description: "Small-batch and handcrafted expressions that explore the finer possibilities of Upper Assam leaf.",
    offerings: [
      { name: "Golden Pearl", type: "Specialty tea", description: "A handcrafted, pearl-shaped Assam tea with a verified 2022 GTAC auction chapter.", availability: "Historic micro-lot; enquire about current production." },
      { name: "Assam Golden Needles & Velvet Tips", type: "Specialty tea", description: "Company-documented bud-focused specialty selections associated with a soft, naturally sweet cup.", availability: "Seasonal availability by enquiry." },
      { name: "Artisanal Orthodox Whole Leaf", type: "Specialty tea", description: "Company-documented FTGFOP and TGFOP whole-leaf grades made to retain leaf structure and golden tips.", availability: "Grades and lots by enquiry." }
    ]
  },
  {
    id: "ekoratoli",
    name: "Ekoratoli",
    positioning: "CTC tea for a stronger cup",
    description: "Commercial Assam CTC grades developed for briskness, rich colour and dependable performance in milk tea.",
    offerings: [
      { name: "Broken Pekoe (BP)", type: "Wholesale grade", description: "A dense CTC grade for a full-bodied, brisk liquor with strong colour.", availability: "Bulk lots by enquiry." },
      { name: "Pekoe Fannings (PF)", type: "Wholesale grade", description: "A smaller CTC grade designed for quick infusion, colour and body.", availability: "Bulk lots by enquiry." },
      { name: "Pekoe Dust (PD)", type: "Wholesale grade", description: "A rapid-infusing commercial grade suited to high-throughput tea preparation.", availability: "Bulk lots by enquiry." },
      { name: "Clonal Garden Blends", type: "Wholesale grade", description: "Company-documented Assam CTC blends developed around repeatable commercial cup profiles.", availability: "Profiles and lots by enquiry." }
    ]
  },
  {
    id: "ajanta",
    name: "Ajanta Tea",
    positioning: "A tea for everyday moments",
    description: "Consumer-focused Assam teas spanning classic, premium, cardamom and street-style chai experiences.",
    offerings: [
      { name: "Ajanta Gold", type: "Consumer collection", description: "A photographed classic Assam tea for a brisk, full-bodied everyday cup.", availability: "Current packs by enquiry." },
      { name: "Ajanta Elaichi", type: "Consumer collection", description: "A company-documented Assam tea and cardamom offering with an aromatic chai profile.", availability: "Current formulation and packs by enquiry." },
      { name: "Ajanta Societea / High Societea", type: "Consumer collection", description: "The document and photographed pack use different names; the premium Assam tea relationship awaits confirmation.", availability: "Name and formulation to be confirmed." },
      { name: "Kolkata Street Masala Chai", type: "Consumer collection", description: "A photographed bold masala chai inspired by Kolkata's street-side tea culture.", availability: "Current packs by enquiry." }
    ]
  },
  {
    id: "fusion",
    name: "Contemporary & Fusion",
    positioning: "Tea beyond the familiar",
    description: "Documented concepts that pair Assam tea with contemporary flavour directions and limited seasonal ideas.",
    offerings: [
      { name: "Artisanal Chocolate Tea", type: "Seasonal offering", description: "A company-documented Assam black tea concept with roasted cocoa and chocolate character.", availability: "Formulation and availability by enquiry." },
      { name: "Special Seasonal Releases", type: "Seasonal offering", description: "Limited blends developed around botanicals, fruit zest or warming spices.", availability: "Seasonal; enquire for the current list." }
    ]
  }
];

export const teaCatalogChapters: TeaCatalogChapter[] = [
  {
    id: "nahorchukbari",
    index: "01",
    name: "Nahorchukbari",
    positioning: "The art of specialty tea",
    headline: "Nahorchukbari. Tea as a craft.",
    introduction: "Created for those who appreciate the details of exceptional tea, Nahorchukbari brings together carefully handled leaf, traditional craftsmanship and distinctive specialty selections from Upper Assam.",
    products: [
      {
        id: "golden-pearl",
        label: "Handcrafted specialty tea",
        name: "Golden Pearl",
        description: "A distinctive specialty tea made from carefully selected tender buds and individually hand-rolled into compact pearls. As the leaves unfurl, they produce an amber infusion with malty, honeyed and delicate floral notes.",
        availability: "Historic micro-lot; current production by enquiry.",
        href: "/teas/golden-pearl",
        cta: "Discover Golden Pearl",
        approvalStatus: "company-provided"
      },
      {
        id: "golden-needles-velvet-tips",
        label: "Specialty bud tea",
        name: "Golden Needles & Velvet Tips",
        description: "Crafted from fine tea buds selected during prime growing periods, this specialty selection is associated with golden liquor, gentle sweetness and a delicate character.",
        availability: "Seasonal availability by enquiry.",
        href: "/contact",
        cta: "Enquire About This Tea",
        approvalStatus: "company-provided"
      },
      {
        id: "orthodox-whole-leaf",
        label: "Orthodox tea",
        name: "Artisanal Orthodox Whole Leaf",
        grade: "FTGFOP & TGFOP",
        description: "An expressive whole-leaf Assam selection that preserves the character of the leaf and its golden tips, with fragrant character, medium body and familiar malty depth.",
        availability: "Current grades and lots by enquiry.",
        href: "/contact",
        cta: "Enquire About This Tea",
        approvalStatus: "company-provided"
      }
    ]
  },
  {
    id: "ekoratoli",
    index: "02",
    name: "Ekoratoli",
    positioning: "Strength for the everyday cup",
    headline: "Ekoratoli. The strength of Assam.",
    introduction: "Made for the full-bodied character of traditional Assam chai, Ekoratoli brings together CTC grades and blends developed for briskness, rich colour and a satisfying everyday cup.",
    products: [
      {
        id: "broken-pekoe",
        label: "Commercial CTC grade",
        name: "Broken Pekoe (BP)",
        description: "A dense, uniform Assam CTC grade producing a robust, brisk infusion with a rich reddish-copper colour. Particularly suited to strong milk tea and commercial blending requirements.",
        availability: "Bulk lots by enquiry.",
        href: "/wholesale",
        cta: "Discuss This Grade",
        approvalStatus: "company-provided"
      },
      {
        id: "pekoe-fannings",
        label: "Commercial CTC grade",
        name: "Pekoe Fannings (PF)",
        description: "A finer CTC grade valued for quick infusion, pronounced body and strong liquor, making it suitable for everyday chai and high-volume preparation.",
        availability: "Bulk lots by enquiry.",
        href: "/wholesale",
        cta: "Discuss This Grade",
        approvalStatus: "company-provided"
      },
      {
        id: "pekoe-dust",
        label: "Commercial CTC grade",
        name: "Pekoe Dust (PD)",
        description: "A fine Assam CTC grade developed for rapid colour release and a brisk, full-bodied cup, especially suited to buyers seeking strength and efficient brewing.",
        availability: "Bulk lots by enquiry.",
        href: "/wholesale",
        cta: "Discuss This Grade",
        approvalStatus: "company-provided"
      },
      {
        id: "clonal-garden-blends",
        label: "CTC blend",
        name: "Clonal Garden Blends",
        description: "Blends developed from selected Assam clonal tea varieties, combining aromatic character with a rich liquor profile for commercial tea applications.",
        availability: "Profiles and lots by enquiry.",
        href: "/wholesale",
        cta: "Discuss This Blend",
        approvalStatus: "company-provided"
      }
    ]
  },
  {
    id: "ajanta-tea",
    index: "03",
    name: "Ajanta Tea",
    positioning: "Everyday tea, distinctive character",
    headline: "Ajanta Tea. Made for life's tea moments.",
    introduction: "The Ajanta Tea collection brings together the familiar richness of Assam tea with aromatic, premium and spiced variations. From the everyday morning cup to an expressive masala chai, each offering presents its own tea-drinking character.",
    products: [
      {
        id: "ajanta-gold",
        label: "Classic Assam tea",
        name: "Ajanta Gold",
        description: "A full-bodied Assam tea blend created for those who enjoy a strong, satisfying everyday cup, with brisk malty character, rich colour and a comforting tea aroma.",
        availability: "Current packs and availability by enquiry.",
        href: "/teas/ajanta-gold",
        cta: "Discover This Tea",
        approvalStatus: "verified"
      },
      {
        id: "ajanta-elaichi",
        label: "Cardamom tea",
        name: "Ajanta Elaichi",
        description: "A fragrant variation of classic Assam chai, combining a robust black tea base with the sweet, distinctive aromatic character associated with cardamom.",
        availability: "Current formulation and packs by enquiry.",
        href: "/contact",
        cta: "Request Product Details",
        approvalStatus: "company-provided"
      },
      {
        id: "high-societea",
        label: "Premium Assam tea",
        name: "High Societea",
        description: "A premium Assam tea selection developed for a rich, aromatic cup with an emphasis on depth, refinement and satisfying flavour.",
        availability: "Current formulation and packs by enquiry.",
        href: "/teas/high-societea",
        cta: "Discover This Tea",
        approvalStatus: "confirmation-needed"
      },
      {
        id: "kolkata-street-masala-chai",
        label: "Spiced Assam chai",
        name: "Kolkata Street Masala Chai",
        description: "Inspired by Kolkata's lively tea culture, this blend pairs strong Assam tea with a warming spice character for a bold, flavourful chai experience.",
        availability: "Current formulation and packs by enquiry.",
        href: "/teas/kolkata-street-masala-chai",
        cta: "Discover This Tea",
        approvalStatus: "verified"
      }
    ]
  },
  {
    id: "contemporary-fusion",
    index: "04",
    name: "Contemporary & Fusion",
    positioning: "Tea beyond the familiar",
    headline: "New ideas. Rooted in tea.",
    introduction: "Beyond classic tea preparations, the AFT Techno Trade range explores combinations of Assam black tea with contemporary flavours and seasonal ingredients.",
    products: [
      {
        id: "artisanal-chocolate-tea",
        label: "Flavoured tea",
        name: "Artisanal Chocolate Tea",
        description: "An inventive pairing of full-bodied Assam black tea and chocolate-inspired flavours, combining the richness of tea with the warm, roasted character of cacao.",
        availability: "Current formulation and availability by enquiry.",
        href: "/contact",
        cta: "Enquire About Availability",
        approvalStatus: "company-provided"
      },
      {
        id: "seasonal-releases",
        label: "Limited / seasonal offerings",
        name: "Special Seasonal Releases",
        description: "Selected seasonal tea explorations featuring changing flavour combinations and botanical influences, developed to offer fresh experiences beyond the everyday cup.",
        availability: "Seasonal; enquire for the current list.",
        href: "/contact",
        cta: "Enquire About Availability",
        approvalStatus: "company-provided"
      }
    ]
  }
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function relatedProducts(slug: string) {
  return products.filter((product) => product.slug !== slug).slice(0, 3);
}
