import { getRGB, toIndex } from "../functions.js";
import { Point } from "./point.js";

export class Paintbrush {
  /**
   *
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Missing context");
    this.ctx = ctx;
    this.canvas.width = 100;
    this.canvas.height = 100;
    this.mode = "point";
    this.color = "#000000";
    //this.currentPosition = new Point(0, 0);
    this.canvas.addEventListener("click", this.click.bind(this));
  }

  /**
   *
   * @param {MouseEvent} event
   */
  click(event) {
    const convertedPoint = this.convertPosition(event.offsetX, event.offsetY);
    switch (this.mode) {
      case "point":
        this.setPixel(convertedPoint);
        break;

      default:
        break;
    }
  }

  setMode(mode) {
    this.mode = mode;
  }

  setColor(color) {
    this.color = color;
  }

  convertPosition(x, y) {
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    const canvasScreenWidth = this.canvas.getBoundingClientRect().width;
    const canvasScreenHeight = this.canvas.getBoundingClientRect().height;

    const xCanvas = Math.floor((canvasWidth * x) / canvasScreenWidth);
    const yCanvas = Math.floor((canvasHeight * y) / canvasScreenHeight);

    return new Point(xCanvas, yCanvas);
  }

  setPixel(point) {
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    const index = toIndex(point, imageData.width);
    const colors = getRGB(this.color);

    imageData.data[index + 0] = colors[0]; // red
    imageData.data[index + 1] = colors[1]; // green
    imageData.data[index + 2] = colors[2]; // blue
    imageData.data[index + 3] = 255; // transparency

    this.ctx.putImageData(imageData, 0, 0);
  }
}
