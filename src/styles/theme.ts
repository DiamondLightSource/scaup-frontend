import { alertAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle, extendTheme } from "@chakra-ui/react";
import { theme } from "@diamondlightsource/ui-components";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  alertAnatomy.keys,
);

const baseInfo = definePartsStyle({
  description: { fontWeight: "600", color: "grey.800" },
  container: {
    padding: "1em",
    borderLeft: "3px solid",
    borderColor: "diamond.800",
    bg: "diamond.100",
  },
  icon: { w: "20px", mr: "1em", color: "diamond.800" },
});

const linkStyle = defineStyle({
  baseStyle: {
    color: "diamond.600",
  },
});

const alertTheme = defineMultiStyleConfig({ variants: { info: baseInfo } });

export const customTheme = extendTheme({
  ...theme,
  components: { ...theme.components, Alert: alertTheme, Link: linkStyle },
});
