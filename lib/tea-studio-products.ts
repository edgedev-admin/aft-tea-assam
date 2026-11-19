export type StudioModelProduct = {
  kind: "model";
  id: string;
  name: string;
  shortName: string;
  category: string;
  description: string;
  href: string;
  model: string;
  poster: string;
  posterWidth: number;
  posterHeight: number;
  frontAzimuth: number;
  accent: string;
  studioPoster: { desktop: string; mobile: string };
  scene: { background: string; floor: string; accent: string; rim: string; azimuth: number; occupancy: number };
};

// Front +Z was checked in the handoff for every model, not inferred from filenames.
// These are photographic study models, not measured manufacturing replicas.
export const studioProducts: readonly StudioModelProduct[] = [
  { kind: "model", id: "ajanta-gold", name: "Ajanta Gold", shortName: "Gold", category: "Classic Assam Tea", description: "A classic Assam tea for a strong, comforting everyday cup, presented in Ajanta Tea's distinctive gold pack.", href: "/teas/ajanta-gold", model: "/3d/models/ajanta-gold.glb", poster: "/3d/posters/ajanta-gold.webp", posterWidth: 700, posterHeight: 1000, frontAzimuth: 0, accent: "#b98818" },
  { kind: "model", id: "ajanta-elaichi", name: "Ajanta Elaichi", shortName: "Elaichi", category: "Ajanta Tea collection", description: "A company-documented Assam tea and cardamom offering. Explore its distinctive green presentation; confirm current formulation and packs with our team.", href: "/teas#ajanta-tea", model: "/3d/models/ajanta-elaichi.glb", poster: "/3d/posters/ajanta-elaichi.webp", posterWidth: 700, posterHeight: 1000, frontAzimuth: 0, accent: "#57763a" },
  { kind: "model", id: "ajanta-high-societea", name: "Ajanta High Societea", shortName: "High Societea", category: "Classic Assam Tea", description: "The authentic High Societea presentation from Ajanta Tea, with its distinctive black-and-gold packaging. Current formulation and pack sizes are confirmed by enquiry.", href: "/teas/high-societea", model: "/3d/models/ajanta-high-societea.glb", poster: "/3d/posters/ajanta-high-societea.webp", posterWidth: 700, posterHeight: 1000, frontAzimuth: 0, accent: "#383d34" },
  { kind: "model", id: "ajanta-kolkata-street-masala-chai", name: "Kolkata Street Masala Chai", shortName: "Masala Chai", category: "Masala chai", description: "Kolkata-inspired Ajanta Tea packaging with a lively city identity. Enquire about the current ingredients, pack sizes and purchasing options.", href: "/teas/kolkata-street-masala-chai", model: "/3d/models/ajanta-kolkata-street-masala-chai.glb", poster: "/3d/posters/ajanta-kolkata-street-masala-chai.webp", posterWidth: 700, posterHeight: 1000, frontAzimuth: 0, accent: "#a6251c" },
].map((product, index) => ({ ...product, kind: "model" as const, studioPoster: { desktop: `/3d/studio/${product.id}-desktop.webp`, mobile: `/3d/studio/${product.id}-mobile.webp` }, scene: [
  { background: "#091c16", floor: "#1c3027", accent: "#b78d43", rim: "#edce95", azimuth: .10, occupancy: .80 },
  { background: "#081b16", floor: "#18382b", accent: "#86a65b", rim: "#d6dfb0", azimuth: .09, occupancy: .80 },
  { background: "#101815", floor: "#292e27", accent: "#ab8054", rim: "#e0c294", azimuth: .08, occupancy: .80 },
  { background: "#211913", floor: "#3b2721", accent: "#a84932", rim: "#edb978", azimuth: .11, occupancy: .79 },
][index] }));

export type StudioPhotoProduct = { kind: "photograph"; id: string; name: string; image: string; href: string; description: string };
export type StudioProduct = StudioModelProduct | StudioPhotoProduct;
export type StudioCameraView = "front" | "back" | "three-quarter" | "reset" | "zoom-in" | "zoom-out";

export function studioEnquiryMessage(productName?: string) {
  return productName
    ? `Hello AFT Techno Trade, I explored ${productName.trim()} in the AFT Tea Studio and would like more information about this product, available pack sizes and purchasing options.`
    : "Hello AFT Techno Trade, I explored the AFT Tea Studio and would like to discuss Assam tea, wholesale grades, custom blending and supply requirements. Please guide me through the enquiry process.";
}
