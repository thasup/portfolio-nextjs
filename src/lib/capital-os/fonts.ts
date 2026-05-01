/**
 * CapitalOS fonts.
 *
 * Loaded only within the `/prototypes/capital-os` route subtree
 * so the rest of the portfolio doesn't pay the woff2 cost.
 */
import { Inter } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter-cos",
  display: "swap",
});
