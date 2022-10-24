// rollup.config.js
import serve from "rollup-plugin-serve";
import typescript from "@rollup/plugin-typescript";
import livereload from "rollup-plugin-livereload";

export default [
  {
    input: "src/index.ts",
    output: {
      file: "./build/bundle.js",
      format: "es",
    },
    plugins: [
      // 本地服务器
      serve({
        open: true, // 自动打开页面
        port: 8000,
        openPage: "/test/index.html", // 打开的页面
        contentBase: "",
      }),
      typescript(),
      livereload("build/bundle.js"),
    ],
  },
];
