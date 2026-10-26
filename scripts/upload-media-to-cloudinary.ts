import { createHash } from "node:crypto";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import nextEnv from "@next/env";
import cloudinaryPackage, { type UploadApiResponse } from "cloudinary";

const { loadEnvConfig } = nextEnv;
const { v2: cloudinary } = cloudinaryPackage;

type ResourceType = "image" | "video";
type DeliveryQuality = "auto:good" | "auto:best";

type ApprovedAsset = {
  localPath: string;
  publicId: string;
  resourceType: ResourceType;
  category: string;
  deliveryQuality: DeliveryQuality;
  alt?: string;
};

type ManifestAsset = ApprovedAsset & {
  bytes: number;
  format: string;
  height: number;
  sha256: string;
  version: number;
  width: number;
};

const root = process.cwd();
const manifestPath = path.join(root, "lib", "cloudinary-manifest.json");

const approvedAssets: ApprovedAsset[] = [
  {
    localPath: "public/aft-hero.mp4",
    publicId: "aft-techno-trade/hero/aft-hero",
    resourceType: "video",
    category: "hero-video",
    deliveryQuality: "auto:good"
  },
  {
    localPath: "public/images/tea/assam-dawn.png",
    publicId: "aft-techno-trade/hero/assam-dawn",
    resourceType: "image",
    category: "hero-poster",
    deliveryQuality: "auto:good",
    alt: "Tea-growing landscape at sunrise in Assam"
  },
  {
    localPath: "public/images/company/parents-at-home (2).jpeg",
    publicId: "aft-techno-trade/company/family-at-home",
    resourceType: "image",
    category: "company-photography",
    deliveryQuality: "auto:good",
    alt: "Two members of the family behind AFT Techno Trade standing outside their home"
  },
  {
    localPath: "public/images/company/son-office.png",
    publicId: "aft-techno-trade/company/family-office",
    resourceType: "image",
    category: "company-photography",
    deliveryQuality: "auto:good",
    alt: "A member of the family behind AFT Techno Trade seated in the company office"
  },
  {
    localPath: "public/images/products/ajanta-gold.jpg",
    publicId: "aft-techno-trade/products/ajanta/ajanta-gold",
    resourceType: "image",
    category: "product-packshot",
    deliveryQuality: "auto:best",
    alt: "Ajanta Gold tea package"
  },
  {
    localPath: "public/images/products/high-societea.jpg",
    publicId: "aft-techno-trade/products/ajanta/high-societea",
    resourceType: "image",
    category: "product-packshot",
    deliveryQuality: "auto:best",
    alt: "High Societea tea package"
  },
  {
    localPath: "public/images/products/kolkata-street-masala-chai.jpg",
    publicId: "aft-techno-trade/products/ajanta/kolkata-street-masala-chai",
    resourceType: "image",
    category: "product-packshot",
    deliveryQuality: "auto:best",
    alt: "Kolkata Street Masala Chai package"
  },
  ...[
    ["garden-path.jpg", "gardens/garden-path", "A path through rows of tea bushes beneath shade trees in Upper Assam", "photo-documentary"],
    ["fresh-leaf.jpg", "gardens/fresh-leaf", "Tender fresh tea shoots growing above a bed of tea leaves", "photo-documentary"],
    ["garden-shade.jpg", "gardens/garden-shade", "Rows of tea bushes growing beneath tall shade trees in Upper Assam", "photo-documentary"],
    ["factory-leaf-receiving.jpg", "factory/fresh-leaf-receiving", "Fresh green tea leaves spread across a large factory receiving bed", "photo-documentary"],
    ["factory-machinery.jpg", "factory/processing-machinery", "Tea-processing machinery handling fresh leaves inside the factory", "photo-documentary"],
    ["factory-operations.jpg", "factory/operations-floor", "Conveyors and processing equipment across an operational tea factory floor", "photo-documentary"],
    ["factory-exterior.jpg", "factory/exterior", "AFT tea factory buildings and courtyard in Upper Assam", "photo-documentary"],
    ["ajanta-gold-campaign.png", "campaigns/ajanta/gold-garden", "Ajanta Gold tea presented with brewed tea in a tea garden", "product-campaign"],
    ["ajanta-elaichi-campaign.jpg", "campaigns/ajanta/elaichi-garden", "Ajanta Elaichi tea presented with brewed tea in a tea garden", "product-campaign"],
    ["ajanta-high-societea-campaign.jpg", "campaigns/ajanta/high-societea-garden", "High Societea presented with brewed tea among tea bushes", "product-campaign"],
    ["ajanta-kolkata-masala-campaign.jpg", "campaigns/ajanta/kolkata-masala-garden", "Kolkata Street Masala Chai presented with brewed tea in a tea garden", "product-campaign"],
    ["golden-pearl-jar.png", "products/nahorchukbari/golden-pearl-jar", "Transparent Nahorchukbari Golden Pearl tea jar", "product-packshot"],
    ["garden-fresh-tote.png", "products/ekoratoli/garden-fresh-tote", "Garden Fresh Tea woven tote presentation", "product-packshot"]
  ].map(([filename, publicId, alt, category]) => ({
    localPath: `public/images/story/${filename}`,
    publicId: `aft-techno-trade/${publicId}`,
    resourceType: "image" as const,
    category,
    deliveryQuality: (category === "product-packshot" || category === "product-campaign" ? "auto:best" : "auto:good") as DeliveryQuality,
    alt
  })),
  ...[
    ["AFT TEA COLLECTION.png", "collection/aft-tea-collection", "AFT Tea collection campaign"],
    ["Gold Tea 1.png", "gold/gold-tea-1", "Ajanta Gold campaign one"],
    ["Gold Tea 2.png", "gold/gold-tea-2", "Ajanta Gold campaign two"],
    ["Gold Tea 3.png", "gold/gold-tea-3", "Ajanta Gold campaign three"],
    ["High Societea 1.png", "high-societea/high-societea-1", "High Societea campaign one"],
    ["High Societea 1(2).png", "high-societea/high-societea-1-alt", "High Societea campaign one alternate"],
    ["High Societea 2.png", "high-societea/high-societea-2", "High Societea campaign two"],
    ["High Societea 2(2).png", "high-societea/high-societea-2-alt", "High Societea campaign two alternate"],
    ["Kolkata Tea 1.png", "kolkata-masala/kolkata-tea-1", "Kolkata Masala campaign one"],
    ["Kolkata Tea 1(2).png", "kolkata-masala/kolkata-tea-1-alt", "Kolkata Masala campaign one alternate"],
    ["Kolkata Tea 2.png", "kolkata-masala/kolkata-tea-2", "Kolkata Masala campaign two"],
    ["Elaichi 1.png", "elaichi/elaichi-1", "Ajanta Elaichi campaign one"],
    ["Elaichi 2.png", "elaichi/elaichi-2", "Ajanta Elaichi campaign two"],
    ["Elaichi 2(2).png", "elaichi/elaichi-2-alt", "Ajanta Elaichi campaign two alternate"]
  ].map(([filename, publicId, alt]) => ({
    localPath: `public/media/product-campaigns/${filename}`,
    publicId: `aft-techno-trade/campaigns/${publicId}`,
    resourceType: "image" as const,
    category: "product-campaign",
    deliveryQuality: "auto:best" as const,
    alt
  })),
  ...[
    ["collection.webp", "collection/aft-tea-collection-mobile", "AFT Tea collection mobile campaign"],
    ["gold.webp", "gold/gold-tea-mobile", "Ajanta Gold mobile campaign"],
    ["high-societea.webp", "high-societea/high-societea-mobile", "High Societea mobile campaign"],
    ["kolkata-masala.webp", "kolkata-masala/kolkata-tea-mobile", "Kolkata Masala mobile campaign"],
    ["elaichi.webp", "elaichi/elaichi-mobile", "Ajanta Elaichi mobile campaign"]
  ].map(([filename, publicId, alt]) => ({
    localPath: `public/media/product-campaigns/mobile/${filename}`,
    publicId: `aft-techno-trade/campaigns/${publicId}`,
    resourceType: "image" as const,
    category: "product-campaign-mobile",
    deliveryQuality: "auto:best" as const,
    alt
  }))
];

function requireEnvironment(name: string) {
  const value = process.env[name];
  if (!value || /^(your_|replace_)/i.test(value)) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function sha256(filePath: string) {
  const contents = await readFile(filePath);
  return createHash("sha256").update(contents).digest("hex");
}

function sourceHash(resource: { context?: { custom?: Record<string, string> } }) {
  return resource.context?.custom?.source_sha256;
}

async function existingResource(asset: ApprovedAsset) {
  try {
    return await cloudinary.api.resource(asset.publicId, {
      resource_type: asset.resourceType,
      type: "upload",
      context: true
    });
  } catch (error) {
    const cloudinaryError = error as {
      error?: { http_code?: number };
      http_code?: number;
    };
    const status = cloudinaryError.http_code ?? cloudinaryError.error?.http_code;
    if (status === 404) return null;
    throw error;
  }
}

function toManifestAsset(
  asset: ApprovedAsset,
  hash: string,
  resource: Pick<UploadApiResponse, "bytes" | "format" | "height" | "version" | "width">
): ManifestAsset {
  return {
    ...asset,
    bytes: resource.bytes,
    format: resource.format,
    height: resource.height,
    sha256: hash,
    version: resource.version,
    width: resource.width
  };
}

async function migrate(asset: ApprovedAsset): Promise<ManifestAsset> {
  const absolutePath = path.join(root, asset.localPath);
  await stat(absolutePath);
  const hash = await sha256(absolutePath);
  const existing = await existingResource(asset);

  if (existing) {
    if (sourceHash(existing) !== hash) {
      throw new Error(`Cloudinary public ID conflict for ${asset.publicId}; refusing to overwrite`);
    }
    process.stdout.write(`skip ${asset.localPath}\n`);
    return toManifestAsset(asset, hash, existing);
  }

  process.stdout.write(`upload ${asset.localPath}\n`);
  const uploaded = await cloudinary.uploader.upload(absolutePath, {
    public_id: asset.publicId,
    resource_type: asset.resourceType,
    overwrite: false,
    unique_filename: false,
    use_filename: false,
    tags: ["aft-techno-trade", "website-migration"],
    context: {
      source_path: asset.localPath,
      source_sha256: hash,
      category: asset.category,
      alt: asset.alt ?? ""
    }
  });
  return toManifestAsset(asset, hash, uploaded);
}

async function main() {
  loadEnvConfig(root);
  cloudinary.config({
    cloud_name: requireEnvironment("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"),
    api_key: requireEnvironment("CLOUDINARY_API_KEY"),
    api_secret: requireEnvironment("CLOUDINARY_API_SECRET"),
    secure: true
  });

  const ping = await cloudinary.api.ping();
  if (ping.status !== "ok") throw new Error("Cloudinary authentication failed");

  const assets: ManifestAsset[] = [];
  for (const asset of approvedAssets) assets.push(await migrate(asset));

  const manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    assets: assets.sort((a, b) => a.localPath.localeCompare(b.localPath))
  };
  try {
    const previous = JSON.parse(await readFile(manifestPath, "utf8")) as typeof manifest;
    if (
      previous.schemaVersion === manifest.schemaVersion &&
      JSON.stringify(previous.assets) === JSON.stringify(manifest.assets)
    ) {
      process.stdout.write(`manifest unchanged ${path.relative(root, manifestPath)} (${assets.length} assets)\n`);
      return;
    }
  } catch {
    // The first successful migration creates the manifest.
  }
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  process.stdout.write(`manifest ${path.relative(root, manifestPath)} (${assets.length} assets)\n`);
}

main().catch((error) => {
  const nestedMessage = (error as { error?: { message?: string } })?.error?.message;
  const message = error instanceof Error ? error.message : nestedMessage ?? "Unknown migration error";
  process.stderr.write(`Cloudinary migration failed: ${message}\n`);
  process.exitCode = 1;
});
