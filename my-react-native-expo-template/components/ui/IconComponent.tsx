import { useTheme } from "@/context/ThemeContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";

// Create a type-safe icon components object for vector icons
export const IconComponents = {
  FontAwesome,
  MaterialIcons,
  Ionicons,
  Feather,
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
} as const;

// Infer everything from the objects
export type VectorIconName<L extends keyof typeof IconComponents> =
  React.ComponentProps<(typeof IconComponents)[L]>["name"];

interface BaseIconProps {
  /**
   * Size of the icon
   * @default 24
   */
  size?: number;
}

export interface VectorIconProps<L extends keyof typeof IconComponents>
  extends BaseIconProps {
  library: L;
  name: VectorIconName<L>;
  color?: string;
}

export type IconLibrary = keyof typeof IconComponents;

/** Props for {@link IconComponent} — vector fonts only (use `@/icons` / SvgIcon for SVG assets). */
export type IconComponentProps = VectorIconProps<keyof typeof IconComponents>;

/**
 * Vector-only icon props for slots (chips, form fields, empty states, etc.).
 */
export type VectorIconSlotProps = Pick<
  IconComponentProps,
  "name" | "library" | "size"
>;

/**
 * Vector icon component (@expo/vector-icons). For SVG assets, import **`SvgIcon`** from **`@/icons`**.
 *
 * ## Features
 * - **Type Safety**: TypeScript validates icon names for each library
 * - **Multiple Libraries**: Supports 7 popular icon libraries
 *
 * ## Supported Libraries
 * - `FontAwesome` - Classic font awesome icons
 * - `MaterialIcons` - Google Material Design icons
 * - `Ionicons` - Ionic framework icons
 * - `Feather` - Feather icon set
 * - `AntDesign` - Ant Design icon library
 * - `Entypo` - Entypo icon set
 * - `MaterialCommunityIcons` - Extended Material Design icons
 *
 * @example
 * ```tsx
 * <IconComponent
 *   library="Ionicons"
 *   name="home"
 *   size={24}
 *   color="#007AFF"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <IconComponent library="FontAwesome" name="heart" size={20} color="red" />
 * ```
 */
export default function IconComponent(props: IconComponentProps) {
  const { colors } = useTheme();
  const { size = 24, library, name } = props;

  const Icon = IconComponents[library];
  if (!Icon) {
    console.warn(`Icon library "${String(library)}" not found`);
    return null;
  }

  return (
    <Icon
      name={name as never}
      size={size}
      color={props.color ?? colors.text}
    />
  );
}
