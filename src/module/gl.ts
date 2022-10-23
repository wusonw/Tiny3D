import { Camera } from "./camera";
import { Geometry } from "./geometry";
import {
  computeModelMatrix,
  computeProjectionMatrix,
  computeViewMatrix,
} from "./matrix";

export class WebGLBox {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  program: WebGLProgram;

  constructor(canvas: HTMLCanvasElement, width?: number, height?: number) {
    this.canvas = canvas;
    this.canvas.width = width || this.canvas.width;
    this.canvas.height = height || this.canvas.height;
    const gl = this.canvas.getContext("webgl2");
    if (!gl) {
      throw new Error(`Could not get webgl context`);
    }
    this.gl = gl;
    this.program = createProgram(
      gl,
      VERTEX_SHADER_SOURCE,
      FRAMENT_SHADER_SOURCE
    );
    gl.useProgram(this.program);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
  }

  // TODO: 后续重构此部分代码
  draw(geometrys: Geometry[], camera: Camera) {
    geometrys.forEach((geo) => {
      const { T, Rx, Ry, Rz, S } = computeModelMatrix(geo);
      const view = computeViewMatrix(camera);
      const projection = computeProjectionMatrix(camera);
      //   const { attribLocations, uniformLocations } = getProgramLocations(
      //     this.gl,
      //     this.program
      //   );

      const uT = this.gl.getUniformLocation(this.program, "u_T");
      const uRx = this.gl.getUniformLocation(this.program, "u_Rx");
      const uRy = this.gl.getUniformLocation(this.program, "u_Ry");
      const uRz = this.gl.getUniformLocation(this.program, "u_Rz");
      const uS = this.gl.getUniformLocation(this.program, "u_S");
      const uView = this.gl.getUniformLocation(this.program, "u_view");
      const uProjection = this.gl.getUniformLocation(
        this.program,
        "u_projection"
      );
      this.gl.uniformMatrix4fv(uT, false, new Float32Array(T));
      this.gl.uniformMatrix4fv(uRx, false, new Float32Array(Rx));
      this.gl.uniformMatrix4fv(uRy, false, new Float32Array(Ry));
      this.gl.uniformMatrix4fv(uRz, false, new Float32Array(Rz));
      this.gl.uniformMatrix4fv(uS, false, new Float32Array(S));
      this.gl.uniformMatrix4fv(uView, false, new Float32Array(view));
      this.gl.uniformMatrix4fv(
        uProjection,
        false,
        new Float32Array(projection)
      );

      const aPosition = this.gl.getAttribLocation(this.program, "a_position");
      const positionBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
      this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        new Float32Array(geo.mesh),
        this.gl.STATIC_DRAW
      );
      this.gl.vertexAttribPointer(aPosition, 3, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(aPosition);

      this.gl.drawArrays(this.gl.TRIANGLES, 0, Math.floor(geo.mesh.length / 3));
    });
  }
}

// const getProgramLocations = (
//   gl: WebGL2RenderingContext,
//   program: WebGLProgram
// ) => {
//   const getLocationNames = (reg: RegExp) => [
//     ...new Set(VERTEX_SHADER_SOURCE.match(reg) || []),
//   ];

//   const getLocations = (names: string[]) => {
//     const entries = names.map((name) => {
//       const location =
//         name[0] === "a"
//           ? gl.getAttribLocation(program, name)
//           : gl.getUniformLocation(program, name);
//       return [`${name.slice(2)}`, location];
//     });
//     return Object.fromEntries(entries);
//   };

//   const attribNames = getLocationNames(new RegExp(/a_[a-zA-Z]+/g));
//   const uniformNames = getLocationNames(new RegExp(/u_[a-zA-Z]+/g));

//   return {
//     attribLocations: getLocations(attribNames),
//     uniformLocations: getLocations(uniformNames),
//   };
// };

// 创建应用程序
const createProgram = (
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string
) => {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();

  if (program) {
    // 附上着色器
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    // 链接到程序
    gl.linkProgram(program);

    // 检查链接是否成功
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
      const err =
        gl.getProgramInfoLog(program) || `Could not create webgl program`;
      throw new Error(err);
    }

    return program;
  }
  throw new Error(`Could not create webgl program`);
};

// 根据着色器代码创建Shader着色器
const createShader = (
  gl: WebGL2RenderingContext,
  type: number,
  source: string
) => {
  const shader = gl.createShader(type);
  if (shader) {
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // 检测编译是否成功
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
      const err =
        gl.getShaderInfoLog(shader) || `Could not create webgl shader`;
      throw new Error(err);
    }

    return shader;
  }
  throw new Error(`Could not create webgl shader`);
};

// 顶点着色器代码
const VERTEX_SHADER_SOURCE = `#version 300 es

  in vec3 a_position;

  uniform mat4 u_T;
  uniform mat4 u_Rz;
  uniform mat4 u_Ry;
  uniform mat4 u_Rx;
  uniform mat4 u_S;
  uniform mat4 u_view;
  uniform mat4 u_projection;

  void main(void) {
    mat4 modelMatrix = u_T * u_Rz * u_Ry * u_Rx * u_S;
    gl_Position = u_projection * u_view * modelMatrix * vec4(a_position, 1.0);
  }
  `;

// 片元着色器代码
const FRAMENT_SHADER_SOURCE = `#version 300 es 

  precision highp float;

  out vec4 outColor;

  void main(void) {
    outColor = vec4(1,0,0,1);
  }
  `;
