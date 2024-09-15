import { getRGB, toIndex, toRadians } from "../functions.js";
import { Circumference } from "./circumference.js";
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
    this.canvas.width = 200;
    this.canvas.height = 200;
    this.mode = "point";
    this.color = "#000000";
    this.elements = [];
    this.windowVertices = [];
    this.clicksPerMode = 0;
    this.alg = "DDA";
    this.polygonSize = 3;
    this.radius = 1;
    this.xMax = 0;
    this.xMin = 0;
    this.yMax = 0;
    this.yMin = 0;
    //this.currentPosition = new Point(0, 0);
    this.canvas.addEventListener("click", this.click.bind(this));
  }

  /**
   *
   * @param {{
   *   offsetX: number
   *   offsetY: number
   * }} event
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
      case "circumference":
        this.circumference(convertedPoint);
        break;
      case "cohenSutherlandWindow":
        this.cohenSutherlandWindow(convertedPoint);
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
  circumference(point) {
    const circ = new Circumference(point, this.radius, this.color);
    this.elements.push(circ);
    this.render();
  }
  cohenSutherlandWindow(point) {
    if (this.clicksPerMode === 1) {
      this.windowVertices.length = 0;
      this.windowVertices.push(point);
    }
    if (this.clicksPerMode === 2) {
      this.windowVertices.push(point);
      this.clicksPerMode = 0;
      if (this.windowVertices[0].x > this.windowVertices[1].x) {
        this.xMax = this.windowVertices[0].x;
        this.xMin = this.windowVertices[1].x;
      } else {
        this.xMax = this.windowVertices[1].x;
        this.xMin = this.windowVertices[0].x;
      }
      if (this.windowVertices[0].y > this.windowVertices[1].y) {
        this.yMax = this.windowVertices[0].y;
        this.yMin = this.windowVertices[1].y;
      } else {
        this.yMax = this.windowVertices[1].y;
        this.yMin = this.windowVertices[0].y;
      }

      this.cohenSutherlandAlg();
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
      case "circumference":
        const raio = prompt("Digite o raio da circunferência: ");
        if (!raio) {
          alert("Erro!");
          return;
        }
        this.radius = parseInt(raio);
        break;
      case "translation":
        const xTranslation = parseInt(
          prompt("Digite o valor para transladar em X: ") ?? "0"
        );
        const yTranslation = parseInt(
          prompt("Digite o valor para transladar em Y: ") ?? "0"
        );
        if (isNaN(xTranslation) || isNaN(yTranslation)) {
          alert("Erro!");
          return;
        }
        this.translate(xTranslation, yTranslation);
        break;
      case "scale":
        const xScale = parseFloat(
          prompt(
            "Digite o valor para escala em X. Valor maior que 1 aumenta e entre 0 e 1 diminui."
          ) ?? "0"
        );
        const yScale = parseFloat(
          prompt(
            "Digite o valor para escala em Y. Valor maior que 1 aumenta e entre 0 e 1 diminui."
          ) ?? "0"
        );
        if (isNaN(xScale) || isNaN(yScale) || xScale < 0 || yScale < 0) {
          alert("Erro!");
          return;
        }
        this.scale(xScale, yScale);
        break;
      case "rotation":
        const angle = parseInt(
          prompt("Digite o valor em graus para rotacionar.") ?? "0"
        );
        if (isNaN(angle)) {
          alert("Erro!");
          return;
        }
        this.rotate(toRadians(angle % 360));
        break;
      case "mirror":
        const xMirror = parseInt(
          prompt(
            "Deseja espelhar em relação a X? Digite 1 para SIM e 0 para NÃO."
          ) ?? "0"
        );
        const yMirror = parseInt(
          prompt(
            "Deseja espelhar em relação a Y? Digite 1 para SIM e 0 para NÃO."
          ) ?? "0"
        );
        if (
          isNaN(xMirror) ||
          isNaN(yMirror) ||
          (xMirror != 1 && xMirror != 0) ||
          (yMirror != 1 && yMirror != 0)
        ) {
          alert("Erro!");
          return;
        }
        this.mirror(xMirror, yMirror);
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
      if (element instanceof Circumference) {
        this.circBresenham(element.center, element.raio, element.color);
      }
    }
  }

  cohenSutherlandAlg() {
    this.resetCanvas();
    const p = new Polygon("DDA", "#000000");
    p.addVertex(new Point(this.xMin, this.yMin, this.color));
    p.addVertex(new Point(this.xMax, this.yMin, this.color));
    p.addVertex(new Point(this.xMax, this.yMax, this.color));
    p.addVertex(new Point(this.xMin, this.yMax, this.color));
    const oldElements = this.elements;
    this.elements = [p];
    this.render();
    this.elements = oldElements;
    for (const element of this.elements) {
      if (!(element instanceof Polygon)) continue;
      if (element.vertices.length != 2) continue;
      this.cohen(
        element.vertices[0].x,
        element.vertices[0].y,
        element.vertices[1].x,
        element.vertices[1].y,
        element.color
      );
    }
  }
  // bottom e top estão trocados
  cohen(x1, y1, x2, y2, color) {
    let c1, c2, cOut, xInt, yInt;
    let accept = false;
    let done = false;
    while (!done) {
      c1 = this.computeCode(x1, y1);
      c2 = this.computeCode(x2, y2);
      if (c1 === 0 && c2 === 0) {
        accept = true;
        done = true;
      } else if (c1 & c2) {
        done = true;
      } else {
        if (c1 != 0) {
          cOut = c1;
        } else {
          cOut = c2;
        }
        if (cOut & 1) {
          // LEFT
          xInt = this.xMin;
          yInt = y1 + ((y2 - y1) * (this.xMin - x1)) / (x2 - x1);
        } else if (cOut & 2) {
          // RIGHT
          xInt = this.xMax;
          yInt = y1 + (y2 - y1) * ((this.xMax - x1) / (x2 - x1));
        } else if (cOut & 8) {
          // BOTTOM
          yInt = this.yMin;
          xInt = x1 + (x2 - x1) * ((this.yMin - y1) / (y2 - y1));
        } else if (cOut & 4) {
          // TOP
          yInt = this.yMax;
          xInt = x1 + (x2 - x1) * ((this.yMax - y1) / (y2 - y1));
        }
        if (cOut === c1) {
          x1 = xInt;
          y1 = yInt;
        } else {
          x2 = xInt;
          y2 = yInt;
        }
      }
    }
    if (accept) {
      this.dda(
        new Point(Math.round(x1), Math.round(y1), color),
        new Point(Math.round(x2), Math.round(y2), color),
        color
      );
    }
  }

  computeCode(x, y) {
    let code = 0; // INSIDE

    if (x < this.xMin)
      // to the left of window
      code |= 1; // LEFT
    else if (x > this.xMax)
      // to the right of window
      code |= 2; // RIGHT
    if (y < this.yMin)
      // above the window
      code |= 8; // TOP
    else if (y > this.yMax)
      // below the window
      code |= 4; //  BOTTOM

    return code;
  }

  convertPosition(x, y) {
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    const canvasScreenWidth = this.canvas.getBoundingClientRect().width;
    const canvasScreenHeight = this.canvas.getBoundingClientRect().height;

    const xCanvas = Math.floor((canvasWidth * x) / canvasScreenWidth);
    const yCanvas = Math.floor((canvasHeight * y) / canvasScreenHeight);

    return this.translatePoint(
      new Point(xCanvas, yCanvas, this.color),
      -canvasWidth / 2,
      -canvasHeight / 2
    );
  }

  translatePoint(point, xTranslation, yTranslation) {
    return new Point(
      point.x + xTranslation,
      point.y + yTranslation,
      point.color
    );
  }

  setPixel(point) {
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    const result = this.translatePoint(
      point,
      this.canvas.width / 2,
      this.canvas.height / 2
    );
    const index = toIndex(result, imageData.width);
    const colors = getRGB(point.color);

    imageData.data[index + 0] = colors[0]; // red
    imageData.data[index + 1] = colors[1]; // green
    imageData.data[index + 2] = colors[2]; // blue
    imageData.data[index + 3] = 255; // transparency

    this.ctx.putImageData(imageData, 0, 0);
  }

  cleanScreen() {
    this.resetCanvas();
    this.elements.length = 0;
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

  circBresenham(center, radius, color) {
    let x = 0;
    let y = radius;
    let p = 3 - 2 * radius;
    this.plotaSimetricos(x, y, center.x, center.y, color);
    while (x < y) {
      if (p < 0) {
        p += 4 * x + 6;
      } else {
        p += 4 * (x - y) + 10;
        y--;
      }
      x++;
      this.plotaSimetricos(x, y, center.x, center.y, color);
    }
  }

  plotaSimetricos(x, y, Xcenter, Ycenter, color) {
    this.setPixel(new Point(x + Xcenter, y + Ycenter, color));
    this.setPixel(new Point(x + Xcenter, -y + Ycenter, color));
    this.setPixel(new Point(-x + Xcenter, y + Ycenter, color));
    this.setPixel(new Point(-x + Xcenter, -y + Ycenter, color));
    this.setPixel(new Point(y + Xcenter, x + Ycenter, color));
    this.setPixel(new Point(y + Xcenter, -x + Ycenter, color));
    this.setPixel(new Point(-y + Xcenter, x + Ycenter, color));
    this.setPixel(new Point(-y + Xcenter, -x + Ycenter, color));
  }

  translate(xTranslation, yTranslation) {
    this.resetCanvas();
    for (const element of this.elements) {
      if (element instanceof Point) {
        element.x += xTranslation;
        element.y += yTranslation;
      }
      if (element instanceof Polygon) {
        for (const vertex of element.vertices) {
          vertex.x += xTranslation;
          vertex.y += yTranslation;
        }
      }
      if (element instanceof Circumference) {
        element.center.x += xTranslation;
        element.center.y += yTranslation;
      }
    }
    this.render();
  }
  scale(xScale, yScale) {
    this.resetCanvas();
    for (const element of this.elements) {
      if (element instanceof Point) {
        element.x = Math.floor(element.x * xScale);
        element.y = Math.floor(element.y * yScale);
      }
      if (element instanceof Polygon) {
        for (const vertex of element.vertices) {
          vertex.x = Math.floor(vertex.x * xScale);
          vertex.y = Math.floor(vertex.y * yScale);
        }
      }
      if (element instanceof Circumference) {
        element.center.x = Math.floor(element.center.x * xScale);
        element.center.y = Math.floor(element.center.y * yScale);
        element.raio = Math.floor(element.raio * xScale);
      }
    }
    this.render();
  }
  mirror(xMirror, yMirror) {
    this.resetCanvas();
    for (const element of this.elements) {
      if (element instanceof Point) {
        if (xMirror === 1) {
          element.x = -element.x;
        }
        if (yMirror === 1) {
          element.y = -element.y;
        }
      }
      if (element instanceof Polygon) {
        for (const vertex of element.vertices) {
          if (xMirror === 1) {
            vertex.x = -vertex.x;
          }
          if (yMirror === 1) {
            vertex.y = -vertex.y;
          }
        }
      }
      if (element instanceof Circumference) {
        if (xMirror === 1) {
          element.center.x = -element.center.x;
        }
        if (yMirror === 1) {
          element.center.y = -element.center.y;
        }
      }
    }
    this.render();
  }
  rotate(angle) {
    this.resetCanvas();
    for (const element of this.elements) {
      if (element instanceof Point) {
        const originalX = element.x;
        const originalY = element.y;

        element.x = Math.floor(
          originalX * Math.cos(angle) - originalY * Math.sin(angle)
        );
        element.y = Math.floor(
          originalX * Math.sin(angle) + originalY * Math.cos(angle)
        );
      }

      if (element instanceof Polygon) {
        for (const vertex of element.vertices) {
          const originalX = vertex.x;
          const originalY = vertex.y;

          vertex.x = Math.floor(
            originalX * Math.cos(angle) - originalY * Math.sin(angle)
          );
          vertex.y = Math.floor(
            originalX * Math.sin(angle) + originalY * Math.cos(angle)
          );
        }
      }

      if (element instanceof Circumference) {
        const originalCenterX = element.center.x;
        const originalCenterY = element.center.y;

        element.center.x = Math.floor(
          originalCenterX * Math.cos(angle) - originalCenterY * Math.sin(angle)
        );
        element.center.y = Math.floor(
          originalCenterX * Math.sin(angle) + originalCenterY * Math.cos(angle)
        );
      }
    }

    this.render();
  }
  resetCanvas() {
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    const colors = getRGB("#FFFFFF");
    for (let index = 0; index < imageData.data.length; index += 4) {
      imageData.data[index + 0] = colors[0]; // red
      imageData.data[index + 1] = colors[1]; // green
      imageData.data[index + 2] = colors[2]; // blue
      imageData.data[index + 3] = 255; // transparency
    }
    this.ctx.putImageData(imageData, 0, 0);
  }
}
