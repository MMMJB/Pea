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

interface RenderObj {
  px: number;
  py: number;
  rx: number;
  ry: number;
}

class Position {
  pea: Pea;
  last: RenderObj;

  constructor(
    pea: Pea,
    protected px: number, // Current (index) position
    protected py: number
  ) {
    this.pea = pea;

    this.last = {
      px: this.px,
      py: this.py,
      rx: this.computeRenderOffsetX(false),
      ry: this.computeRenderOffsetY(false),
    };
  }

  private computeRenderOffsetX(update: boolean = true): number {
    const offs = this.px;

    if (update) {
      this.last.rx = offs;
      this.last.px = this.px;
    }

    return offs + this.pea.options.page.margin * 96;
  }

  private computeRenderOffsetY(update: boolean = true): number {
    const offs =
      this.pea.options.page.lineHeight * this.pea.getFontSize() * this.py;

    if (update) {
      this.last.ry = offs;
      this.last.py = this.py;
    }

    return offs + this.pea.options.page.margin * 96;
  }

  x = (): number => this.px;
  y = (): number => this.py;
  // TODO: Sum up all previous char widths, but only if position has changed (interface)
  rx = (): number => {
    if (this.px === this.last.px) return this.last.rx;
    return this.computeRenderOffsetX();
  };

  ry = (): number => {
    if (this.py === this.last.py) return this.last.ry;
    return this.computeRenderOffsetY();
  };

  set(
    nX?: number | ((x: number) => number),
    nY?: number | ((y: number) => number) // Add event suppression
  ): void {
    if (typeof nX === "number") this.px = nX;
    else if (typeof nX === "function") this.px = nX(this.px);

    if (typeof nY === "number") this.py = nY;
    else if (typeof nY === "function") this.py = nY(this.py);

    this.pea.emitter.emit("selection-change");
  }

  setX = (nX: number): void => this.set(nX);
  setY = (nY: number): void => this.set(undefined, nY);

  static set(position: Position): Position {
    return new Position(position.pea, position.x(), position.y());
  }

  copy(p: Position, suppress?: boolean): void {
    this.px = p.x();
    this.py = p.y();

    if (!suppress) this.pea.emitter.emit("selection-change");
  }
}

class Document {
  static WHITELIST = String.fromCharCode(
    ...Array.from(Array(94), (_, i) => i + 33)
  );

  pea: Pea;
  content: SnippetCollection[] = [];
  selection: Selection;
  fontSets: Record<string, Record<string, TextMetrics>> = {};
  curSet: Record<string, TextMetrics>;

  constructor(pea: Pea) {
    this.pea = pea;
    this.content.push({ snippets: [], length: 0 });
    this.selection = new Selection(this.pea, 0, 0);

    // * TEMPORARY
    this.curSet = this.measureSet();
    console.log(this.curSet);
  }

  measureSet(): Record<string, TextMetrics> {
    // TODO: Fetch current snippet font
    const font = this.pea.ctx.font;
    // ? Optimize by scaling other calculated fonts; tradeoff worth it?
    // const [size, family] = font.split(" ");

    // const existing = Object.keys(this.fontSets).filter(
    //   (f) => f.split(" ")[1] === family
    // );

    if (font in this.fontSets) return this.fontSets[font];
    // else if (existing.length > 0) {
    //   const scalar = parseInt(size) / parseInt(existing[0].split(" ")[0]);
    //   console.log({ ...this.fontSets[existing[0]] });
    // }
    else this.fontSets[font] = {};

    Document.WHITELIST.split("").forEach(
      (c) => (this.fontSets[font][c] = this.pea.ctx.measureText(c))
    );

    return this.fontSets[font];
  }

  appendChar(char: string): void {
    const line =
      this.content.at(-1) ||
      this.content[this.content.push({ snippets: [], length: 0 }) - 1];
    const snippet =
      line.snippets.at(-1) ||
      line.snippets[line.snippets.push({ text: "" }) - 1];

    snippet.text += char;
    line.length++;

    this.selection.start.set((n) => n + 1);
    this.selection.end.copy(this.selection.start, true);
  }

  appendText(text: string): void {
    text.split("").forEach((c) => this.appendChar(c));
  }

  newLine(selection?: Selection): void {
    // TODO: selection || this.selection
  }

  removeText(selection?: Selection): void {
    // TODO: selection || this.selection
  }
}

export { Position, Document as default };
