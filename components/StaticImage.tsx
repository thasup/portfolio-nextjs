"use client";

import React from "react";
import Image from "next/image";

interface StaticImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  priority?: boolean;
  quality?: number;
  className?: string;
  style?: React.CSSProperties;
}

const StaticImage: React.FC<StaticImageProps> = ({
  src,
  alt,
  width,
  height,
  fit = "cover",
  priority = false,
  quality = 75,
  className,
}) => {
  const myLoader = () => {
    return `${src}?raw=1&q=${quality}`;
  };

  return (
    <Image
      loader={myLoader}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ 
        objectFit: fit,
        width: '100%',
        height: 'auto'
      }}
      priority={priority}
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  );
};

export default StaticImage;
