import { m4 } from "./math";
import { Matrix3D } from "./matrix";
import { createProgram } from "./program";
import {
  createShader,
  FRAMENT_SHADER_SOURCE,
  VERTEX_SHADER_SOURCE,
} from "./shader";

type ComputeMatrixOption = {
  translation?: [number, number, number];
  scale?: [number, number, number];
  rotate?: [number, number, number];
};

export class Tiny3D {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private pointsData: number[];

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2");
    if (!gl) throw new Error(`Could not get GL`);

    this.gl = gl;
    this.program = getProgram(gl);
    this.pointsData = [];
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    this.setGeometry([]);
    this.setMatrix();
    this.drawScene();
  }

  setGeometry(data: number[]) {
    const gl = this.gl;
    this.pointsData = data;
    const positionLocation = gl.getAttribLocation(this.program, "a_position");
    const positionBuffer = gl.createBuffer();
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    this.drawScene();
  }

  setMatrix(options?: ComputeMatrixOption) {
    const gl = this.gl;
    let matrix = Matrix3D.projection(gl.canvas.width, gl.canvas.height, 400);
    matrix = m4.multiply(matrix, computeMatrix(options));

    const matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
    gl.uniformMatrix4fv(matrixLocation, false, matrix);
    this.drawScene();
  }

  drawScene() {
    const gl = this.gl;
    const program = this.program;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    gl.useProgram(program);

    gl.drawArrays(gl.TRIANGLES, 0, this.pointsData.length / 3);
  }
}

const computeMatrix = (options?: ComputeMatrixOption) => {
  const defaultOptions = {
    translation: [0, 0, 0],
    scale: [1, 1, 1],
    rotate: [0, 0, 0],
  };

  const matrixOptions = Object.assign(defaultOptions, options);
  const { translation, scale, rotate } = matrixOptions;
  const matrixs = [
    Matrix3D.translation(translation[0], translation[1], translation[2]),
    Matrix3D.scale(scale[0], scale[1], scale[2]),
    Matrix3D.xRotation(rotate[0]),
    Matrix3D.yRotation(rotate[1]),
    Matrix3D.zRotation(rotate[2]),
  ];
  let matrix = m4.identity();
  matrixs.forEach((m) => (matrix = m4.multiply(matrix, m)));
  return matrix;
};

const getProgram = (gl: WebGL2RenderingContext) => {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    FRAMENT_SHADER_SOURCE
  );
  const program = createProgram(gl, vertexShader, fragmentShader);
  return program;
};
