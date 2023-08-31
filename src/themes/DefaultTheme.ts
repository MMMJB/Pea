import Theme from "../core/Theme";

import type Pea from "../core/Pea";
import type { ThemeOptions } from "../core/Theme";

class DefaultTheme extends Theme {
  static DEFAULTS: ThemeOptions = {
    modules: {},
    docStyles: {
      width: "8.5in",
      height: "11in",
      "background-color": "#FFFFFD",
      "border-radius": "4px",
      "box-shadow": "0px 1px 4px rgba(0, 0, 0, 0.16)",
    },
  };

  constructor(pea: Pea, options?: ThemeOptions) {
    super(pea, { ...DefaultTheme.DEFAULTS, ...options });
  }
}

export { DefaultTheme as default };
