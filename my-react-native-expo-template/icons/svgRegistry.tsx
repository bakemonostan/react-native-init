/**
 * AUTO-GENERATED — do not edit by hand.
 * Run: npm run icons:gen
 *
 * Source: assets/icons/my-icons/*.svg
 */

import type { SvgProps } from "react-native-svg";

import SvgPlaceholder from "../assets/icons/my-icons/Placeholder.svg";

export const svgIcons = {
  Placeholder: SvgPlaceholder,
} as const;

export type SvgIconName = keyof typeof svgIcons;

export type SvgIconProps = {
  name: SvgIconName;
  /** Width and height in logical pixels */
  size?: number;
  /** Passed to the SVG root — use `currentColor` in SVG artwork for tinting */
  color?: string;
} & Omit<SvgProps, "width" | "height">;

export function SvgIcon({
  name,
  size = 24,
  color,
  ...rest
}: SvgIconProps) {
  const Cmp = svgIcons[name];
  return (
    <Cmp width={size} height={size} color={color} {...rest} />
  );
}
