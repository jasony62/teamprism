module.exports = {
  // 基本路径
  publicPath: "/",

  // 输出文件目录
  outputDir: "../back/public",

  // 生成的静态资源在它们的文件名中包含hash
  filenameHashing: true,

  // 在 multi-page 模式下构建应用
  pages: {
    index: {
      // page 的入口
      entry: "src/main.js",
      // 模板来源
      template: "public/index.html",
      // 在 dist/index.html 的输出
      filename: "index.html",
      // 当使用 title 选项时，
      title: "团队棱镜",
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "index"]
    },
    ue_matter_enroll: {
      // page 的入口
      entry: "src/ue/matter/enroll/main.js",
      // 模板来源
      template: "public/index.html",
      // 在 dist/index.html 的输出
      filename: "./ue/matter/enroll/main.html",
      // 当使用 title 选项时，
      title: "记录活动",
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "main"]
    }
  },
  // enabled by default if the machine has more than 1 cores
  parallel: require("os").cpus().length > 1
}