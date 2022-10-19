import {v3} from "./math";

const {cos, sin, PI, tan} = Math;

/* 针对视图操作的矩阵 */
export const Matrix3D = {
    /* 平移 */
    translation: function (tx: number, ty: number, tz: number) {
        return [
            1, 0, 0, tx,
            0, 1, 0, ty,
            0, 0, 1, tz,
            0, 0, 0, 1
        ];
    },
    /* 旋转 */
    xRotation: function (angle: number) {
        const c = cos((angle * PI) / 180);
        const s = sin((angle * PI) / 180);
        return [
            1, 0, 0, 0,
            0, c, -s, 0,
            0, s, c, 0,
            0, 0, 0, 1
        ];
    },
    yRotation: function (angle: number) {
        const c = cos((angle * PI) / 180);
        const s = sin((angle * PI) / 180);
        return [
            c, 0, s, 0,
            0, 1, 0, 0,
            -s, 0, c, 0,
            0, 0, 0, 1
        ];
    },
    zRotation: function (angle: number) {
        const c = cos((angle * PI) / 180);
        const s = sin((angle * PI) / 180);
        return [
            c, -s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    },
    /* 缩放 */
    scale: function (sx: number, sy: number, sz: number) {
        return [
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1
        ];
    },
    /* 透视矩阵 */
    perspective: function (
        viewAngle: number,
        aspect: number,
        near: number,
        far: number
    ) {
        const f = tan(PI * 0.5 - 0.5 * viewAngle);
        const rangeInv = 1.0 / (near - far);

        return [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, near * far * rangeInv * 2,
            0, 0, -1, 0,
        ];
    },
    /* 视图矩阵 */
    lookAt: function (cameraPosition: number[], target: number[], up: number[]) {
        const zAxis = v3.normalize(
            v3.subtract(cameraPosition, target));
        const xAxis = v3.normalize(v3.cross(up, zAxis));
        const yAxis = v3.normalize(v3.cross(zAxis, xAxis));

        return [
            xAxis[0], xAxis[1], xAxis[2], 0,
            yAxis[0], yAxis[1], yAxis[2], 0,
            zAxis[0], zAxis[1], zAxis[2], 0,
            cameraPosition[0],
            cameraPosition[1],
            cameraPosition[2],
            1,
        ];
    }

};
