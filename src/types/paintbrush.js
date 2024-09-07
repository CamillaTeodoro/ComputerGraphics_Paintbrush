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
    this.elements = [];
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
        this.elements.push(convertedPoint);
        this.render();
        break;
      case "line":
        this.line();
        break;
      default:
        break;
    }
  }

  line() {
    const alg = prompt("Digite 1 para DDA ou 2 para Bresenham: ");
    switch (alg) {
      case "1":
        console.log("DDA");
        break;
      case "2":
        console.log("Bresenham");
        break;

      default:
        console.log("Opção inválida!");
        break;
    }
  }
  setMode(mode) {
    this.mode = mode;
  }

  setColor(color) {
    this.color = color;
  }

  render() {
    for (const element of this.elements) {
      if (element instanceof Point) {
        this.setPixel(element);
      }
    }
  }

  convertPosition(x, y) {
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    const canvasScreenWidth = this.canvas.getBoundingClientRect().width;
    const canvasScreenHeight = this.canvas.getBoundingClientRect().height;

    const xCanvas = Math.floor((canvasWidth * x) / canvasScreenWidth);
    const yCanvas = Math.floor((canvasHeight * y) / canvasScreenHeight);

    return new Point(xCanvas, yCanvas, this.color);
  }

  setPixel(point) {
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    const index = toIndex(point, imageData.width);
    const colors = getRGB(point.color);

    imageData.data[index + 0] = colors[0]; // red
    imageData.data[index + 1] = colors[1]; // green
    imageData.data[index + 2] = colors[2]; // blue
    imageData.data[index + 3] = 255; // transparency

    this.ctx.putImageData(imageData, 0, 0);
  }

  cleanScreen() {
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    const colors = getRGB("#FFFFFF");
    for (let index = 0; index < imageData.data.length; index += 4) {
      //console.log(index);
      imageData.data[index + 0] = colors[0]; // red
      imageData.data[index + 1] = colors[1]; // green
      imageData.data[index + 2] = colors[2]; // blue
      imageData.data[index + 3] = 255; // transparency
    }
    this.elements.length = 0;
    this.ctx.putImageData(imageData, 0, 0);
  }
}
