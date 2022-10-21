import { Tiny3D, Geometry, Cylinder } from "../../build/bundle.js";
const canvasDom = document.getElementById("canvas");
canvasDom.width = 500;
canvasDom.height = 500;
const gl = canvasDom.getContext("webgl2");
if (!gl) throw new Error(`Can not get WebGL`);
const tiny3 = new Tiny3D(gl);
const points = [1, 0, 0, 0, 1, 0, 0, 0, 1];

const geo = new Geometry();
geo.setMash({ points, indices: [0, 1, 2] });
geo.setColor(1, 0, 0.3, 1);
tiny3.addGeometry(geo);

const cyblinder = new Cylinder();
cyblinder.setColor(0, 0, 2, 0);
tiny3.addGeometry(cyblinder);
console.log(tiny3);
