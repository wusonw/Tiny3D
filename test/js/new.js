import Tiny3D from "../../build/bundle.js";
const canvasDom = document.getElementById("canvas");
canvasDom.width = 500;
canvasDom.height = 500;
const tiny3 = new Tiny3D(canvasDom);
const points = [1, 0, 0, 0, 1, 0, 0, 0, 1];

tiny3.setGeometry(points);
tiny3.setMatrix([1, 1, 1], [0, 0, 0], [0, 1, 0]);
tiny3.setLight();
