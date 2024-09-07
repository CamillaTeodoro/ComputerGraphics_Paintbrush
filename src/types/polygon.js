export class Polygon {
  constructor(alg, color) {
    this.vertices = [];
    this.alg = alg;
    this.color = color;
  }

  addVertex(point) {
    this.vertices.push(point);
  }
}
