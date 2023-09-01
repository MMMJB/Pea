// @ts-expect-error
import EventEmitter from "events";
import DefaultTheme from "../themes/DefaultTheme";

import type Theme from "./Theme";

interface PeaOptions {
  theme: Theme;
  modules: Record<string, Function>;
  readOnly?: boolean;
  placeholder?: string;
  margin?: number;
}

class Pea {
  static MODULES: Record<string, Function> = {};

  container: HTMLElement;
  root: HTMLCanvasElement;
  options: PeaOptions;
  modules: Record<string, Function>;
  emitter: EventEmitter;

  static register(module: unknown | unknown[]): void {
    if (typeof module !== "function") {
      for (const m of module as any) this.register(m);
    } else {
      Pea.MODULES[module.name] = module;
    }
  }

  constructor(container: HTMLElement | string, options: Partial<PeaOptions>) {
    if (typeof container === "string")
      this.container = document.querySelector(container) as HTMLElement;
    else this.container = container;

    this.root = document.createElement("canvas");
    this.root.setAttribute("class", "pea--root");
    this.container.appendChild(this.root);

    this.emitter = new EventEmitter();

    const DEFAULTS: PeaOptions = {
      theme: new DefaultTheme(this),
      readOnly: false,
      placeholder: "",
      modules: Pea.MODULES,
      margin: 1,
    };

    this.options = { ...DEFAULTS, ...options };
    this.modules = this.options.modules || Pea.MODULES;

    for (const module in this.modules)
      console.log(new this.modules[module].prototype.constructor(this));

    this.options.theme.init();
  }
}

export { Pea as default };
