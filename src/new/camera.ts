import { DEFAULT_VIEWPORT } from "./default";
import { CameraViewport, Vector3 } from "./type";

export default class Camera {
  static PERSPECT = 0;
  static ORTHO = 1;

  type: number;
  position: Vector3;
  focus: Vector3;
  up: Vector3;
  viewport: CameraViewport;

  constructor() {
    this.type = Camera.PERSPECT;
    this.position = [0, 0, 0];
    this.focus = [0, 0, 1];
    this.up = [0, 1, 0];
    this.viewport = { ...DEFAULT_VIEWPORT };
  }

  setType(type: number) {
    if (type === Camera.PERSPECT || type === Camera.ORTHO) {
      this.type = type;
    }
    return this;
  }

  setPosition(x: number, y: number, z: number) {
    this.position = [x, y, z];
    return this;
  }

  setFocus(x: number, y: number, z: number) {
    this.focus = [x, y, z];
    return this;
  }

  setUp(x: number, y: number, z: number) {
    this.up = [x, y, z];
    return this;
  }

  setViewport(viewport: CameraViewport) {
    const { near, far, aspect } = { ...DEFAULT_VIEWPORT, ...viewport };
    if (aspect * near * (near - far) === 0)
      throw new Error("Fail to set camera viewport");

    this.viewport = Object.assign(this.viewport, viewport);
    return this;
  }
}
