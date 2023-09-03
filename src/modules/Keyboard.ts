import Pea from "../core/Pea";
import Module from "../core/Module";

class Keyboard extends Module {
  constructor(pea: Pea) {
    super(pea);

    window.addEventListener("keydown", (e) => {
      const key = e.key;

      if (key.length === 1) {
        if (!e.ctrlKey) e.preventDefault();
        this.pea.document.appendChar(key);
      } else {
        switch (key) {
          case "Backspace":
            this.pea.document.removeText();
            break;
          case "Enter":
            this.pea.document.newLine();
            break;
          default:
            break;
        }
      }
    });
  }
}

export { Keyboard as default };
