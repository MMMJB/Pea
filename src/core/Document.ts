import * as styles from "../STYLES";

import Pea from "./Pea";
import Selection from "./Selection";

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
  ruler: HTMLDivElement;

  constructor(pea: Pea) {
    this.pea = pea;
    this.content.push({ snippets: [], length: 0 });
    this.selection = new Selection(this.pea, 0, 0);

    this.ruler = document.createElement("div");
    this.ruler.classList.add(".pea--ruler");
    Pea.applyStyles(this.ruler, styles.ruler);
    this.pea.container.appendChild(this.ruler);
  }

  insertChar(char: string): void {}

  insertText(text: string): void {
    text.split("").forEach((c) => this.insertChar(c));
  }

  newLine(selection?: Selection): void {
    // selection || this.selection
  }

  removeText(selection?: Selection): void {
    // selection || this.selection
  }
}

export { Position, Document as default };
