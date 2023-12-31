// @ts-expect-error
import EventEmitter from "events";
import DefaultTheme from "../themes/DefaultTheme";
import Document from "./Document";

import type Theme from "./Theme";
import type Module from "./Module";

interface PeaOptions {
  theme: Theme;
  modules: string[];
  readOnly?: boolean;
  placeholder?: string;
  page: {
    lineHeight: number;
    margin: number;
  };
}

class Pea {
  static MODULES: Record<string, Module | Function> = {};

  container: HTMLElement;
  root: HTMLCanvasElement;
  options: PeaOptions;
  emitter: EventEmitter;
  document: Document;
  modules: Record<string, Module> = {};
  ctx: CanvasRenderingContext2D;

  static register(
    name?: string,
    module?: Module | Function,
    modules?: Record<string, Module | Function>
  ): void {
    if (modules) {
      for (const name in modules) Pea.register(name, modules[name]);
    } else if (name && module) Pea.MODULES[name] = module;
  }

  static applyStyles(
    el: HTMLElement,
    styles: Partial<CSSStyleDeclaration>
  ): void {
    for (const style in styles) {
      const p = style.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
      el.style.setProperty(p, styles[style] as string);
    }
  }

  constructor(container: HTMLElement | string, options: Partial<PeaOptions>) {
    if (typeof container === "string")
      this.container = document.querySelector(container) as HTMLElement;
    else this.container = container;

    this.root = document.createElement("canvas");
    this.root.setAttribute("class", "pea--root");
    this.ctx = this.root.getContext("2d") as CanvasRenderingContext2D;
    this.container.appendChild(this.root);

    new ResizeObserver((e) => {
      const { width: w, height: h } = e[0].contentRect;
      const dpr = window.devicePixelRatio || 1;

      this.root.width = w * dpr;
      this.root.height = h * dpr;
    }).observe(this.root);

    this.emitter = new EventEmitter();

    const DEFAULTS: PeaOptions = {
      theme: new DefaultTheme(this),
      readOnly: false,
      placeholder: "",
      modules: Object.keys(Pea.MODULES),
      page: {
        lineHeight: 1,
        margin: 1,
      },
    };

    this.options = { ...DEFAULTS, ...options };

    this.document = new Document(this);

    this.options.modules.forEach((m) => {
      if (Object.keys(Pea.MODULES).includes(m))
        this.modules[m] = new Pea.MODULES[m].prototype.constructor(this);
      else
        console.warn(
          `Could not find module "${m}". Make sure you've registered it before initializing Pea.`
        );
    });

    this.options.theme.init();
    this.render(this.modules, 0);
  }

  focus = (): void => this.document.focus();
  blur = (): void => this.document.blur();
  hasFocus = (): boolean => this.document.focused;

  render(modules: Record<string, Module>, f: number) {
    const start = Date.now();

    const s = this.document.selection,
      h = s.height,
      x = s.end.rx(),
      y = s.end.ry() - h * 0.85,
      c = this.ctx;

    c.clearRect(0, y - 2, c.canvas.width, h + 2);

    // ! OPTIMIZE IN FUTURE
    for (const module in modules) {
      const m = modules[module];

      if (
        (("CONFIG" in m.prototype && m.CONFIG?.auto) ||
          !("CONFIG" in m.prototype)) &&
        "render" in m.prototype
      )
        // @ts-expect-error
        m.render(this.ctx, f);
    }

    c.save();
    c.fillStyle = "#B4D5FE";
    c.fillRect(x, y, s.rw(), h);
    c.restore();

    this.document.renderLine(s.end.y());

    c.font = "16px sans-serif";
    c.clearRect(0, 0, 1000, 16);
    c.fillText(Date.now() - start + "ms", 0, 16);

    window.requestAnimationFrame(() => this.render(modules, f + 1));
  }

  getFontSize = (f?: string): number => parseInt(f || this.ctx.font);
}

export { Pea as default };
