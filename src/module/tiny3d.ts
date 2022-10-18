import { createProgram } from "./program";
import {
  createShader,
  FRAMENT_SHADER_SOURCE,
  VERTEX_SHADER_SOURCE,
} from "./shader";

export class Tiny3D {
  private gl: WebGL2RenderingContext;

  constructor(canvas: HTMLCanvasElement) {
    this.gl = canvas.getContext("webgl2") || new WebGL2RenderingContext();
    this.init(this.gl);
  }

  private init(gl: WebGL2RenderingContext) {
    const vertexShader = createShader(
      gl,
      gl.VERTEX_SHADER,
      VERTEX_SHADER_SOURCE
    );
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      FRAMENT_SHADER_SOURCE
    );
    const program = createProgram(gl, vertexShader, fragmentShader);
    const uniforms = getUniformLoc(gl, program);
    const attribs = getAttribLoc(gl, program);

    const positionBuffer = gl.createBuffer();
    const normalBuffer = gl.createBuffer();
    const texcoordBuffer = gl.createBuffer();

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    // 设置所有的缓冲和属性
    const configs = [
      {
        attrib: attribs["a_positionLoc"],
        buffer: positionBuffer,
        numComponents: 3,
      },
      {
        attrib: attribs["a_normalLoc"],
        buffer: normalBuffer,
        numComponents: 3,
      },
      {
        attrib: attribs["a_texcoordLoc"],
        buffer: texcoordBuffer,
        numComponents: 2,
      },
    ];
    setAttribs(gl, configs);

    // 绘制时
    gl.useProgram(program);
    gl.bindVertexArray(vao);
  }
}

const getUniformLoc = (gl: WebGL2RenderingContext, program: WebGLProgram) => {
  const uniformNames = [
    "worldViewProjection",
    "lightWorldPos",
    "world",
    "viewInverse",
    "ambient",
    "diffuse",
    "specular",
    "shininess",
    "specularFactor",
  ];
  const uniformEntries = uniformNames.map((name) => [
    `u_${name}Loc`,
    gl.getUniformLocation(program, `u_${name}`),
  ]);

  return Object.fromEntries(uniformEntries);
};

const getAttribLoc = (gl: WebGL2RenderingContext, program: WebGLProgram) => {
  const attrNames = ["position", "normal", "texcoord"];
  const attribEntries = attrNames.map((name) => [
    `a_${name}Loc`,
    gl.getAttribLocation(program, `a_${name}`),
  ]);

  return Object.fromEntries(attribEntries);
};

const setAttribs = (
  gl: WebGL2RenderingContext,
  configs: { attrib: any; buffer: WebGLBuffer | null; numComponents: number }[]
) => {
  for (const config of configs) {
    if (!config.buffer) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, config.buffer);
    gl.enableVertexAttribArray(config.attrib);
    gl.vertexAttribPointer(
      config.attrib,
      config.numComponents,
      gl.FLOAT,
      false,
      0,
      0
    );
  }
};
