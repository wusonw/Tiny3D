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
    0, 1, 2, 0, 2, 3, 0, 3, 7, 0, 7, 4, 1, 6, 2, 1, 5, 6, 5, 4, 6, 4, 7, 6, 3,
    2, 6, 7, 3, 6, 0, 4, 5, 0, 5, 1,
  ],
  // faces: [0, 1, 3, 0, 4, 1, 0, 3, 4, 1, 4, 3],
});

const camera = createCamera(Camera.PERSPECTIVE)
  .locate(0, 0, 5)
  .lookAt(0, 0, 0)
  .tilt(0, 1, 0);

box.draw([geo], camera);

setInterval(() => {
  const [x, y, z] = geo.transform.rotate;
  geo.transform.rotate = [x, y + 1, z];
  box.draw([geo], camera);
}, 1000 / 60);
