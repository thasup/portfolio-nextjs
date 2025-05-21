"use client";

import React from "react";
import Image from "next/image";

const WebImage = ({ src, alt, width, height, layout, priority, quality, ratio, ...props }) => {
  const myLoader = () => {
    return `${src}?raw=1&q=${quality || 75}`;
  };
  const computedWidth = width ? width : ratio * height;

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
