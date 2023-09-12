import { Position } from "./Document";

import type Pea from "./Pea";

class Selection {
  pea: Pea;
  start: Position;
  end: Position;
  height: number = 0;

  // TODO: Make compatible with multiline selections
  constructor(pea: Pea, x: number, y: number, length?: number) {
    this.pea = pea;

    this.start = new Position(this.pea, x, y);
    this.end = length ? this.calculateEnd(length) : Position.set(this.start);

    this.pea.emitter.on("selection-change", () => {
      this.height = this.calculateHeight();
    });
  }

  rx = (): number => this.start.rx();
  ry = (): number => this.start.ry() - this.height * 0.85;
  rw = (): number => this.end.rx() - this.start.rx();

  calculateEnd(length: number): Position {
    return new Position(this.pea, this.start.x() + length, 0); // TODO: CALCULATE END POSITION
  }

  // ! Doesn't work with multiline selections
  private calculateHeight(): number {
    const line = this.pea.document.content[this.start.y()].snippets;

    return (
      line.reduce(
        (a, b) =>
          a + parseInt((b.formats?.font as string) || this.pea.ctx.font),
        0
      ) / line.length
    );
  }
}

export { Selection as default };
