// import { Tiny3D, Geometry, Cylinder, Camera } from "../../build/bundle.js";
// const canvasDom = document.getElementById("canvas");
// canvasDom.width = 500;
// canvasDom.height = 500;
// const gl = canvasDom.getContext("webgl2");
// if (!gl) throw new Error(`Can not get WebGL`);
// const points = [1, 0, 0, 0, 0, 1, 0, 0, 1];

// const geo = new Geometry();
// geo.setMash({ points, indices: [0, 1, 2] }).setColor(1, 0, 0.3, 1);

// const camera = new Camera();
// camera.setPosition(1, 1, 1).setFocus(0, 0, 0);

// const tiny3 = new Tiny3D(gl);
// tiny3.addGeometry(geo).useCamera(camera).draw();

// console.log(tiny3);

import {
  Camera,
  createCamera,
  Geometry,
  WebGLBox,
} from "../../build/bundle.js";

const canvas = document.getElementById("canvas");
const box = new WebGLBox(canvas, 500, 500);
const geo = new Geometry().setMesh([
  0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0.5, -0.5, 0,
]);
const camera = createCamera(Camera.PERSPECTIVE)
  .locate(0, 0, 5)
  .lookAt(0, 0, 0)
  .tilt(1, 1, 0);

box.draw([geo], camera);

console.log("box", box);
console.log("camera", camera);
console.log("geo", geo);
