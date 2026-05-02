import React from "react";
import { ThemeProvider } from "next-themes";
import { Decorator } from "@storybook/react";

const canvasStyles: React.CSSProperties = {
  width: "100%",
  height: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "2rem",
  boxSizing: "border-box",
  backgroundColor: "transparent",
  color: "var(--color-foreground)",
};

export const ThemeDecorator: Decorator = (Story, context) => {
  const theme = context.globals.theme || "light";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={theme}
      enableSystem={false}
      forcedTheme={theme}
      disableTransitionOnChange
    >
      <div className={theme}>
        <div style={canvasStyles}>
          <Story />
        </div>
      </div>
    </ThemeProvider>
  );
};
