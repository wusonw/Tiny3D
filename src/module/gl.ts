import { Camera } from "./camera";
import { Geometry } from "./geometry";
import { normalize } from "./math";
import {
  computeModelMatrix,
  computeProjectionMatrix,
  computeViewMatrix,
} from "./matrix";
import { Mesh } from "./type";

export class WebGLBox {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  vaoMap: WeakMap<Mesh, WebGLVertexArrayObject>;

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
      FRAGMENT_SHADER_SOURCE
    );
    this.vaoMap = new WeakMap();
    gl.useProgram(this.program);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
  }

  setTransform = (geo: Geometry, camera: Camera) => {
    const modelMatrix = computeModelMatrix(geo);
    const viewMatrix = computeViewMatrix(camera);
    const projectionMatrix = computeProjectionMatrix(camera);
    const matrixEntries = Object.entries(
      Object.assign(modelMatrix, {
        m_view: viewMatrix,
        m_projection: projectionMatrix,
      })
    );
    matrixEntries.forEach(([name, matrix]) => {
      const location = this.gl.getUniformLocation(this.program, name);
      this.gl.uniformMatrix4fv(location, false, new Float32Array(matrix));
    });
  };

  setPosition(geo: Geometry) {
    // TODO: need connect vaoMap
    const vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(vao);

    const positionLocation = this.gl.getAttribLocation(
      this.program,
      "a_position"
    );
    const vertexBuffer = this.gl.createBuffer();
    const facesBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, facesBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(geo.mesh.vertex),
      this.gl.STATIC_DRAW
    );
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(geo.mesh.faces),
      this.gl.STATIC_DRAW
    );
    this.gl.vertexAttribPointer(
      positionLocation,
      3,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(positionLocation);
  }

  setLight() {
    const lightColorLocation = this.gl.getUniformLocation(
      this.program,
      "l_color"
    );
    const lightDirectionLocation = this.gl.getUniformLocation(
      this.program,
      "l_direction"
    );

    this.gl.uniform3f(lightColorLocation, 0.8, 0.8, 0.0);
    this.gl.uniform3fv(
      lightDirectionLocation,
      new Float32Array(normalize([0.5, 3, 4]))
    );
  }

  setNormals() {
    const normalLocation = this.gl.getAttribLocation(this.program, "a_normal");
    const normals = [
      [0, 0, 1],
      [1, 0, 0],
      [-1, 0, 0],
      [0, 0, -1],
      [0, -1, 0],
      [0, 1, 0],
    ];
    const normalData: number[] = [];
    normals
      .map((n) => [...n, ...n, ...n, ...n, ...n, ...n])
      .forEach((v) => normalData.push(...v));
    const normalBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
    this.gl.enableVertexAttribArray(normalLocation);
    this.gl.vertexAttribPointer(normalLocation, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(normalData),
      this.gl.STATIC_DRAW
    );
  }

  draw(geometries: Geometry[], camera: Camera) {
    geometries.forEach((geo) => {
      this.setTransform(geo, camera);
      this.setPosition(geo);
      this.setLight();
      this.setNormals();

      this.gl.drawElements(
        this.gl.TRIANGLES,
        geo.mesh.faces.length,
        this.gl.UNSIGNED_SHORT,
        0
      );
    });
  }
}

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
  // in vec4 a_color;
  in vec3 a_normal;

  uniform vec3 l_color;
  uniform vec3 l_direction;

  uniform mat4 m_T;
  uniform mat4 m_Rz;
  uniform mat4 m_Ry;
  uniform mat4 m_Rx;
  uniform mat4 m_S;
  uniform mat4 m_view;
  uniform mat4 m_projection;

  out vec4 v_color;

  void main(void) {
    mat4 modelMatrix = m_T * m_Rz * m_Ry * m_Rx * m_S;
    gl_Position = m_projection * m_view * modelMatrix * vec4(a_position, 1.0);

    vec4 a_color = vec4(1.0,0,0,1);
    vec3 normal = normalize(a_normal);
    highp float dotResult = max(dot(l_direction,normal),0.0);
    vec3 diffuse = l_color * a_color.rgb * dotResult;
    v_color = vec4(diffuse,a_color.a);
  }
  `;

// 片元着色器代码
const FRAGMENT_SHADER_SOURCE = `#version 300 es 

  precision highp float;

  in vec4 v_color;
  out vec4 outColor;
  
  void main(void) {
    outColor = v_color;
  }
  `;
