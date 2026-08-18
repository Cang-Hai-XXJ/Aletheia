const koaNunjucks = require("koa-nunjucks-2");
const path = require("path");

// 模板渲染引擎
module.exports = (app) => {
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
};
