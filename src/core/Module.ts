import type Pea from "./Pea";

abstract class Module<T extends {} = {}> {
  prototype = this;

  render?(ctx: CanvasRenderingContext2D): void;
  abstract CONFIG: Record<string, any>;

  constructor(
    protected pea: Pea,
    protected options: Partial<T> = {}
  ) {}
}

export { Module as default };
