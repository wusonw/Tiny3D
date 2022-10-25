import {
  CameraType,
  OrthoCameraViewport,
  PerspectiveCameraViewport,
  Point,
  Vector,
} from "./type";

export { createCamera, Camera, PerspectiveCamera, OrthoCamera };

const createCamera = (type?: number) => {
  if (type === CameraType.ORTHO) return new OrthoCamera();
  return new PerspectiveCamera();
};

class Camera {
  position: Point;
  focus: Point;
  up: Vector;

  constructor() {
    this.position = [0, 0, 0];
    this.focus = [0, 0, -1];
    this.up = [0, 1, 0];
  }

  locate(x: number, y: number, z: number) {
    this.position = [x, y, z];
    return this;
  }
  lookAt(x: number, y: number, z: number) {
    this.focus = [x, y, z];
    return this;
  }
  tilt(x: number, y: number, z: number) {
    this.up = [x, y, z];
    return this;
  }
}

class OrthoCamera extends Camera {
  viewport: OrthoCameraViewport;
  constructor() {
    super();
    this.viewport = {
      left: -1,
      right: 1,
      top: 1,
      bottom: -1,
      near: 1,
      far: -1,
    };
  }
  view(viewport: {}) {
    this.viewport = { ...this.viewport, ...viewport };
    return this;
  }
}

class PerspectiveCamera extends Camera {
  viewport: PerspectiveCameraViewport;
  constructor() {
    super();
    this.viewport = {
      field: 75,
      aspect: 1,
      near: 0.01,
      far: 200,
    };
  }
  view(viewport: PerspectiveCameraViewport) {
    this.viewport = { ...this.viewport, ...viewport };
    return this;
  }
}
