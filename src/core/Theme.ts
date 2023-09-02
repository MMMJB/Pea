import Pea from "./Pea";

interface ThemeOptions {
  modules: Record<string, unknown>;
  docStyles: Record<string, string>;
}

class Theme {
  static DEFAULTS: ThemeOptions = {
    modules: {},
    docStyles: {},
  };

  options: ThemeOptions;
  pea: Pea;

  constructor(pea: Pea, options: ThemeOptions) {
    this.pea = pea;
    this.options = options;
  }

  init(): void {
    Pea.applyStyles(this.pea.root, this.options.docStyles);
  }
}

export { Theme as default };
export type { ThemeOptions };
