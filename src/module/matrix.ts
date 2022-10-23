import { Camera, OrthoCamera, PerspectiveCamera } from "./camera";
import { Geometry } from "./geometry";
import { OrthoCameraViewport, PerspectiveCameraViewport, Vector } from "./type";
const { tan, sin, cos, PI } = Math;

export { computeModelMatrix, computeViewMatrix, computeProjectionMatrix };

/* 计算模型视图矩阵 */
const computeModelMatrix = (geometry: Geometry) => {
  const { translate, rotate, scale } = geometry.transform;
  return {
    T: T(translate[0], translate[1], translate[2]),
    Rx: Rx(rotate[0]),
    Ry: Ry(rotate[1]),
    Rz: Rz(rotate[2]),
    S: S(scale[0], scale[1], scale[2]),
  };
};

/* 计算视图矩阵 */
const computeViewMatrix = (camera: Camera) => {
  const { position, focus, up } = camera;
  const f = normalize(subtract(position, focus));
  const r = normalize(cross(up, f));
  const u = normalize(cross(f, r));

  return [
    r[0],
    u[0],
    f[0],
    0,
    r[1],
    u[1],
    f[1],
    0,
    r[2],
    u[2],
    f[2],
    0,
    -dot(r, position),
    -dot(u, position),
    -dot(f, position),
    1,
  ];
};

/* 计算投影矩阵 */
const computeProjectionMatrix = (camera: Camera) => {
  if (camera instanceof PerspectiveCamera) {
    return perspectiveMatrix(camera.viewport);
  } else if (camera instanceof OrthoCamera) {
    return orthoMatrix(camera.viewport);
  } else {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }
};

const perspectiveMatrix = (viewport: PerspectiveCameraViewport) => {
  const { field, aspect, near, far } = viewport;
  const fov = 1 / tan((field * PI) / 180 / 2);
  const rangeInv = 1 / (near - far);
  return [
    fov / aspect,
    0,
    0,
    0,
    0,
    fov,
    0,
    0,
    0,
    0,
    (near + far) * rangeInv,
    -1,
    0,
    0,
    near * far * rangeInv * 2,
    0,
  ];
};
const orthoMatrix = (viewport: OrthoCameraViewport) => {
  const { left, right, top, bottom, near, far } = viewport;
  const rl = 1 / (right - left);
  const tb = 1 / (top - bottom);
  const fn = 1 / (far - near);
  return [
    2 * rl,
    0,
    0,
    0,
    0,
    2 * tb,
    0,
    0,
    0,
    0,
    2 * fn,
    0,
    -(left + right) * rl,
    -(top + bottom) * tb,
    -(far + near) * fn,
    1,
  ];
};

const T = (tx: number, ty: number, tz: number) => [
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  tx,
  ty,
  tz,
  1,
];
const Rx = (angle: number) => {
  const s = sin(dToRad(angle));
  const c = cos(dToRad(angle));
  return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]; //Rx
};
const Ry = (angle: number) => {
  const s = sin(dToRad(angle));
  const c = cos(dToRad(angle));
  return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]; //Ry
};
const Rz = (angle: number) => {
  const s = sin(dToRad(angle));
  const c = cos(dToRad(angle));
  return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; //Rz
};
const S = (sx: number, sy: number, sz: number) => [
  sx,
  0,
  0,
  0,
  0,
  sy,
  0,
  0,
  0,
  0,
  0,
  sz,
  0,
  0,
  0,
  1,
];

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
