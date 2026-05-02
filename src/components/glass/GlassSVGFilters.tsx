import React from "react";
import { DISTORTION_PRESETS, getFilterId } from "@/lib/glass-distortion";
import { DistortionIntensity } from "./glass-types";

export function GlassSVGFilters(): React.ReactElement {
  const intensities: DistortionIntensity[] = ["low", "medium", "high"];

  return (
    <svg
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        visibility: "hidden",
      }}
      aria-hidden="true"
    >
      <defs>
        {intensities.map((intensity) => {
          const config = DISTORTION_PRESETS[intensity];
          const filterId = getFilterId(intensity);

          return (
            <filter
              key={filterId}
              id={filterId}
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              filterUnits="objectBoundingBox"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency={`${config.baseFrequency[0]} ${config.baseFrequency[1]}`}
                numOctaves="1"
                seed={config.seed}
                result="turbulence"
              />
              <feGaussianBlur
                in="turbulence"
                stdDeviation="3"
                result="softMap"
              />
              <feSpecularLighting
                in="softMap"
                surfaceScale={config.surfaceScale}
                specularConstant={config.specularConstant}
                specularExponent="100"
                lightingColor="white"
                result="specLight"
              >
                <fePointLight x="-200" y="-200" z="300" />
              </feSpecularLighting>
              <feComposite
                in="specLight"
                operator="arithmetic"
                k1="0"
                k2="1"
                k3="1"
                k4="0"
                result="litImage"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="softMap"
                scale={config.scale}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          );
        })}
      </defs>
    </svg>
  );
}
