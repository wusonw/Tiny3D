import { m4 } from "../../module/math";

test("矩阵转置 transpose", () => {
  const r = m4
    .transpose([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    .toString();
  const t = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1].toString();
  expect(r).toBe(t);
});

test("矩阵取逆 inverse", () => {
  const r = m4
    .inverse([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    .toString();
  const t = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1].toString();
  expect(r).toBe(t);
});
