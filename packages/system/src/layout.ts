import { toCssUnit } from "./toCSS";
import { LayoutKeys } from "./keys";
import {
  AddProperty,
  CSSProperties,
  ResponsiveStyle,
  ThemeSystemType,
  ValueConverter,
} from "./types";
import { applyResponsiveStyles } from "./responsive";

export type LayoutProps<T extends ThemeSystemType = ThemeSystemType> = Partial<
  AddProperty<
    CSSProperties<"width" | "minWidth" | "maxWidth", true>,
    T["sizes"]
  > &
    AddProperty<
      CSSProperties<"height" | "minHeight" | "maxHeight", true>,
      T["sizes"]
    > &
    CSSProperties<"display" | "position"> &
    CSSProperties<"overflow" | "overflowX" | "overflowY"> &
    AddProperty<CSSProperties<"zIndex", true>, T["zIndices"]> &
    CSSProperties<"cursor" | "userSelect"> &
    CSSProperties<"aspectRatio"> &
    CSSProperties<"boxSizing"> &
    CSSProperties<"float" | "clear"> &
    CSSProperties<"objectFit" | "objectPosition"> &
    CSSProperties<"resize"> &
    CSSProperties<"verticalAlign">
>;

export const layoutMappings: Record<LayoutKeys, string> = {
  width: "width",
  minWidth: "min-width",
  maxWidth: "max-width",
  height: "height",
  minHeight: "min-height",
  maxHeight: "max-height",
  display: "display",
  overflow: "overflow",
  overflowX: "overflow-x",
  overflowY: "overflow-y",
  position: "position",
  zIndex: "z-index",
  cursor: "cursor",
  aspectRatio: "aspect-ratio",
  boxSizing: "box-sizing",
  float: "float",
  clear: "clear",
  objectFit: "object-fit",
  objectPosition: "object-position",
  resize: "resize",
  verticalAlign: "vertical-align",
  userSelect: "user-select",
} as const;

const converters: Partial<Record<LayoutKeys, ValueConverter>> = {
  width: toCssUnit,
  minWidth: toCssUnit,
  maxWidth: toCssUnit,
  height: toCssUnit,
  minHeight: toCssUnit,
  maxHeight: toCssUnit,
  zIndex: (t) => t,
};

export const layout = (props: LayoutProps): ResponsiveStyle => {
  let base = "";
  const media: ResponsiveStyle["media"] = {};
  for (const key in layoutMappings) {
    const cssValue = props[key as LayoutKeys];
    if (cssValue != undefined) {
      const property = layoutMappings[key as LayoutKeys];
      const converter = converters[key as LayoutKeys];
      const responsiveStyles = applyResponsiveStyles(
        property,
        cssValue,
        converter,
      );
      base += responsiveStyles.base;
      for (const [breakpoint, css] of Object.entries(responsiveStyles.media)) {
        if (media[breakpoint]) media[breakpoint] += css;
        else media[breakpoint] = css;
      }
    }
  }

  return { base, media };
};
