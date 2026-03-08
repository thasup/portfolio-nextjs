import React from "react";
import Image from "next/legacy/image";
import { ImageProps } from "next/legacy/image";

interface WebImageProps extends Omit<ImageProps, 'src' | 'alt' | 'width'> {
  src: string;
  alt: string;
  ratio?: number;
  width?: number | string;
}

const WebImage = ({ src, alt, width, height, layout, priority, quality, ratio = 1, ...props }: WebImageProps) => {
  const myLoader = () => {
    return `${src}?raw=1&q=${quality || 75}`;
  };
  const computedWidth = width ? Number(width) : ratio ? ratio * (Number(height) || 0) : undefined;

  return (
    <Image
      {...props}
      loader={myLoader}
      src={src}
      alt={alt}
      width={computedWidth}
      height={height}
      layout={layout || "responsive"}
      priority={priority || false}
    />
  );
};

export default WebImage;
