import type { Spring } from "framer-motion";

export const SPRING_GENTLE: Spring = {
  type: "spring",
  stiffness: 80,
  damping: 20,
  mass: 1,
};

export const SPRING_BUOYANT: Spring = {
  type: "spring",
  stiffness: 120,
  damping: 14,
  mass: 0.8,
};

export const SPRING_SNAPPY: Spring = {
  type: "spring",
  stiffness: 200,
  damping: 20,
  mass: 0.5,
};
