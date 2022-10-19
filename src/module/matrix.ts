const { cos, sin, PI } = Math;

/* 针对视图操作的矩阵 */
export const Matrix3D = {
  /* 平移 */
  translation: function (tx: number, ty: number, tz: number) {
    return [1, 0, 0, tx, 0, 1, 0, ty, 0, 0, 1, tz, 0, 0, 0, 1];
  },
  /* 旋转 */
  xRotation: function (angle: number) {
    const c = cos((angle * PI) / 180);
    const s = sin((angle * PI) / 180);
    return [1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1];
  },
  yRotation: function (angle: number) {
    const c = cos((angle * PI) / 180);
    const s = sin((angle * PI) / 180);
    return [c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1];
  },
  zRotation: function (angle: number) {
    const c = cos((angle * PI) / 180);
    const s = sin((angle * PI) / 180);
    return [c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  },
  /* 缩放 */
  scale: function (sx: number, sy: number, sz: number) {
    return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
  },
  /* 像素转换 */
  projection: function (width: number, height: number, depth: number) {
    return [
      2 / width,
      0,
      0,
      -1,
      0,
      -2 / height,
      0,
      1,
      0,
      0,
      2 / depth,
      0,
      0,
      0,
      0,
      1,
    ];
  },
};
