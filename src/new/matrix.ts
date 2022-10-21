import { Geometry } from "./geometry";
import { DEFAULT_VIEWPORT } from "./default";
import Camera from "./camera";
import { Matrix4, Vector3 } from "./type";

const { atan, sin, cos, PI } = Math;

const computeMatrixs = (geo: Geometry, camera: Camera) => {
  const [T, Rx, Ry, Rz, S] = computeModelMatrixs(geo);
  const view = computeViewMatrix(camera);
  const projection = computeProjectionMatrix(camera);

  return {
    u_model_T: T,
    u_model_Rx: Rx,
    u_model_Ry: Ry,
    u_model_Rz: Rz,
    u_model_S: S,
    u_view: view,
    u_projection: projection,
  };
};

/* 计算模型矩阵 */
// TODO: 这里可能有问题
const computeModelMatrixs = (geo: Geometry): Matrix4[] => {
  const _transform = geo.transform;
  const [tx, ty, tz] = _transform.translate as Vector3;
  const [rx, ry, rz] = _transform.rotate as Vector3;
  const [sx, sy, sz] = _transform.translate as Vector3;
  const [radRx, radRy, radRz] = [dToRad(rx), dToRad(ry), dToRad(rz)];
  const [cosx, sinx] = [cos(radRx), sin(radRx)];
  const [cosy, siny] = [cos(radRy), sin(radRy)];
  const [cosz, sinz] = [cos(radRz), sin(radRz)];

  const Rx = [1, 0, 0, 0, 0, cosx, -sinx, 0, 0, sinx, cosx, 0, 0, 0, 0, 1];
  const Ry = [cosy, 0, siny, 0, 0, 1, 0, 0, -siny, 0, cosy, 0, 0, 0, 0, 1];
  const Rz = [cosz, 0, sinz, 0, 0, 1, 0, 0, -sinz, 0, cosz, 0, 0, 0, 0, 1];

  const T = [1, 0, 0, tx, 0, 1, 0, ty, 0, 0, 1, tz, 0, 0, 0, 1];
  const S = [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];

  return [Rx, Ry, Rz, T, S] as Matrix4[];
};
/* 计算视图矩阵 */
const computeViewMatrix = (camera: Camera): Matrix4 => {
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
const computeProjectionMatrix = (camera: Camera): Matrix4 => {
  const _camera = camera || new Camera();
  const { fov, aspect, near, far } = {
    ...DEFAULT_VIEWPORT,
    ..._camera.viewport,
  };

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
  }
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

const dToRad = (degree: number) => (PI * degree) / 180;

export {
  computeModelMatrixs,
  computeViewMatrix,
  computeProjectionMatrix,
  computeMatrixs,
};
