import { Position } from "./Document";

import type Pea from "./Pea";

class Selection {
  pea: Pea;
  start: Position;
  end: Position;

  constructor(pea: Pea, x: number, y: number, length?: number) {
    this.pea = pea;
    this.start = new Position(this.pea, x, y);
    this.end = length ? this.calculateEnd(length) : Position.set(this.start);
  }

  calculateEnd(length: number): Position {
    return new Position(this.pea, this.start.x() + length, 0); // TODO: CALCULATE END POSITION
  }
}

export { Selection as default };
