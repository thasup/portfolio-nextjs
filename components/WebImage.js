import React from "react";
import Image from "next/image";

const WebImage = ({ src, alt, width, height, layout, priority, quality }) => {
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
      priority={priority || false}
    />
  );
};

export default WebImage;
