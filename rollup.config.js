// rollup.config.js
import serve from "rollup-plugin-serve";

export default [
  {
    input: "./dist/index.js",
    output: {
      file: "./build/bundle.js",
      format: "es",
    },
    plugins: [
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
