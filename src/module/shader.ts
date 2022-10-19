// 定点着色器代码
export const VERTEX_SHADER_SOURCE = `#version 300 es

  in vec4 a_position;
//   in vec4 a_color;
  
  uniform mat4 u_matrix;
 
  void main() {
    gl_Position = u_matrix * a_position;
//     v_color = a_color;
  }
  `;

// 片元着色器代码
export const FRAMENT_SHADER_SOURCE = `#version 300 es 

  precision highp float;

//   in vec4 v_color;

//   out vec4 outColor;

  void main() {
//     outColor = v_color;
  }
  `;

// 根据着色器代码创建Shader着色器
export const createShader = (
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
