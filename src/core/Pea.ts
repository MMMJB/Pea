// @ts-expect-error
import EventEmitter from "events";
import Renderer from "./Renderer";
import DefaultTheme from "../themes/DefaultTheme";

import type RendererT from "./Renderer";
import type Theme from "./Theme";
import type Module from "./Module";

interface PeaOptions {
  theme: Theme;
  modules: Record<string, Module | Function>;
  readOnly?: boolean;
  placeholder?: string;
  margin: number;
}

class Pea {
  static MODULES: Record<string, Module | Function> = {};

  container: HTMLElement;
  root: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  options: PeaOptions;
  modules: Record<string, Module | Function>;
  renderer: RendererT;
  emitter: EventEmitter;

  static register(
    name?: string,
    module?: Module | Function,
    modules?: Record<string, Module | Function>
  ): void {
    if (modules) {
      for (const name in modules) Pea.register(name, modules[name]);
    } else if (name && module) Pea.MODULES[name] = module;
  }

  constructor(container: HTMLElement | string, options: Partial<PeaOptions>) {
    if (typeof container === "string")
      this.container = document.querySelector(container) as HTMLElement;
    else this.container = container;

    this.root = document.createElement("canvas");
    this.root.setAttribute("class", "pea--root");
    this.root.style.setProperty("cursor", "text");
    this.ctx = this.root.getContext("2d") as CanvasRenderingContext2D;
    this.container.appendChild(this.root);

    new ResizeObserver((e) => {
      const { width, height } = e[0].contentRect;

      this.root.width = width;
      this.root.height = height;
    }).observe(this.root);

    this.emitter = new EventEmitter();

    const DEFAULTS: PeaOptions = {
      theme: new DefaultTheme(this),
      readOnly: false,
      placeholder: "",
      modules: Pea.MODULES,
      margin: 1,
    };

    this.options = { ...DEFAULTS, ...options };
    this.modules = { ...Pea.MODULES, ...this.options.modules };

    for (const name in this.modules)
      this.modules[name] = new this.modules[name].prototype.constructor(this);

    this.renderer = new Renderer(this);
    this.renderer.start();

    this.options.theme.init();
  }
}

export { Pea as default };
