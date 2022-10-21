import { DEFAULT_MODEL_TRANSFORM } from "./default";
import { Color, Mesh, ModelTransformOption, Vector3 } from "./type";

export class Geometry {
  mesh: Mesh;
  color: Color;
  transform: ModelTransformOption;

  constructor() {
    this.mesh = {
      points: [],
      indices: [],
    };
    this.color = [0, 0, 0, 1];
    this.transform = { ...DEFAULT_MODEL_TRANSFORM };
  }

  setMash(mesh: Mesh) {
    this.mesh = mesh;
  }

  setColor(r: number, g: number, b: number, a: number = 1) {
    this.color = [r, g, b, a];
  }

  translate(tx: number = 0, ty: number = 0, tz: number = 0) {
    this.transform.translate = [tx, ty, tz];
  }

  rotate(rx: number = 0, ry: number = 0, rz: number = 0) {
    this.transform.rotate = [rx, ry, rz];
  }

  scale(sx: number = 1, sy: number = 1, sz: number = 1) {
    this.transform.scale = [sx, sy, sz];
  }
}

/* 圆柱体 */
export class Cylinder extends Geometry {
  center: Vector3;
  direction: Vector3;
  radius: number;
  height: number;

  constructor(
    center: Vector3,
    direction: Vector3,
    radius: number,
    height: number
  ) {
    super();
    this.center = center || [0, 0, 0];
    this.direction = direction || [0, 0, 1];
    this.radius = radius || 1;
    this.height = height || 1;
  }
}
