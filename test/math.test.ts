import { mat4, vec3 } from "../src/module/math";

test("矩阵转置 transpose", () => {
  const r = mat4
    .transpose([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    .toString();
  const t = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1].toString();
  expect(r).toBe(t);
});

test("矩阵取逆 inverse", () => {
  const r = mat4
    .inverse([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    .toString();
  const t = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1].toString();
  expect(r).toBe(t);
});

test("向量归一化 normalize", () => {
  const r = vec3.normalize([1, 1, 1]);
  const t = 1 / Math.sqrt(3);
  expect(r[1]).toBe(t);
});

test("向量叉乘 cross", () => {
  const r1 = vec3.cross([1, 0, 0], [0, 1, 0]).toString();
  const t1 = [0, 0, 1].toString();
  expect(r1).toBe(t1);

  const r2 = vec3.cross([0, 1, 0], [0, 0, 1]).toString();
  const t2 = [1, 0, 0].toString();
  expect(r2).toBe(t2);
});
