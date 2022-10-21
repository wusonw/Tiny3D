import { Matrix4, Mesh } from "./type";

// 顶点着色器代码
const VERTEX_SHADER_SOURCE = `#version 300 es

  in vec3 a_position;
  // in vec4 a_color;

  uniform mat4 u_model_T;
  uniform mat4 u_model_Rx;
  uniform mat4 u_model_Ry;
  uniform mat4 u_model_Rz;
  uniform mat4 u_model_S;
  uniform mat4 u_view;
  uniform mat4 u_projection;  

  // out vec4 v_color;
 
  void main() {
    mat4 u_model = u_model_T * u_model_Rx * u_model_Ry * u_model_Rz * u_model_S;
    mat4 u_clip = u_projection * u_view * u_model; 
    gl_Position = u_clip * vec4(a_position,1.0);
    // v_color = a_color;
  }
  `;

// 片元着色器代码
const FRAMENT_SHADER_SOURCE = `#version 300 es 

  precision highp float;

  // in vec4 v_color

  out vec4 outColor;

  void main() {
    // outColor = v_color;
    outColor = vec4(1,0,0,1);
  }
  `;

// 根据着色器代码创建Shader着色器
const createShader = (
  gl: WebGL2RenderingContext,
  type: number,
  source: string
): WebGLShader => {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error(`Could not create shader`);
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // 检测编译是否成功
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    const errMsg = gl.getShaderInfoLog(shader);
    throw new Error(`could not compile shader: + ${errMsg}`);
  }

  return shader;
};

// 创建应用程序
const createProgram = (
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram => {
  const program = gl.createProgram();
  if (!program) {
    throw new Error(`Could not create program`);
  }

  // 附上着色器
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  // 链接到程序
  gl.linkProgram(program);

  // 检查链接是否成功
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    const errMsg = gl.getProgramInfoLog(program);
    throw new Error(`program failed to link: ${errMsg}`);
  }

  return program;
};

// 设置所有的全局矩阵变量
const setMatrix = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  matrixs: Array<[string, Matrix4]>
) => {
  matrixs.forEach(([name, mat4]) => {
    const uMatrixLocation = gl.getUniformLocation(program, name);
    gl.uniformMatrix4fv(uMatrixLocation, false, new Float32Array(mat4));
  });
};

const setPosition = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  vaoMap: WeakMap<Mesh, WebGLVertexArrayObject | null>,
  mesh: Mesh
) => {
  const positionLocation = gl.getAttribLocation(program, "a_position");
  const hasVao = vaoMap.has(mesh);
  const positionBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();

  if (!hasVao) {
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    vaoMap.set(mesh, vao);
  } else {
    const vao = vaoMap.get(mesh) as WebGLVertexArrayObject | null;
    gl.bindVertexArray(vao);
  }

  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.points), gl.STATIC_DRAW);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint8Array(mesh.indices),
    gl.STATIC_DRAW
  );
};

const drawSence = (gl: WebGL2RenderingContext, vao: any) => {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  gl.bindVertexArray(vao);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

export {
  VERTEX_SHADER_SOURCE,
  FRAMENT_SHADER_SOURCE,
  createShader,
  createProgram,
  setMatrix,
  setPosition,
  drawSence,
};
