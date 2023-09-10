import Pea from "../core/Pea";
import Module from "../core/Module";
import { Position } from "../core/Document";

class Cursor extends Module {
  CONFIG = {
    auto: true,
    blinkLength: 30,
    blinkFrequency: 2,
  };

  pos: Position;
  lastTextChange: number = Date.now();

  constructor(pea: Pea) {
    super(pea);

    this.pos = this.pea.document.selection.end;
    this.pea.emitter.on(
      "selection-change",
      () => (this.lastTextChange = Date.now())
    );
  }

  render(ctx: CanvasRenderingContext2D, frame: number): void {
    const h = this.pea.options.page.lineHeight * this.pea.getFontSize(),
      x = this.pos.rx(),
      y = this.pos.ry();

    ctx.clearRect(0, y, x + 0.5, h);
    this.pea.document.renderLine(this.pos.y());

    if (
      Math.floor(frame / this.CONFIG.blinkLength) %
        this.CONFIG.blinkFrequency ===
        0 ||
      Date.now() - this.lastTextChange < 500
    ) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + h);
      ctx.stroke();
    }
  }
}

export { Cursor as default };
