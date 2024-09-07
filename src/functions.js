import { Point } from "./types/point.js";

export function getRGB(color) {
  const colors = [];
  color = color.replace("#", "");
  colors[0] = parseInt(color.substring(0, 2), 16);
  colors[1] = parseInt(color.substring(2, 4), 16);
  colors[2] = parseInt(color.substring(4), 16);
  return colors;
}

export function toIndex(point, width) {
  return (point.y * width + point.x) * 4;
}

export function fromIndex(i, width) {
  i = i / 4;
  return new Point(i % width, (i / width) | 0);
}
