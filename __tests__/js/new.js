import Tiny3D from "../../build/bundle.js";
const canvasDom = document.getElementById("canvas");
canvasDom.width = 500;
canvasDom.height = 500;
const tiny3 = new Tiny3D(canvasDom);
tiny3.setGeometry([0, 1, 0, 0, 0, 1, 1, 0, 0]);
tiny3.setMatrix();
tiny3.drawScene();
