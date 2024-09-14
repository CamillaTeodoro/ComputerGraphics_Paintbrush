import { Paintbrush } from "./types/paintbrush.js";

function main() {
  const canvas = document.querySelector("canvas");
  if (!canvas) return;
  /**@type {HTMLFormElement | null} */
  const colorForm = document.querySelector("#color-form");
  if (!colorForm) return;
  /**@type {HTMLFormElement | null} */
  const modeForm = document.querySelector("#mode-form");
  if (!modeForm) return;

  const cleanScreen = document.querySelector("#cleanScreen");
  if (!cleanScreen) return;

  const paint = new Paintbrush(canvas);

  modeForm.addEventListener("change", () => {
    const mode = new FormData(modeForm).get("mode");
    paint.setMode(mode);
  });
  colorForm.addEventListener("change", () => {
    const color = new FormData(colorForm).get("color");
    paint.setColor(color);
  });

  cleanScreen.addEventListener("click", () => {
    paint.cleanScreen();
  });
}
main();
