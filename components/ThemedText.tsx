import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
  className?: string;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",

  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  mono: {
    fontFamily: "SpaceMono",
    fontSize: 16,
    lineHeight: 24,
  },
  default: {
    fontFamily: "Jost_400Regular",
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontFamily: "Jost_500Medium",
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontFamily: "Jost_700Bold",
    fontSize: 32,
    lineHeight: 32,
  },
  subtitle: {
    fontFamily: "Jost_600SemiBold",
    fontSize: 20,
  },
  link: {
    fontFamily: "Jost_400Regular",
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});
