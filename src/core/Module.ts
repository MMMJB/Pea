import type Pea from "./Pea";

abstract class Module<T extends {} = {}> {
  static DEFAULTS = {};

  constructor(
    protected pea: Pea,
    protected options: Partial<T> = {}
  ) {}
}

export { Module as default };
