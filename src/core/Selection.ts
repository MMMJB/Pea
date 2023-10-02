import { Position } from "./Document";

import type Pea from "./Pea";
import type { Snippet } from "./Document";

class Selection {
  pea: Pea;
  start: Position;
  end: Position;
  focusedSnippet: Snippet = { text: "" };
  focusedSnippetIndex: number = 0;
  height: number = 0;

  // TODO: Make compatible with multiline selections
  constructor(pea: Pea, x: number, y: number, length?: number) {
    this.pea = pea;

    this.start = new Position(this.pea, x, y);
    this.end = length
      ? this.calculateEnd(length)
      : Position.setFrom(this.start);

    this.pea.emitter.on("selection-change", () => {
      this.height = this.calculateHeight();
      this.updateFocusedSnippet();
    });
  }

  collapseAndMoveTo(
    x?: number | ((x: number) => number),
    y?: number | ((y: number) => number)
  ): void {
    let nx = typeof x === "function" ? x(this.end.x()) : x || this.end.x(),
      ny = typeof y === "function" ? y(this.end.y()) : y || this.end.y();

    if (nx < 0) nx = 0;
    else if (nx > this.pea.document.content[ny].length) nx = this.end.x();

    if (ny < 0) ny = 0;
    else if (ny > this.pea.document.content.length) ny = this.end.y();

    this.start.set(nx, ny);
    this.end.copy(this.start, true);
  }

  updateFocusedSnippet(): void {
    // TODO: Make compatible with multiple snippets at once
    [this.focusedSnippet, this.focusedSnippetIndex] =
      this.pea.document.snippetAt(this.end.x(), this.end.y());
  }

  rx = (): number => this.start.rx();
  ry = (): number => this.start.ry() - this.height * 0.85;
  rw = (): number => this.end.rx() - this.start.rx();

  xSpan = (): number => this.end.x() - this.start.x();
  ySpan = (): number => this.end.y() - this.start.y();
  isCollapsed = (): boolean => this.xSpan() === 0 && this.ySpan() === 0;

  calculateEnd(length: number): Position {
    return new Position(this.pea, this.start.x() + length, 0); // TODO: CALCULATE END POSITION
  }

  // ! Doesn't work with multiline selections
  private calculateHeight(): number {
    const line = this.pea.document.content[this.start.y()].snippets;

    return Math.max(
      ...Array.from(line, (s) =>
        parseInt((s.formats?.font as string) || this.pea.ctx.font)
      )
    );
  }
}

export { Selection as default };
