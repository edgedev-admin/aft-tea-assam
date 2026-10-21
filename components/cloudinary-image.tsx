"use client";

import Image, { type ImageLoaderProps, type ImageProps } from "next/image";
import { cloudinaryImageUrl, usesCloudinary } from "../lib/cloudinary-media";

type CloudinaryImageProps = Omit<ImageProps, "loader" | "src"> & {
  src: string;
};

function loader({ src, width, quality }: ImageLoaderProps) {
  return cloudinaryImageUrl(src, { width, quality });
}

export function CloudinaryImage({ src, alt, ...props }: CloudinaryImageProps) {
  if (!usesCloudinary(src)) return <Image src={src} alt={alt} {...props} />;
  return <Image loader={loader} src={src} alt={alt} {...props} />;
}
