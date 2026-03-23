"use client";

import { CldImage } from "next-cloudinary";

export default function ProductImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <CldImage
      width="50"
      height="50"
      src={src}
      alt={alt}
      className="rounded-md object-cover aspect-square"
    />
  );
}
