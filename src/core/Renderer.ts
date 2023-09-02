import type Pea from "./Pea";

interface Position {
  x: number;
  y: number;
}

class Renderer {
  pea: Pea;
  renderRefs: unknown[] = [];
  renderActions: Function[] = [];
  renderID: number | undefined;

  constructor(pea: Pea) {
    this.pea = pea;

    for (const name in this.pea.modules) {
      if ("render" in this.pea.modules[name].prototype) {
        this.renderActions.push(this.pea.modules[name].prototype["render"]);
        this.renderRefs.push(this.pea.modules[name]);
      } else console.warn(`Module "${name}" has no render function.`);
    }
  }

  start() {
    if (!this.renderID)
      this.renderID = window.requestAnimationFrame(() => this.render(this));
  }

  stop() {
    if (this.renderID) window.cancelAnimationFrame(this.renderID);
  }

  render(renderer: Renderer) {
    for (const [i, action] of renderer.renderActions.entries())
      action(renderer.renderRefs[i]);

    renderer.renderID = window.requestAnimationFrame(() =>
      renderer.render(renderer)
    );
  }
}

export { Renderer as default };
export type { Position };
