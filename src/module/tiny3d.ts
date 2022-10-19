import {m4} from "./math";
import {Matrix3D} from "./matrix";
import {createProgram} from "./program";
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

    constructor() {
        this.gl = new WebGL2RenderingContext();
        this.program = new WebGLProgram();
        this.geometry = [];
    }

    init(canvas: HTMLCanvasElement) {
        //获取gl对象
        const gl = canvas.getContext("webgl2");
        if (!gl) throw new Error(`Could not get GL`);
        this.gl = gl;
        //获取程序对象
        this.program = getProgram(gl);

        this.setGeometry();
        this.setMatrix();
        this.drawScene();
    }

    /* 设置几何坐标 */
    setGeometry(geometry: number[] = []) {
        const gl = this.gl;
        this.geometry = geometry;

        //创建和绑定顶点数组对象
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        //创建和绑定顶点缓冲区
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        const positionLocation = gl.getAttribLocation(this.program, "a_position");
        gl.enableVertexAttribArray(positionLocation);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry), gl.STATIC_DRAW);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
        this.drawScene();
    }

    /* 设置转换矩阵 */
    setMatrix() {
        const gl = this.gl;
        // 计算矩阵
        const perspectiveMatrix = computePerspectiveMatrix()
        const viewMatrix = computeViewMatrix([0, 0, 0], [100, 0, 0])
        const modelTransformationMatrix = computeModelTransformationMatrix()
        const uMatrix = m4.multiply(m4.multiply(perspectiveMatrix, viewMatrix), modelTransformationMatrix)
        // 获取并设置矩阵
        const matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
        gl.uniformMatrix4fv(matrixLocation, false, uMatrix);
        this.drawScene();
    }

//   /* 设置表面法向量，用于光照 */
//   setNormals(normal: number[]) {
//     const gl = this.gl;
//
//     //创建和绑定顶点缓冲区
//     const normalBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
//
//     const normalLocation = gl.getAttribLocation(this.program, "a_position");
//     gl.enableVertexAttribArray(normalLocation);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
//     gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
//     this.drawScene();
//   }
    /* 绘制场景 */
    drawScene() {
        const gl = this.gl;
        const program = this.program;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        gl.useProgram(program);

        gl.drawArrays(gl.TRIANGLES, 0, this.geometry.length / 3);
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
    const {translation, scale, rotate} = matrixOptions;
    const matrixs = [
        Matrix3D.translation(translation[0], translation[1], translation[2]),
        Matrix3D.scale(scale[0], scale[1], scale[2]),
        Matrix3D.xRotation(rotate[0]),
        Matrix3D.yRotation(rotate[1]),
        Matrix3D.zRotation(rotate[2]),
    ];
    let matrix = m4.identity();
    matrixs.forEach((m) => (matrix = m4.multiply(matrix, m)));
    return matrix;
};
/* 透视矩阵 */
const computePerspectiveMatrix = (options?: PerspectiveMatrixOption) => {
    const defaultOptions = {
        viewAngle: 75,
        aspect: 1,
        near: 1,
        far: 400,
    };

    const matrixOptions = Object.assign(defaultOptions, options);
    const {viewAngle, aspect, near, far} = matrixOptions;
    return Matrix3D.perspective(viewAngle, aspect, near, far);
};
/* 视图矩阵 */
const computeViewMatrix = (cameraPosition: number[], targetPosition: number[]) => {
    const matrix = Matrix3D.lookAt(cameraPosition, targetPosition)
    return m4.inverse(matrix)
}

const getProgram = (gl: WebGL2RenderingContext) => {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragmentShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        FRAMENT_SHADER_SOURCE
    );
    const program = createProgram(gl, vertexShader, fragmentShader);
    return program;
};
