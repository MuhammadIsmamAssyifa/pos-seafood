"use client";

import { CldImage } from "next-cloudinary";

type Props = {
  src: string;
  alt: string;
  variant?: "fill" | "fixed";
  width?: number;
  height?: number;
};

export default function ProductImage({
  src,
  alt,
  variant = "fixed",
  width = 100,
  height = 100,
}: Props) {
  if (variant === "fill") {
    return (
      <CldImage
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        quality="auto"
        format="auto"
        src={src}
        alt={alt}
        className="rounded-md object-cover object-center"
      />
    );
  }

  return (
    <CldImage
      width={width}
      height={height}
      quality="auto"
      format="auto"
      src={src}
      alt={alt}
      className="rounded-md object-cover object-center"
    />
  );
}
