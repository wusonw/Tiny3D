// rollup.config.js
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import typescript from "@rollup/plugin-typescript";

export default [
  {
    input: "./dist/index.js",
    output: {
      file: "./build/bundle.js",
      format: "es",
    },
    plugins: [
      typescript(),
      // 热更新 默认监听根文件夹
      livereload(),
      // 本地服务器
      serve({
        open: true, // 自动打开页面
        port: 8000,
        openPage: "/__tests__/index.html", // 打开的页面
        contentBase: "",
      }),
    ],
  },
];
