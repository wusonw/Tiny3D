import Tiny3D from "../../build/bundle.js";
const canvasDom = document.getElementById("canvas");
const tiny3 = new Tiny3D(canvasDom);
tiny3.setGeometry([0, 0, 0, 0.5, 0.7, 0, 0, -1, 0, 5]);