import Pea from "../core/Pea";
import Module from "../core/Module";

class Keyboard extends Module {
  constructor(pea: Pea) {
    super(pea);

    window.addEventListener("keydown", (e) => {
      if (!this.pea.hasFocus()) return;

      const key = e.key;

      if (key.length === 1) {
        if (e.ctrlKey) return;

        e.preventDefault();
        this.pea.document.appendChar(key);
      } else {
        switch (key) {
          case "Backspace":
            this.pea.document.removeText();
            break;
          case "Enter":
            this.pea.document.newLine();
            break;
          case "ArrowLeft":
            this.pea.document.selection.collapseAndMoveTo((n) => n - 1);
            break;
          case "ArrowRight":
            this.pea.document.selection.collapseAndMoveTo((n) => n + 1);
            break;
          default:
            break;
        }
      }
    });
  }
}

export { Keyboard as default };
