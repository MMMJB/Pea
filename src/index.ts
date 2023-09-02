import Pea from "./core/Pea";

import Cursor from "./modules/Cursor";
import Keyboard from "./modules/Keyboard";

Pea.register("cursor", Cursor);
Pea.register("keyboard", Keyboard);

export { Pea as default };
