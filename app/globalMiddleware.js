const koaNunjucks = require("koa-nunjucks-2");
const KoaStatic = require("koa-static");
const path = require("path");

module.exports = (app) => {
  // 模板渲染引擎
  app.use(
    koaNunjucks({
      ext: "tpl",
      path: path.resolve(process.cwd(), "./app/public"),
      nunjucksConfig: {
        trimBlocks: true,
        noCache: true,
      },
    }),
  );

  // 配置静态根目录
  app.use(KoaStatic(path.resolve(process.cwd(), "./app/public")));
};
