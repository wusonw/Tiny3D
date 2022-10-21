import { CameraViewport, ModelTransformOption } from "./type";

const DEFAULT_MODEL_TRANSFORM: ModelTransformOption = {
  translate: [0, 0, 0],
  rotate: [0, 0, 0],
  scale: [1, 1, 1],
};

const DEFAULT_VIEWPORT = {
  fov: 75,
  aspect: 1,
  near: 0.1,
  far: 2000,
};

export { DEFAULT_MODEL_TRANSFORM, DEFAULT_VIEWPORT };
