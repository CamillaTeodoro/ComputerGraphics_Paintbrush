import { getRGB, toIndex } from "../functions.js";
import { Point } from "./point.js";
import { Polygon } from "./polygon.js";

export class Paintbrush {
  /**
   *
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });
    if (!ctx) throw new Error("Missing context");
    this.ctx = ctx;
    this.canvas.width = 100;
    this.canvas.height = 100;
    this.mode = "point";
    this.color = "#000000";
    this.elements = [];
    this.clicksPerMode = 0;
    this.alg = "DDA";
    this.polygonSize = 3;
    //this.currentPosition = new Point(0, 0);
    this.canvas.addEventListener("click", this.click.bind(this));
  }

  /**
   *
   * @param {MouseEvent} event
   */
  click(event) {
    const convertedPoint = this.convertPosition(event.offsetX, event.offsetY);
    this.clicksPerMode++;
    switch (this.mode) {
      case "point":
        this.elements.push(convertedPoint);
        this.render();
        break;
      case "line":
        this.line(convertedPoint);
        break;
      case "polygon":
        this.polygon(convertedPoint);
        break;
      default:
        break;
    }
  }

  getAlg() {
    const alg = prompt("Digite 1 para DDA ou 2 para Bresenham: ");
    switch (alg) {
      case "1":
        return "DDA";

      case "2":
        return "Bresenham";

      default:
        alert("Opção inválida!");
        return "DDA";
    }
  }

  line(point) {
    if (this.clicksPerMode === 1) {
      const line = new Polygon(this.alg, this.color);
      line.addVertex(point);
      this.elements.push(line);
    }
    if (this.clicksPerMode === 2) {
      const line = this.elements[this.elements.length - 1];
      line.addVertex(point);
      this.clicksPerMode = 0;
      this.render();
    }
  }
  polygon(point) {
    if (this.clicksPerMode === 1) {
      const polygon = new Polygon(this.alg, this.color);
      polygon.addVertex(point);
      this.elements.push(polygon);
      return;
    }
    const polygon = this.elements[this.elements.length - 1];
    polygon.addVertex(point);
    if (this.clicksPerMode === this.polygonSize) {
      this.clicksPerMode = 0;
      this.render();
    }
  }
  setMode(mode) {
    if (mode != this.mode) this.clicksPerMode = 0;
    this.mode = mode;
    switch (this.mode) {
      case "line":
        this.alg = this.getAlg();
        break;
      case "polygon":
        const size = prompt("Digite o número de lados do polígono: ");
        if (!size) {
          alert("Erro!");
          return;
        }
        this.polygonSize = parseInt(size);
        this.alg = this.getAlg();
        break;

      default:
        break;
    }
  }

  setColor(color) {
    this.color = color;
  }

  render() {
    for (const element of this.elements) {
      if (element instanceof Point) {
        this.setPixel(element);
      }
      if (element instanceof Polygon) {
        for (let i = 0; i < element.vertices.length; i++) {
          const p1 = element.vertices[i];
          const p2 = element.vertices[(i + 1) % element.vertices.length];
          if (element.alg === "DDA") {
            this.dda(p1, p2, element.color);
          } else if (element.alg === "Bresenham") {
            this.bresenham(p1, p2, element.color);
          } else {
            alert("Algoritmo inválido!");
          }
        }
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

  dda(initialPoint, finalPoint, color) {
    const dx = finalPoint.x - initialPoint.x;
    const dy = finalPoint.y - initialPoint.y;
    let steps = 0;
    let x = initialPoint.x;
    let y = initialPoint.y;
    let xIncr = 0.0;
    let yIncr = 0.0;
    if (Math.abs(dx) > Math.abs(dy)) {
      steps = Math.abs(dx);
    } else {
      steps = Math.abs(dy);
    }
    xIncr = dx / steps;
    yIncr = dy / steps;
    this.setPixel(initialPoint);
    for (let i = 1; i <= steps; i++) {
      x += xIncr;
      y += yIncr;
      this.setPixel(new Point(Math.round(x), Math.round(y), color));
    }
  }

  bresenham(initialPoint, finalPoint, color) {
    let dx = finalPoint.x - initialPoint.x;
    let dy = finalPoint.y - initialPoint.y;
    let xIncr, yIncr, x, y, p, const1, const2;

    if (dx >= 0) {
      xIncr = 1;
    } else {
      xIncr = -1;
      dx = -dx;
    }
    if (dy >= 0) {
      yIncr = 1;
    } else {
      yIncr = -1;
      dy = -dy;
    }
    x = initialPoint.x;
    y = initialPoint.y;
    this.setPixel(new Point(x, y, color));
    if (dx > dy) {
      p = 2 * dy - dx;
      const1 = 2 * dy;
      const2 = 2 * (dy - dx);

      for (let i = 0; i < dx; i++) {
        x += xIncr;
        if (p < 0) {
          p += const1;
        } else {
          p += const2;
          y += yIncr;
        }
        this.setPixel(new Point(x, y, color));
      }
    } else {
      p = 2 * dx - dy;
      const1 = 2 * dx;
      const2 = 2 * (dx - dy);
      for (let i = 0; i < dy; i++) {
        y += yIncr;
        if (p < 0) {
          p += const1;
        } else {
          p += const2;
          x += xIncr;
        }
        this.setPixel(new Point(x, y, color));
      }
    }
  }
}
