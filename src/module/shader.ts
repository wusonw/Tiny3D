// 顶点着色器代码
export const VERTEX_SHADER_SOURCE = `#version 300 es

  in vec4 a_position;
  in vec3 a_normal;
  
  uniform mat4 u_matrix;

  out vec3 v_normal;
 
  void main() {
    gl_Position = u_matrix * a_position;
    v_normal = a_normal;
  }
  `;

// 片元着色器代码
export const FRAMENT_SHADER_SOURCE = `#version 300 es 

  precision highp float;

  in vec3 v_normal;

  uniform vec3 u_lightDirection;

  out vec4 outColor;

  void main() {
    vec3 normal = normalize(v_normal);
    float light = dot(normal, u_lightDirection);

    outColor = vec4(1, 0, 0.2, 1);
    outColor.rgb *= light;
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
