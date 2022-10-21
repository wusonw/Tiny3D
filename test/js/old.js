// 创建canvas元素并获取上下文
const canvas = document.querySelector("#canvas");
const gl = canvas.getContext("webgl2");
if (!gl) console.error(`WebGL is not aviable`);

// 定点着色器代码
const VERTEX_SHADER_SOURCE = `#version 300 es
    in vec4 a_position;
    void main() {
        gl_Position = a_position;
    }
    `;

// 片元着色器代码
const FRAMENT_SHADER_SOURCE = `#version 300 es
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
  FRAMENT_SHADER_SOURCE
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

// 在GPU上已经创建了一个GLSL程序后，我们还需要提供数据给它
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

// 创建 绑定 缓冲区
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// 向缓冲区设置数据
//gl.STATIC_DRAW 告诉WebGL我们不太可能去改变数据的值。
const positions = [0, 0, 0, 0.5, 0.7, 0, 0, -1, 0];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

//数据存放到缓存区后，接下来需要告诉属性如何从缓冲区取出数据
//首先，我需要创建属性状态集合：顶点数组对象(Vertex Array Object)
const vao = gl.createVertexArray();
//为了使所有属性的设置能够应用到WebGL属性状态集，我们需要绑定这个顶点数组到WebGL
gl.bindVertexArray(vao);
//然后，我们还需要启用属性。如果没有开启这个属性，这个属性值会是一个常量
gl.enableVertexAttribArray(positionAttributeLocation);

const size = 3; // 2 components per iteration
const type = gl.FLOAT; // the data is 32bit floats
const normalize = false; // don't normalize the data
const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
const off_set = 0; // start at the beginning of the buffer
gl.vertexAttribPointer(
  positionAttributeLocation,
  size,
  type,
  normalize,
  stride,
  off_set
);

/**
 * 通过设置gl_Position, 我们需要告诉WebGL如何从剪辑空间转换值转换到屏幕空间。
 * 为此，我们调用gl.viewport并将其传递给画布的当前大小。
 **/
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
//接下来我们需要告诉WebGL运行着色器程序
gl.useProgram(program);
//   // 然后我们需要告诉它用哪个缓冲区和如何从缓冲区取出数据给到属性
//   gl.bindVertexArray(vao);

gl.drawArrays(gl.TRIANGLES, 0, 3);
