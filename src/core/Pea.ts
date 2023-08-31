import DefaultTheme from "../themes/DefaultTheme";

import type Theme from "./Theme";

interface PeaOptions {
  theme: Theme;
  modules: Record<string, unknown>;
  readOnly?: boolean;
  placeholder?: string;
}

class Pea {
  container: HTMLElement;
  root: HTMLCanvasElement;
  options: PeaOptions;
  modules: Record<string, unknown>;

  constructor(container: HTMLElement | string, options: Partial<PeaOptions>) {
    if (typeof container === "string")
      this.container = document.querySelector(container) as HTMLElement;
    else this.container = container;

    this.root = document.createElement("canvas");
    this.root.setAttribute("class", "pea--root");
    this.container.appendChild(this.root);

    const DEFAULTS: PeaOptions = {
      theme: new DefaultTheme(this),
      readOnly: false,
      placeholder: "",
      modules: {},
    };

    this.options = { ...DEFAULTS, ...options };
    this.modules = this.options.modules || {};

    this.options.theme.init();
  }
}

export { Pea as default };
