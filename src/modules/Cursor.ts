import Pea from "../core/Pea";
import Module from "../core/Module";
import { Position } from "../core/Document";

class Cursor extends Module {
  CONFIG = {
    auto: true,
    // TEMPORARY
    lineHeight: 1.5,
    fontSize: 12,
  };

  pos: Position;

  constructor(pea: Pea) {
    super(pea);

    this.pos = this.pea.document.selection.end;
  }

  render(ctx: CanvasRenderingContext2D): void {
    const h = this.CONFIG.lineHeight * this.CONFIG.fontSize,
      x = this.pos.rx(),
      y = this.pos.ry();

    ctx.clearRect(x, y, 1, h);

    ctx.moveTo(x, y);
    ctx.lineTo(y, y + h);
    ctx.stroke();
  }
}

export { Cursor as default };
