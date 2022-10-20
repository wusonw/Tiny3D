import { mat4 } from "./math";
import { Matrix3D } from "./matrix";
import { createProgram } from "./program";
import {
  createShader,
  FRAMENT_SHADER_SOURCE,
  VERTEX_SHADER_SOURCE,
} from "./shader";

type ModelTransformationMatrixOption = {
  translation?: [number, number, number];
  scale?: [number, number, number];
  rotate?: [number, number, number];
};

type PerspectiveMatrixOption = {
  viewAngle?: number;
  aspect?: number;
  near?: number;
  far?: number;
};

export class Tiny3D {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private geometry: number[];

  constructor(canvasDom: HTMLCanvasElement) {
    const gl = canvasDom.getContext("webgl2");
    if (!gl) throw new Error(`Could not get GL`);

    this.gl = gl;
    this.program = getProgram(gl);
    this.geometry = [];
    // this.setGeometry();
    // this.setMatrix();
    // this.drawScene();
    this.init();
  }

  /* GL配置初始化 */
  private init(gl: WebGL2RenderingContext = this.gl) {
    gl.useProgram(this.program);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
  }

  /* 设置几何坐标 */
  setGeometry(geometry: number[] = []) {
    const gl = this.gl;
    this.geometry = geometry;

    //创建和绑定顶点缓冲区
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(this.program, "a_position");
    //创建和绑定顶点数组对象
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    // this.drawScene();
  }

  /* 设置转换矩阵 */
  setMatrix() {
    const gl = this.gl;
    // 计算矩阵
    const perspectiveMatrix = computePerspectiveMatrix();
    const viewMatrix = computeViewMatrix([0, 0, 0], [0, 0, 0], [0, 1, 0]);
    const modelTransformationMatrix = computeModelTransformationMatrix();
    // const uMatrix = mat4.multiply(
    //   mat4.multiply(perspectiveMatrix, viewMatrix),
    //   modelTransformationMatrix
    // );
    let uMatrix = mat4.multiply(viewMatrix, modelTransformationMatrix);
    uMatrix = mat4.multiply(perspectiveMatrix, uMatrix);
    uMatrix = mat4.multiply(uMatrix, Matrix3D.translation(0, 0, 0));
    // 获取并设置矩阵
    const matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
    gl.uniformMatrix4fv(matrixLocation, false, uMatrix);
    // this.drawScene();
  }

  /* 绘制场景 */
  drawScene() {
    this.gl.drawArrays(
      this.gl.TRIANGLES,
      0,
      Math.floor(this.geometry.length / 3)
    );
  }
}

/* 模型变换矩阵 */
const computeModelTransformationMatrix = (
  options?: ModelTransformationMatrixOption
) => {
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
  let matrix = mat4.identity();
  matrixs.forEach((m) => (matrix = mat4.multiply(matrix, m)));
  return matrix;
};
/* 透视矩阵 */
const computePerspectiveMatrix = (options?: PerspectiveMatrixOption) => {
  const defaultOptions = {
    viewAngle: 80,
    aspect: 1,
    near: 0,
    far: 3,
  };

  const matrixOptions = Object.assign(defaultOptions, options);
  const { viewAngle, aspect, near, far } = matrixOptions;
  return Matrix3D.perspective(viewAngle, aspect, near, far);
};
/* 视图矩阵 */
const computeViewMatrix = (
  cameraPosition: number[],
  targetPosition: number[],
  up: number[]
) => {
  const matrix = Matrix3D.lookAt(cameraPosition, targetPosition, up);
  return mat4.inverse(matrix);
};

const getProgram = (gl: WebGL2RenderingContext) => {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    FRAMENT_SHADER_SOURCE
  );
  return createProgram(gl, vertexShader, fragmentShader);
};
