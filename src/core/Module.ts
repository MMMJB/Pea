import type Pea from "./Pea";

abstract class Module<T extends {} = {}> {
  prototype = this;

  abstract render(ref: unknown): void;
  abstract CONFIG: Record<string, any>;

  constructor(
    protected pea: Pea,
    protected options: Partial<T> = {}
  ) {}
}

export { Module as default };
