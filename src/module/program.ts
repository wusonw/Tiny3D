// 创建应用程序
export const createProgram = (
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
