import { Geometry } from "./geometry";
import Camera from "./camera";
import {
  createProgram,
  createShader,
  drawSence,
  FRAMENT_SHADER_SOURCE,
  setMatrix,
  setPosition,
  VERTEX_SHADER_SOURCE,
} from "./helper";
import { Mesh } from "./type";
import { computeMatrixs } from "./matrix";

export default class Tiny3D {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  camera: Camera;
  geometrys: Geometry[];
  vaoMap: WeakMap<Mesh, WebGLVertexArrayObject | null>;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.program = getProgram(gl);
    this.gl.useProgram(this.program);
    this.camera = new Camera();
    this.geometrys = [];
    this.vaoMap = new WeakMap();
  }

  useCamera(camera: Camera) {
    this.camera = camera;
    return this;
  }

  addGeometry(geo: Geometry) {
    this.geometrys.push(geo);
    return this;
  }

  draw() {
    this.geometrys.forEach((geo) => {
      setPosition(this.gl, this.program, this.vaoMap, geo.mesh);
      const matrixs = Object.entries(computeMatrixs(geo, this.camera));
      setMatrix(this.gl, this.program, matrixs);
      drawSence(this.gl, this.vaoMap.get(geo.mesh));
    });
  }

  animate(cb: Function) {
    requestAnimationFrame(() => {
      cb();
      this.draw();
    });
  }
}

const getProgram = (gl: WebGL2RenderingContext) => {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    FRAMENT_SHADER_SOURCE
  );
  return createProgram(gl, vertexShader, fragmentShader);
};
