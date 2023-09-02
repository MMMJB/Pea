import Module from "../core/Module";

import type Pea from "../core/Pea";
import type { Position } from "../core/Renderer";

class Cursor extends Module {
  CONFIG = {
    // TEMPORARY
    lineHeight: 1.5,
    fontSize: 12,
  };

  pos: Position;

  constructor(pea: Pea) {
    super(pea);

    this.pos = { x: 0, y: 0 };
  }

  x = (): number => this.pos.x + this.pea.options["margin"] * 96;
  y = (): number => this.pos.y + this.pea.options["margin"] * 96;

  render(ref: Cursor) {
    const ctx = ref.pea.ctx,
      x = ref.x(),
      y = ref.y(),
      h = ref.CONFIG.fontSize * ref.CONFIG.lineHeight;

    ctx.clearRect(x, y, 1, h);

    ctx.moveTo(x, y);
    ctx.lineTo(x, y + h);
    ctx.stroke();
  }
}

export { Cursor as default };
