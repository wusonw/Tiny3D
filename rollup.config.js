// rollup.config.js
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import typescript from "@rollup/plugin-typescript";

export default [
  {
    input: "src/index.ts",
    output: {
      file: "./build/bundle.js",
      format: "es",
    },
    plugins: [
      // 热更新 默认监听根文件夹
      livereload(),
      typescript({
        sourceMap: false,
      }),
      // 本地服务器
      serve({
        open: false, // 自动打开页面
        port: 8000,
        openPage: "/test/index.html", // 打开的页面
        contentBase: "",
      }),
    ],
  },
];
