import { Vector } from "./type";
const { PI } = Math;

const dToRad = (angle: number) => (angle * PI) / 180;

const cross = (vec1: Vector, vec2: Vector): Vector => [
  vec1[1] * vec2[2] - vec2[1] * vec1[2],
  vec2[0] * vec1[2] - vec1[0] * vec2[2],
  vec1[0] * vec2[1] - vec2[0] * vec1[1],
];

const subtract = (vec1: Vector, vec2: Vector): Vector => [
  vec1[0] - vec2[0],
  vec1[1] - vec2[1],
  vec1[2] - vec2[2],
];

const dot = (vec1: Vector, vec2: Vector): number => {
  return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
};

const normalize = (v: Vector): Vector => {
  const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  // 确定不会除以 0
  if (length > 0.00001) {
    return [v[0] / length, v[1] / length, v[2] / length];
  } else {
    return [0, 0, 0];
  }
};

export { dToRad, cross, subtract, dot, normalize };
