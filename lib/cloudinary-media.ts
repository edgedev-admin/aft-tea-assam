import manifest from "./cloudinary-manifest.json";

type ManifestAsset = (typeof manifest.assets)[number];
type ImageQuality = "auto:good" | "auto:best";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const bySource = new Map(
  manifest.assets.map((asset) => [`/${asset.localPath.replace(/^public\//, "")}`, asset])
);

export function getCloudinaryAsset(source: string) {
  return bySource.get(source);
}

function deliveryBase(asset: ManifestAsset) {
  if (!cloudName) return null;
  return `https://res.cloudinary.com/${cloudName}/${asset.resourceType}/upload`;
}

export function cloudinaryImageUrl(
  source: string,
  options: { width: number; quality?: ImageQuality | number }
) {
  const asset = getCloudinaryAsset(source);
  if (!asset || asset.resourceType !== "image") return source;
  const base = deliveryBase(asset);
  if (!base) return source;

  const width = Math.min(asset.width, Math.max(1, Math.round(options.width)));
  const quality = options.quality ?? asset.deliveryQuality;
  const transform = `f_auto,q_${quality},c_limit,w_${width}`;
  return `${base}/${transform}/v${asset.version}/${asset.publicId}`;
}

export function cloudinaryImageSrcSet(source: string, widths: number[]) {
  const asset = getCloudinaryAsset(source);
  if (!asset || asset.resourceType !== "image" || !cloudName) return source;
  const candidates = [...new Set(widths.map((width) => Math.min(width, asset.width)))];
  return candidates
    .map((width) => `${cloudinaryImageUrl(source, { width })} ${width}w`)
    .join(", ");
}

export function cloudinaryVideoUrl(source: string, width: number) {
  const asset = getCloudinaryAsset(source);
  if (!asset || asset.resourceType !== "video") return source;
  const base = deliveryBase(asset);
  if (!base) return source;

  const targetWidth = Math.min(asset.width, Math.max(1, Math.round(width)));
  const transform = `f_mp4,q_auto:good,vc_h264:main,ac_none,c_limit,w_${targetWidth},fl_progressive`;
  return `${base}/${transform}/v${asset.version}/${asset.publicId}.mp4`;
}

export function usesCloudinary(source: string) {
  return Boolean(cloudName && getCloudinaryAsset(source));
}
