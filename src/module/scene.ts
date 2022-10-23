import { Camera } from "./camera";
import { Geometry } from "./geometry";
import { WebGLBox } from "./gl";

export default class Sence extends WebGLBox {
  camera: Camera;
  geometrys: Geometry[];
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.camera = new Camera();
    this.geometrys = [];
  }
}
