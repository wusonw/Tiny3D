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
const geo = new Geometry().setMesh({
  vertex: [
    0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5,
    -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5,
  ],
  faces: [
    0, 1, 3, 2, 3, 1, 0, 3, 7, 0, 7, 4, 1, 6, 2, 1, 5, 6, 5, 4, 6, 4, 6, 7, 3,
    2, 6, 7, 3, 6, 0, 4, 5, 0, 5, 1,
  ],
  // faces: [0, 1, 3, 0, 4, 1, 0, 3, 4, 1, 4, 3],
});

const camera = createCamera(Camera.PERSPECTIVE)
  .locate(3, 3, 3)
  .lookAt(0, 0, 0)
  .tilt(0, 1, 0);

box.draw([geo], camera);

setInterval(() => {
  const [x, y, z] = geo.transform.rotate;
  geo.transform.rotate = [x + 1, y + 1, z + 1];
  // geo.transform.scale = [x + 0.001, y + 0.001, z + 0.001];
  box.draw([geo], camera);
}, 1000 / 60);
