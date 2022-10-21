/* 矩阵创建 */
const create = () => new Array(16).fill(0);

/* 矩阵取反 */
const negate = (m: number[]) => m.map((v) => -v);

/* 矩阵复制 */
const copy = () => (m: number[]) => m.map((v) => v);

/* 单位矩阵 */
const identity = () => create().map((_, index) => Number(index % 5 === 0));

/* 矩阵转置 */
const transpose = (m: number[]) => {
  [m[1], m[4]] = [m[4], m[1]];
  [m[2], m[8]] = [m[8], m[2]];
  [m[3], m[12]] = [m[12], m[3]];
  [m[6], m[9]] = [m[9], m[6]];
  [m[7], m[13]] = [m[13], m[7]];
  [m[11], m[14]] = [m[14], m[11]];
  return m;
};

/* 矩阵求逆 */
const inverse = (m: number[]) => {
  const DetA = detVal4(m);
  return m.map((v, i) => {
    const sign = (-1) ** (Math.floor(i / 4) + (i % 4));
    const pDet = partDetVal(m, i);
    return (sign * pDet) / DetA;
  });
};

/* 矩阵点乘 */
const multiply = (m1: number[], m2: number[]) => {
  const m = create();

  const getV1 = (a: number[], b: number[]) =>
    a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];

  m2 = transpose(m2);
  m.forEach((_, index) => {
    const i = Math.floor(index / 4);
    const j = index % 4;
    const a = m1.slice(i * 4, i * 4 + 4);
    const b = m2.slice(j * 4, j * 4 + 4);
    m[index] = getV1(a, b);
  });
  return m;
};

/* 四阶行列式值 */
const detVal4 = (m4: number[]) => {
  let result = 0;
  [0, 1, 2, 3].forEach((v) => {
    result += m4[v] * partDetVal(m4, v);
  });

  return result;
};

//三阶行列式求值
const detVal3 = (m3: number[]) => {
  return (
    m3[0] * m3[4] * m3[8] +
    m3[1] * m3[5] * m3[6] +
    m3[2] * m3[3] * m3[7] -
    m3[2] * m3[4] * m3[6] -
    m3[1] * m3[3] * m3[8] -
    m3[0] * m3[5] * m3[7]
  );
};

/* 代数余子式矩阵值 */
const partDetVal = (m4: number[], index: number) => {
  const A = m4.filter(
    (_, i) => Math.floor(i / 4) !== Math.floor(index / 4) && i % 4 !== index % 4
  );
  return detVal3(A);
};
/* 一维向量叉乘 */
const cross = (vec1: number[], vec2: number[]) => [
  vec1[1] * vec2[2] - vec2[1] * vec1[2],
  vec2[0] * vec1[2] - vec1[0] * vec2[2],
  vec1[0] * vec2[1] - vec2[0] * vec1[1],
];

const subtract = (vec1: number[], vec2: number[]) => [
  vec1[0] - vec2[0],
  vec1[1] - vec2[1],
  vec1[2] - vec2[2],
];

const normalize = (v: number[]) => {
  const length = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
  // 确定不会除以 0
  if (length > 0.00001) {
    return [v[0] / length, v[1] / length, v[2] / length];
  } else {
    return [0, 0, 0];
  }
};

/* 导出为矩阵计算库 */
export const mat4 = {
  create,
  negate,
  copy,
  identity,
  transpose,
  inverse,
  multiply,
};

export const vec3 = {
  cross,
  subtract,
  normalize,
};
