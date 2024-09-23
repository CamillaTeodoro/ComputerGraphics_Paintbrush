import { Point } from "./types/point.js";

/**
 * Recebe uma string cor e transforma em rgb
 * @param {string} color
 * @returns
 */
export function getRGB(color) {
  const colors = [];
  color = color.replace("#", "");
  colors[0] = parseInt(color.substring(0, 2), 16);
  colors[1] = parseInt(color.substring(2, 4), 16);
  colors[2] = parseInt(color.substring(4), 16);
  return colors;
}
/**
 * Pega o valor do index no array de pixels do canvas conforme o ponto
 * @param {Point} point
 * @param {number} width
 * @returns
 */
export function toIndex(point, width) {
  return (point.y * width + point.x) * 4;
}

/**
 * Retorna o ponto no canvas de acordo com sua posição no array de pixels do canvas
 * @param {number} i
 * @param {number} width
 * @returns
 */
export function fromIndex(i, width) {
  i = i / 4;
  return new Point(i % width, (i / width) | 0);
}

/**
 * Recebe um valor de angulo em graus e retorna o valor em radianos
 * Javascript trabalha com radianos
 * @param {number} angle
 * @returns
 */
export function toRadians(angle) {
  return angle * (Math.PI / 180);
}
