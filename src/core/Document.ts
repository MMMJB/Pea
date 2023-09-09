import Pea from "./Pea";
import Selection from "./Selection";

interface Snippet {
  text: string;
  formats?: Record<string, string | number>;
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

  static set(position: Position): Position {
    return new Position(position.pea, position.x(), position.y());
  }

  private computeRenderOffsetX(update: boolean = true): number {
    let offs = this.pea.options.page.margin * 96;

    if (!this.pea.document) return offs;

    offs += this.pea.document.measureText(this.py, 0, this.px);

    if (update) {
      this.last.rx = offs;
      this.last.px = this.px;
    }

    return offs;
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
  rx = (): number =>
    this.px === this.last.px ? this.last.rx : this.computeRenderOffsetX();
  ry = (): number =>
    this.py === this.last.py ? this.last.ry : this.computeRenderOffsetY();

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

  copy(p: Position, suppress?: boolean): void {
    this.px = p.x();
    this.py = p.y();

    if (!suppress) this.pea.emitter.emit("selection-change");
  }
}

class Document {
  static WHITELIST =
    String.fromCharCode(...Array.from(Array(94), (_, i) => i + 33)) + " ";

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
    // TODO: Automatically add new line on text overflow
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

    this.pea.emitter.emit("text-change");
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

  snippetAt(x: number, y: number): [Snippet, number] {
    const line = this.content[y];

    let i = 0,
      ci = 0,
      t = 0,
      snippet: Snippet = line.snippets[i];

    while (ci < x) {
      if (ci - t === snippet.text.length) {
        i++;
        t += snippet.text.length;
        snippet = line.snippets[i];
      }

      ci++;
    }

    return [snippet, i];
  }

  measureText(line: number, start?: number, end?: number): number {
    const l = this.content[line],
      s = start || 0,
      e = end || l.length - 1;

    const [ss, si] = this.snippetAt(s, line);
    const [es, ei] = this.snippetAt(e, line);

    const sl = l.snippets
      .slice(0, s + 1)
      .reduce((a, c) => a + c.text.length, 0);
    const el = l.snippets
      .slice(0, e + 1)
      .reduce((a, c) => a + c.text.length, 0);

    const w = (t: string, f: string): number => {
      const s = this.fontSets[f || "10px sans-serif"];

      return t.split("").reduce((a, c) => a + s[c].actualBoundingBoxRight, 0); // + [c].actualBoundingBoxLeft
    };

    let t = 0;

    t += w(ss.text.substring(sl - s), ss.formats?.font as string);
    t += w(es.text.substring(el - e), es.formats?.font as string);

    for (let i = si + 1; i < ei; i++)
      t += w(l.snippets[i].text, l.snippets[i].formats?.font as string);

    return t;
  }
}

export { Position, Document as default };
