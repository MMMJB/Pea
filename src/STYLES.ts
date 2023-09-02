const defaultTheme: Partial<CSSStyleDeclaration> = {
  width: "8.5in",
  height: "11in",
  backgroundColor: "#FFFFFD",
  borderRadius: "4px",
  boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.16)",
};

const ruler: Partial<CSSStyleDeclaration> = {
  position: "absolute",
  color: "transparent",
  pointerEvents: "none",
};

export { defaultTheme, ruler };
