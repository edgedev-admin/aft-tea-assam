import { StudioExperience } from "../../components/tea-studio/studio-experience";
import { aftAssets } from "../../lib/media/aft-assets";
import { pageMetadata } from "../../lib/seo";

export const metadata = pageMetadata({
  title: "AFT Immersive Tea Studio | Explore Ajanta Tea in 3D",
  description: "Explore Assam tea from every angle. Enter the AFT Immersive Tea Studio, discover four Ajanta Tea packs in 3D and enquire directly with our team.",
  path: "/tea-studio",
  image: aftAssets.brandCampaignAssets.collectionCampaign.src,
});

export default function TeaStudioPage() {
  return <StudioExperience />;
}
