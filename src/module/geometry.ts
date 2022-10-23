import { GeometryTransform, Point, Vector } from "./type";

export class Geometry {
  mesh: number[];
  transform: GeometryTransform;
  constructor() {
    this.mesh = [];
    this.transform = {
      translate: [0, 0, 0],
      rotate: [0, 0, 0],
      scale: [1, 1, 1],
    };
  }

  setMesh(mesh: number[]) {
    this.mesh = [...mesh];
    return this;
  }
}

/* 圆柱体 */
export class Cylinder extends Geometry {
  center: Point;
  direction: Vector;
  radius: number;
  height: number;

  constructor(
    center: Point,
    direction: Vector,
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
