import * as styles from "../STYLES";

import Theme from "../core/Theme";

import type Pea from "../core/Pea";
import type { ThemeOptions } from "../core/Theme";

class DefaultTheme extends Theme {
  static DEFAULTS: ThemeOptions = {
    modules: {},
    docStyles: styles.defaultTheme as Record<string, string>,
  };

  constructor(pea: Pea, options?: ThemeOptions) {
    super(pea, { ...DefaultTheme.DEFAULTS, ...options });
  }
}

export { DefaultTheme as default };
