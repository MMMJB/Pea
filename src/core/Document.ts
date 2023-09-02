import Selection from "./Selection";

import type Pea from "./Pea";

interface Snippet {
  text: string;
  formats?: Record<string, unknown>;
}

interface SnippetCollection {
  snippets: Snippet[];
  length: number;
}

class Position {
  // Returns either index of position in snippet collection or render location
  constructor(
    protected pea: Pea,
    protected px: number,
    protected py: number
  ) {}

  x = (): number => this.px;
  y = (): number => this.py;
  rx = (): number => this.px + this.pea.options["margin"] * 96;
  ry = (): number => this.py + this.pea.options["margin"] * 96;

  set(nX: number, nY: number) {
    this.px = nX;
    this.py = nY;
  }
}

class Document {
  pea: Pea;
  content: SnippetCollection[] = [];
  selection: Selection;

  constructor(pea: Pea) {
    this.pea = pea;
    this.content.push({ snippets: [], length: 0 });
    this.selection = new Selection(this.pea, 0, 0);
  }

  insertChar(char: string) {}

  insertText(text: string) {
    text.split("").forEach((c) => this.insertChar(c));
  }
}

export { Position, Document as default };
