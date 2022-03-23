import React from "react";
import Image from "next/image";

const StaticImage = ({
  src,
  alt,
  width,
  height,
  layout,
  fit,
  priority,
  quality,
}) => {
  const myLoader = ({ src, quality }) => {
    return `${src}?raw=1&q=${quality || 75}`;
  };

  return (
    <Image
      loader={myLoader}
      src={src}
      alt={alt}
      width={width}
      height={height}
      layout={layout || "responsive"}
      objectFit={fit ? fit : "cover"}
      priority={priority || false}
    />
  );
};

export default StaticImage;
