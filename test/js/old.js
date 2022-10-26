// 创建canvas元素并获取上下文
const canvas = document.querySelector("#canvas1");
canvas.width = 500;
canvas.height = 500;
const gl = canvas.getContext("webgl2");
if (!gl) console.error(`WebGL is not available`);

// 定点着色器代码
const VERTEX_SHADER_SOURCE = `#version 300 es
    in vec3 a_position;

    uniform mat4 u_test1;
    uniform mat4 u_test2;
    // uniform mat4 u_test3;

    void main() {
        gl_Position = u_test2 * u_test1  * vec4(a_position,1.0);
    }
    `;

// 片元着色器代码
const FRAGMENT_SHADER_SOURCE = `#version 300 es
    precision highp float;
    out vec4 outColor;
    void main() {
        outColor = vec4(1, 0, 0.5, 1);
    }
    `;

// 根据着色器代码创建Shader着色器
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  try {
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  } catch (err) {
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  FRAGMENT_SHADER_SOURCE
);

//   链接这两个着色器成一个程序(program)
function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  try {
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    return program;
  } catch (err) {
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }
}

const program = createProgram(gl, vertexShader, fragmentShader);
gl.useProgram(program);
/**
 * 通过设置gl_Position, 我们需要告诉WebGL如何从剪辑空间转换值转换到屏幕空间。
 * 为此，我们调用gl.viewport并将其传递给画布的当前大小。
 **/
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0, 0, 0, 0);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
// 在绘制前清除颜色缓冲区以及深度缓冲区
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

const S = (sx, sy, sz) => [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, 0, sz, 0, 0, 0, 1];
const R = (angle) => {
  const c = Math.cos((angle * Math.PI) / 180);
  const s = Math.sin((angle * Math.PI) / 180);
  // return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]; //Rx
  return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]; //Ry
  // return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; //Rz
};
const T = (tx, ty, tz) => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];

const perspectiveMatrix = function (fieldOfView, aspectRatio, near, far) {
  near = near > 0 ? near : 0.01;
  far = far > near ? far : near + 2000;
  const f = 1.0 / Math.tan((fieldOfView * Math.PI) / 180 / 2);
  const rangeInv = 1 / (near - far);

  return [
    f / aspectRatio,
    0,
    0,
    0,
    0,
    f,
    0,
    0,
    0,
    0,
    (near + far) * rangeInv,
    -1,
    0,
    0,
    near * far * rangeInv * 2,
    0,
  ];
};
const cross = (vec1, vec2) => [
  vec1[1] * vec2[2] - vec2[1] * vec1[2],
  vec2[0] * vec1[2] - vec1[0] * vec2[2],
  vec1[0] * vec2[1] - vec2[0] * vec1[1],
];

const subtract = (vec1, vec2) => [
  vec1[0] - vec2[0],
  vec1[1] - vec2[1],
  vec1[2] - vec2[2],
];

const dot = (vec1, vec2) => {
  return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
};

const normalize = (v) => {
  const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  // 确定不会除以 0
  if (length > 0.00001) {
    return [v[0] / length, v[1] / length, v[2] / length];
  } else {
    return [0, 0, 0];
  }
};
/* 计算视图矩阵 */
const viewMatrix = (position, focus, up) => {
  // const _camera = camera || new Camera();
  // const { position, focus, up } = _camera;
  const f = normalize(subtract(position, focus));
  const r = normalize(cross(up, f));
  const u = normalize(cross(f, r));

  return [
    r[0],
    u[0],
    f[0],
    0,
    r[1],
    u[1],
    f[1],
    0,
    r[2],
    u[2],
    f[2],
    0,
    -dot(r, position),
    -dot(u, position),
    -dot(f, position),
    1,
  ];
};

// const mat4_1 = S(1, 0.5, 1);
const mat4_0 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const mat4_2 = R(30);
const mat4_1 = S(1, 0.3, 1);
// const mat4_1 = T(-0.5, 0.5, 0.5);
// const mat4_1 = viewMatrix([0, 0, 5], [0, 0, 0], [1, 1, 0]);
// const mat4_2 = perspectiveMatrix(75, 1, 0.01, 200);
// const mat4_1 = mat4_0;
// const mat4_2 = mat4_0;

const uniformLocation1 = gl.getUniformLocation(program, "u_test1");
const uniformLocation2 = gl.getUniformLocation(program, "u_test2");
// const uniformLocation3 = gl.getUniformLocation(program, "u_test3");
gl.uniformMatrix4fv(uniformLocation1, false, new Float32Array(mat4_1));
gl.uniformMatrix4fv(uniformLocation2, false, new Float32Array(mat4_2));
// gl.uniformMatrix4fv(uniformLocation3, false, new Float32Array(mat4_3));
//首先，我需要创建属性状态集合：顶点数组对象(Vertex Array Object)
const vao = gl.createVertexArray();
//为了使所有属性的设置能够应用到WebGL属性状态集，我们需要绑定这个顶点数组到WebGL
gl.bindVertexArray(vao);

// 在GPU上已经创建了一个GLSL程序后，我们还需要提供数据给它
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
//数据存放到缓存区后，接下来需要告诉属性如何从缓冲区取出数据

// 创建 绑定 缓冲区
const positionBuffer = gl.createBuffer();
const indexBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

// 向缓冲区设置数据
//gl.STATIC_DRAW 告诉WebGL我们不太可能去改变数据的值。
const positions = [0, 0, 0, 1, 0, 0, 0, 1, 0, 0.5, -0.5, 0];
const index = [0, 1, 2, 1, 2, 3];

const size = 3; // 3 components per iteration
const type = gl.FLOAT; // the data is 32bit floats
const normalize1 = false; // don't normalize the data
const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
const off_set = 0; // start at the beginning of the buffer
gl.vertexAttribPointer(
  positionAttributeLocation,
  size,
  type,
  normalize1,
  stride,
  off_set
);

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);
//然后，我们还需要启用属性。如果没有开启这个属性，这个属性值会是一个常量
gl.enableVertexAttribArray(positionAttributeLocation);

gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
// gl.drawArrays(gl.TRIANGLES, 0, 6);
// gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);
// gl.drawArrays(gl.TRIANGLES, 0, 2);

gl.bindVertexArray(vao);
gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
