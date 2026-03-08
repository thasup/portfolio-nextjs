import React from "react";
import Image from "next/image";
import { ImageProps } from "next/image";

interface StaticImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt: string;
  fit?: "fill" | "contain" | "cover" | "none" | "scale-down";
}

const StaticImage = ({
  src,
  alt,
  width,
  height,
  layout,
  fit,
  priority,
  quality,
  ...props
}: StaticImageProps) => {
  const myLoader = () => {
    return `${src}?raw=1&q=${quality || 75}`;
  };

  return (
    <Image
      {...props}
      loader={myLoader}
      src={src}
      alt={alt}
      width={width}
      height={height}
      layout={layout ?? "responsive"}
      objectFit={fit ?? "cover"}
      priority={priority ?? false}
    />
  );
};

export default StaticImage;
