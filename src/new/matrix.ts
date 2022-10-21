import { DEFAULT_VIEWPORT } from "./camera";
/*
 * NOTE: 手动计算矩阵，直接赋值，避免程序运算耗时
 */

import Camera from "./camera";
import { Vector3 } from "./type";
const { atan } = Math;

/* 计算模型矩阵 */
const computeModelMatrix = () => {};
/* 计算视图矩阵 */
const computeViewMatrix = (camera: Camera) => {
  const _camera = camera || new Camera();
  const { position, focus, up } = _camera;
  const f = normalize(subtract(position, focus));
  const r = normalize(cross(up, f));
  const u = normalize(cross(f, r));

  return [
    r[0],
    r[1],
    r[2],
    -dot(r, position),
    u[0],
    u[1],
    u[2],
    -dot(u, position),
    f[0],
    f[1],
    f[2],
    -dot(f, position),
    0,
    0,
    0,
    1,
  ];
};
/* 计算投影坐标 */
const computeProjectionMatrix = (camera: Camera) => {
  const _camera = camera || new Camera();
  const { fov, aspect, near, far } = Object.assign(
    DEFAULT_VIEWPORT,
    _camera.viewport
  );

  if (_camera.type === Camera.ORTHO) {
    return [
      atan(fov / 2 / aspect / near),
      0,
      0,
      0,
      0,
      atan(fov / 2 / near),
      0,
      0,
      0,
      0,
      2 / (near - far),
      -(near + far) / (near - far),
      0,
      0,
      0,
      1,
    ];
  } else if ((_camera.type = Camera.PERSPECT)) {
    return [
      atan(fov / 2 / aspect),
      0,
      0,
      0,
      0,
      atan(fov / 2),
      0,
      0,
      0,
      0,
      (near + far) / (near - far),
      (-2 * near * far) / (near - far),
      0,
      0,
      1,
      0,
    ];
  }
};

const cross = (vec1: Vector3, vec2: Vector3): Vector3 => [
  vec1[1] * vec2[2] - vec2[1] * vec1[2],
  vec2[0] * vec1[2] - vec1[0] * vec2[2],
  vec1[0] * vec2[1] - vec2[0] * vec1[1],
];

const subtract = (vec1: Vector3, vec2: Vector3): Vector3 => [
  vec1[0] - vec2[0],
  vec1[1] - vec2[1],
  vec1[2] - vec2[2],
];

const dot = (vec1: Vector3, vec2: Vector3): number => {
  return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
};

const normalize = (v: Vector3): Vector3 => {
  const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  // 确定不会除以 0
  if (length > 0.00001) {
    return [v[0] / length, v[1] / length, v[2] / length];
  } else {
    return [0, 0, 0];
  }
};

export { computeModelMatrix, computeViewMatrix, computeProjectionMatrix };
