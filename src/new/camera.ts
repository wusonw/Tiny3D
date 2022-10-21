import { CameraOption, CameraViewport, Vector3 } from "./type";
export const DEFAULT_VIEWPORT = { fov: 75, aspect: 1, near: 0.1, far: 2000 };

export default class Camera {
  static PERSPECT = 0;
  static ORTHO = 1;

  type: number;
  position: Vector3;
  focus: Vector3;
  up: Vector3;
  viewport: CameraViewport;

  constructor(option?: CameraOption) {
    this.type = option?.type || Camera.PERSPECT;
    this.position = option?.position || [0, 0, 0];
    this.focus = option?.focus || [0, 0, -1];
    this.up = option?.up || [0, 1, 0];
    this.viewport = Object.assign(DEFAULT_VIEWPORT, option?.viewport);
  }

  setType(type: number) {
    if (type === Camera.PERSPECT || type === Camera.ORTHO) {
      this.type = type;
    }
  }

  setPosition(x: number, y: number, z: number) {
    this.position = [x, y, z];
  }

  setFocus(x: number, y: number, z: number) {
    this.focus = [x, y, z];
  }

  setUp(x: number, y: number, z: number) {
    this.up = [x, y, z];
  }

  setViewport(viewport: CameraViewport) {
    const { near, far, aspect } = { ...DEFAULT_VIEWPORT, ...viewport };
    if (aspect * near * (near - far) === 0) return;

    this.viewport = Object.assign(this.viewport, viewport);
  }
}
