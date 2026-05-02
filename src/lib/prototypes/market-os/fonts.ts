/**
 * MarketOS prototype fonts.
 *
 * Loaded only when the prototype route subtree mounts so the rest of
 * the portfolio doesn't pay the woff2 cost.
 */
import {
  Bricolage_Grotesque,
  DM_Sans,
  Permanent_Marker,
} from "next/font/google";

export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-permanent-marker",
  display: "swap",
});
