import Pea from "../core/Pea";
import Module from "../core/Module";
import Document from "../core/Document";
import { Position } from "../core/Document";

import type { Snippet } from "../core/Document";

class Cursor extends Module {
  CONFIG = {
    auto: true,
    blinkLength: 30,
    blinkFrequency: 2,
  };

  pos: Position;
  focusedSnippet: Snippet = { text: "" };
  lastTextChange: number = Date.now();

  constructor(pea: Pea) {
    super(pea);

    this.pos = this.pea.document.selection.end;
    this.updateFocusedSnippet();

    this.pea.emitter.on("selection-change", () => {
      this.lastTextChange = Date.now();
      this.updateFocusedSnippet();
    });
  }

  private updateFocusedSnippet(): void {
    [this.focusedSnippet] = this.pea.document.snippetAt(
      this.pos.x(),
      this.pos.y()
    );
  }

  render(ctx: CanvasRenderingContext2D, frame: number): void {
    const fs = parseInt(
      (this.focusedSnippet.formats?.font as string) || Document.DEFAULTS.font
    );

    const h = this.pea.options.page.lineHeight * fs,
      x = this.pos.rx(),
      y = this.pos.ry() - h * 0.85;

    ctx.clearRect(0, y - 0.5, x + 1, h * 1.85);

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
