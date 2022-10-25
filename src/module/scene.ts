import { Camera } from "./camera";
import { Geometry } from "./geometry";
import { WebGLBox } from "./gl";

export default class Scene extends WebGLBox {
  camera: Camera;
  geometries: Geometry[];
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.camera = new Camera();
    this.geometries = [];
  }
}
