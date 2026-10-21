export type CampaignFocalPoint = {
  x: `${number}%`;
  y: `${number}%`;
};

export type CampaignUsageRole =
  | "mosaic-focus"
  | "mosaic-support"
  | "campaign-scene";

export type ProductCampaignAsset = {
  id: string;
  filename: string;
  src: string;
  product: string;
  collection: "Ajanta Tea";
  section: "collection" | "gold" | "high-societea" | "kolkata" | "elaichi";
  width: 1920;
  height: 1080;
  aspectRatio: "16 / 9";
  desktopFocalPoint: CampaignFocalPoint;
  mobileFocalPoint: CampaignFocalPoint;
  usageRole: CampaignUsageRole[];
  productUrl: string;
  alt: string;
  mobileScene?: {
    src: string;
    width: number;
    height: number;
    fit: "contain" | "cover";
    background: string;
  };
};

const basePath = "/media/product-campaigns";

export const productCampaigns: ProductCampaignAsset[] = [
  {
    id: "collection",
    filename: "AFT TEA COLLECTION.png",
    src: `${basePath}/AFT TEA COLLECTION.png`,
    product: "AFT Tea Collection",
    collection: "Ajanta Tea",
    section: "collection",
    width: 1920,
    height: 1080,
    aspectRatio: "16 / 9",
    desktopFocalPoint: { x: "50%", y: "50%" },
    mobileFocalPoint: { x: "50%", y: "50%" },
    usageRole: ["mosaic-focus", "campaign-scene"],
    productUrl: "/teas",
    alt: "Ajanta Tea collection packs displayed in an Assam tea garden",
    mobileScene: {
      src: `${basePath}/mobile/collection.webp`,
      width: 780,
      height: 1080,
      fit: "cover",
      background: "#173d2d"
    }
  },
  {
    id: "gold-1",
    filename: "Gold Tea 1.png",
    src: `${basePath}/Gold Tea 1.png`,
    product: "Ajanta Gold",
    collection: "Ajanta Tea",
    section: "gold",
    width: 1920,
    height: 1080,
    aspectRatio: "16 / 9",
    desktopFocalPoint: { x: "55%", y: "50%" },
    mobileFocalPoint: { x: "50%", y: "50%" },
    usageRole: ["campaign-scene"],
    productUrl: "/teas/ajanta-gold",
    alt: "Ajanta Gold tea pack and a cup of Assam tea in a tea garden",
    mobileScene: {
      src: `${basePath}/mobile/gold.webp`,
      width: 780,
      height: 1080,
      fit: "cover",
      background: "#183a27"
    }
  },
  {
    id: "gold-2",
    filename: "Gold Tea 2.png",
    src: `${basePath}/Gold Tea 2.png`,
    product: "Ajanta Gold",
    collection: "Ajanta Tea",
    section: "gold",
    width: 1920,
    height: 1080,
    aspectRatio: "16 / 9",
    desktopFocalPoint: { x: "50%", y: "50%" },
    mobileFocalPoint: { x: "50%", y: "50%" },
    usageRole: ["mosaic-support"],
    productUrl: "/teas/ajanta-gold",
    alt: "Ajanta Gold tea pack resting among glossy tea leaves"
  },
  {
    id: "gold-3",
    filename: "Gold Tea 3.png",
    src: `${basePath}/Gold Tea 3.png`,
    product: "Ajanta Gold",
    collection: "Ajanta Tea",
    section: "gold",
    width: 1920,
    height: 1080,
    aspectRatio: "16 / 9",
    desktopFocalPoint: { x: "50%", y: "50%" },
    mobileFocalPoint: { x: "50%", y: "50%" },
    usageRole: ["mosaic-support"],
    productUrl: "/teas/ajanta-gold",
    alt: "Ajanta Gold tea pack arranged over Assam tea leaves"
  },
  {
    id: "high-1",
    filename: "High Societea 1.png",
    src: `${basePath}/High Societea 1.png`,
    product: "High Societea",
    collection: "Ajanta Tea",
    section: "high-societea",
    width: 1920,
    height: 1080,
    aspectRatio: "16 / 9",
    desktopFocalPoint: { x: "50%", y: "50%" },
    mobileFocalPoint: { x: "50%", y: "50%" },
    usageRole: ["campaign-scene"],
    productUrl: "/teas/high-societea",
    alt: "High Societea black and gold pack in a warm palace setting",
    mobileScene: {
      src: `${basePath}/mobile/high-societea.webp`,
      width: 780,
      height: 1080,
      fit: "cover",
      background: "#452414"
    }
  },
  {
    id: "high-1-2",
    filename: "High Societea 1(2).png",
    src: `${basePath}/High Societea 1(2).png`,
    product: "High Societea",
    collection: "Ajanta Tea",
    section: "high-societea",
    width: 1920,
    height: 1080,
    aspectRatio: "16 / 9",
    desktopFocalPoint: { x: "50%", y: "50%" },
    mobileFocalPoint: { x: "50%", y: "50%" },
    usageRole: ["mosaic-support"],
    productUrl: "/teas/high-societea",
    alt: "High Societea pack presented before a country house garden"
  },
  {
    id: "high-2",
    filename: "High Societea 2.png",
    src: `${basePath}/High Societea 2.png`,
    product: "High Societea",
    collection: "Ajanta Tea",
    section: "high-societea",
    width: 1920,
    height: 1080,
    aspectRatio: "16 / 9",
    desktopFocalPoint: { x: "50%", y: "50%" },
    mobileFocalPoint: { x: "50%", y: "50%" },
    usageRole: ["mosaic-support"],
    productUrl: "/teas/high-societea",
    alt: "High Societea black and gold pack on a sunlit textured wall"
  },
  {
    id: "high-2-2",
    filename: "High Societea 2(2).png",
    src: `${basePath}/High Societea 2(2).png`,
    product: "High Societea",
    collection: "Ajanta Tea",
    section: "high-societea",
    width: 1920,
    height: 1080,
    aspectRatio: "16 / 9",
    desktopFocalPoint: { x: "50%", y: "50%" },
    mobileFocalPoint: { x: "50%", y: "50%" },
    usageRole: ["mosaic-support"],
    productUrl: "/teas/high-societea",
    alt: "High Societea pack arranged on deep red velvet"
  },
  {
    id: "kolkata-1",
    filename: "Kolkata Tea 1.png",
    src: `${basePath}/Kolkata Tea 1.png`,
    product: "Kolkata Street Masala Chai",
    collection: "Ajanta Tea",
    section: "kolkata",
    width: 1920,
    height: 1080,
    aspectRatio: "16 / 9",
    desktopFocalPoint: { x: "50%", y: "50%" },
    mobileFocalPoint: { x: "48%", y: "50%" },
    usageRole: ["mosaic-support"],
    productUrl: "/teas/kolkata-street-masala-chai",
    alt: "Kolkata Street Masala Chai pack and cup before the Victoria Memorial"
  },
  {
    id: "kolkata-1-2",
    filename: "Kolkata Tea 1(2).png",
    src: `${basePath}/Kolkata Tea 1(2).png`,
    product: "Kolkata Street Masala Chai",
    collection: "Ajanta Tea",
    section: "kolkata",
    width: 1920,
    height: 1080,
    aspectRatio: "16 / 9",
    desktopFocalPoint: { x: "50%", y: "50%" },
    mobileFocalPoint: { x: "47%", y: "50%" },
    usageRole: ["campaign-scene"],
    productUrl: "/teas/kolkata-street-masala-chai",
    alt: "Kolkata Street Masala Chai pack beside a classic yellow Kolkata taxi",
    mobileScene: {
      src: `${basePath}/mobile/kolkata-masala.webp`,
      width: 780,
      height: 1080,
      fit: "cover",
      background: "#681f18"
    }
  },
  {
    id: "kolkata-2",
    filename: "Kolkata Tea 2.png",
    src: `${basePath}/Kolkata Tea 2.png`,
    product: "Kolkata Street Masala Chai",
    collection: "Ajanta Tea",
    section: "kolkata",
    width: 1920,
    height: 1080,
    aspectRatio: "16 / 9",
    desktopFocalPoint: { x: "50%", y: "50%" },
    mobileFocalPoint: { x: "50%", y: "50%" },
    usageRole: ["mosaic-support"],
    productUrl: "/teas/kolkata-street-masala-chai",
    alt: "Kolkata Street Masala Chai pack among vivid bougainvillea"
  },
  {
    id: "elaichi-1",
    filename: "Elaichi 1.png",
    src: `${basePath}/Elaichi 1.png`,
    product: "Ajanta Elaichi",
    collection: "Ajanta Tea",
    section: "elaichi",
    width: 1920,
    height: 1080,
    aspectRatio: "16 / 9",
    desktopFocalPoint: { x: "50%", y: "50%" },
    mobileFocalPoint: { x: "50%", y: "50%" },
    usageRole: ["mosaic-support"],
    productUrl: "/teas#ajanta-tea",
    alt: "Ajanta Elaichi tea pack standing among fresh tea leaves"
  },
  {
    id: "elaichi-2",
    filename: "Elaichi 2.png",
    src: `${basePath}/Elaichi 2.png`,
    product: "Ajanta Elaichi",
    collection: "Ajanta Tea",
    section: "elaichi",
    width: 1920,
    height: 1080,
    aspectRatio: "16 / 9",
    desktopFocalPoint: { x: "50%", y: "50%" },
    mobileFocalPoint: { x: "50%", y: "50%" },
    usageRole: ["mosaic-support"],
    productUrl: "/teas#ajanta-tea",
    alt: "Ajanta Elaichi tea pack lying among dark green tea leaves"
  },
  {
    id: "elaichi-2-2",
    filename: "Elaichi 2(2).png",
    src: `${basePath}/Elaichi 2(2).png`,
    product: "Ajanta Elaichi",
    collection: "Ajanta Tea",
    section: "elaichi",
    width: 1920,
    height: 1080,
    aspectRatio: "16 / 9",
    desktopFocalPoint: { x: "50%", y: "50%" },
    mobileFocalPoint: { x: "50%", y: "50%" },
    usageRole: ["campaign-scene"],
    productUrl: "/teas#ajanta-tea",
    alt: "Ajanta Elaichi tea pack surrounded by green cardamom pods",
    mobileScene: {
      src: `${basePath}/mobile/elaichi.webp`,
      width: 780,
      height: 1080,
      fit: "cover",
      background: "#394a17"
    }
  }
];

export const campaignScenes = productCampaigns.filter((asset) =>
  asset.usageRole.includes("campaign-scene")
);

export const campaignMosaicRows = [
  ["gold-2", "high-1-2", "kolkata-2", "elaichi-1", "gold-3"],
  ["high-2", "kolkata-1", "collection", "elaichi-2", "high-2-2"],
  ["kolkata-1-2", "gold-1", "elaichi-2-2", "high-1", "kolkata-2"]
].map((row) => row.map((id) => productCampaigns.find((asset) => asset.id === id)!));
