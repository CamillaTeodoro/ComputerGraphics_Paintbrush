import { Paintbrush } from "./types/paintbrush.js";

function main() {
  const canvas = document.querySelector("canvas");
  if (!canvas) return;
  const form = document.querySelector("form");
  if (!form) return;

  const cleanScreen = document.querySelector("#cleanScreen");
  if (!cleanScreen) return;

  const paint = new Paintbrush(canvas);

  form.addEventListener("change", () => {
    const mode = new FormData(form).get("mode");
    paint.setMode(mode);
    const color = new FormData(form).get("color");
    paint.setColor(color);
  });

  cleanScreen.addEventListener("click", () => {
    paint.cleanScreen();
  });
}
main();
