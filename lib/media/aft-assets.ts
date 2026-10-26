export type AftMediaAsset = {
  src: string;
  sourceFilename: string;
  alt: string;
  width: number;
  height: number;
  aspectRatio: number;
  hasTransparency: boolean;
  recommendedUsage: string;
  objectPosition?: string;
};

const asset = (
  filename: string,
  sourceFilename: string,
  alt: string,
  width: number,
  height: number,
  hasTransparency: boolean,
  recommendedUsage: string,
  objectPosition?: string
): AftMediaAsset => ({
  src: `/images/aft-tea/${filename}`,
  sourceFilename,
  alt,
  width,
  height,
  aspectRatio: Number((width / height).toFixed(4)),
  hasTransparency,
  recommendedUsage,
  ...(objectPosition ? { objectPosition } : {})
});

const aerialGarden = asset("aerial-tea-plantation-harvest.png", "Aerial Tea Plantation Harvest.png", "An aerial view across Assam tea bushes", 1672, 941, false, "Wide garden hero or editorial background", "center 54%");
const dewLeaves = asset("dew-kissed-tea-leaves.png", "Dew-Kissed Tea Leaves in Morning Light.png", "Dew-kissed tea leaves in soft morning light", 1672, 941, false, "Garden chapter and wide photographic panels", "center 58%");
const sortingLeaves = asset("tea-leaf-sorting.png", "Close-Up Tea Leaf Sorting.png", "Tea leaves being sorted by hand", 1536, 1024, false, "Process storytelling and editorial crops", "center 52%");
const freshLeafInspection = asset("fresh-leaf-inspection.png", "Hands Inspecting Fresh Tea Leaf Mash.png", "Hands inspecting tea leaf material", 1536, 1024, false, "Process storytelling; verify exact production stage before specific claims", "center 54%");
const qualityRoom = asset("quality-check-room-enhanced.png", "AFT_Techno_Trade_Green_Leaves_Quality_Check_Room_Natural_Enhanced.png", "Tea quality review scene, enhanced source image", 1365, 2048, false, "Quality chapter; image is enhanced and documentary provenance needs confirmation", "center 48%");
const processingInspection = asset("tea-processing-inspection-enhanced.png", "AFT_Techno_Trade_Tea_Processing_Inspection_Original_Enhanced.png", "Tea processing inspection scene, enhanced source image", 2048, 1365, false, "Process storytelling; image is enhanced and documentary provenance needs confirmation", "center 52%");

export const aftAssets = {
  consumerProducts: {
    ajantaGold: asset("ajanta-gold-pouch.png", "Ajanta Tea Gold Packaging Pouch.png", "Ajanta Tea Gold pouch, labeled Classic Assam Tea", 1086, 1448, true, "Transparent product stage, product detail and consumer collection", "center 50%"),
    ajantaElaichi: asset("ajanta-elaichi-pouch.png", "Ajanta Tea Elaichi Pouch Mockup.png", "Ajanta Tea Elaichi pouch, labeled Classic Assam Tea", 1086, 1448, true, "Transparent product stage and product detail; mockup source", "center 50%"),
    highSocietea: asset("high-societea-pouch.png", "Ajanta Tea High Societea Pouch.png", "Ajanta Tea High Societea pouch, labeled Classic Assam Tea", 988, 1592, true, "Transparent product stage and product detail", "center 50%"),
    kolkataStreetMasalaChai: asset("kolkata-street-masala-chai-pouch.png", "Kolkata Street Masala Chai Pouch.png", "Ajanta Tea Kolkata Street Masala Chai pouch", 996, 1579, true, "Transparent product stage and product detail", "center 50%")
  },
  teaLeavesAndTextures: {
    macroGranules: asset("macro-tea-granules-tray.png", "Macro Tea Granules in Wooden Tray.png", "Close view of dry tea granules in a wooden tray", 1536, 1024, false, "CTC grade explorer and texture detail", "center 50%"),
    woodenScoop: asset("rustic-wooden-scoop-black-tea.png", "Rustic Wooden Scoop of Black Tea.png", "Black tea leaves in a rustic wooden scoop", 1536, 1024, false, "Supporting tea texture photography", "center 50%"),
    ctcGranules: asset("rustic-ctc-tea-granules.png", "Rustic CTC Tea Granules in Tray.png", "CTC tea granules arranged in a tray", 1536, 1024, false, "CTC grade explorer and wholesale storytelling", "center 50%"),
    granulesPouring: asset("tea-granules-pouring.png", "Tea Granules Pouring into Metal Tray.png", "Tea granules pouring into a metal tray", 1536, 1024, false, "Processing story and detail crops", "center 48%"),
    sortingLeaves,
    freshLeafInspection,
    dewLeaves
  },
  teaGardens: { aerialGarden, dewLeaves },
  manufacturingAndQuality: {
    packagingLineMobile: asset("tea-packaging-line-worker-mobile.webp", "Tea Packaging Line with Worker.png (lossless centre crop)", "Worker alongside a tea packaging line", 1299, 941, false, "Mobile Wholesale hero: the existing centre crop preserved without offscreen pixels", "center 52%"),
    packagingLine: asset("tea-packaging-line-worker.png", "Tea Packaging Line with Worker.png", "Worker alongside a tea packaging line", 1672, 941, false, "Manufacturing context; do not infer unshown technical details", "center 52%"),
    qualityRoom,
    processingInspection,
    freshLeafInspection
  },
  specialtyTeas: {
    goldenPearlJar: {
      src: "/images/story/golden-pearl-jar.png",
      sourceFilename: "Existing AFT Golden Pearl jar asset",
      alt: "Nahorchukbari Golden Pearl tea presentation jar",
      width: 1200,
      height: 1200,
      aspectRatio: 1,
      hasTransparency: true,
      recommendedUsage: "Specialty tea editorial and Golden Pearl detail"
    } satisfies AftMediaAsset
  },
  brandCampaignAssets: {
    ekoratoliTote: asset("ekoratoli-tea-tote.png", "Ekoratoli Garden Fresh Tea Tote.png", "Ekoratoli Garden Fresh Tea tote with AFT Techno Trade branding", 1122, 1402, true, "Supporting Ekoratoli brand image; not a tea pouch"),
    collectionCampaign: {
      src: "/media/product-campaigns/AFT TEA COLLECTION.png",
      sourceFilename: "Existing AFT TEA COLLECTION.png",
      alt: "Ajanta Tea collection displayed against a tea garden landscape",
      width: 1920,
      height: 1080,
      aspectRatio: 16 / 9,
      hasTransparency: false,
      recommendedUsage: "Existing approved campaign image and editorial background"
    } satisfies AftMediaAsset
  }
} as const;

export const teaProcessSequence = [
  { ...dewLeaves, title: "Tea gardens", caption: "Tender leaves in morning light." },
  { ...sortingLeaves, title: "Leaf sorting", caption: "Close attention to fresh leaf." },
  { ...processingInspection, title: "Processing inspection", caption: "Enhanced image; documentary provenance to be confirmed." },
  { ...aftAssets.manufacturingAndQuality.packagingLine, title: "Tea packing", caption: "A view of tea packing work." }
] as const;
