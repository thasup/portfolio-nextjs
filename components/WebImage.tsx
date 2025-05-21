"use client";

import React from "react";
import Image from "next/image";

interface WebImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  ratio?: number;
  className?: string;
  style?: React.CSSProperties;
}

const WebImage: React.FC<WebImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 75,
  ratio = 1,
  ...props
}) => {
  const myLoader = () => {
    return `${src}?raw=1&q=${quality || 75}`;
  };
  const computedWidth = width ? width : ratio * (height || 100);

  return (
    <Image
      {...props}
      loader={myLoader}
      src={src}
      alt={alt}
      width={computedWidth}
      height={height}
      priority={priority}
      sizes="(max-width: 768px) 100vw, 50vw"
      style={{
        objectFit: 'contain',
        ...props.style,
        maxWidth: "100%",
        height: "auto"
      }} />
  );
};

export default WebImage;
