import Module from "../core/Module";

import type Pea from "../core/Pea";

class Cursor extends Module {
  constructor(pea: Pea) {
    super(pea);

    this.pea.root.addEventListener("mousemove", (e) => {
      console.log(e.clientX, e.clientY);
    });
  }
}

export { Cursor as default };
