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

  // 引入ctx.body 解析中间件
  //TODO: bodyParser
  const bodyParser = require("koa-bodyparser");
  app.use(
    bodyParser({
      formLimit: "1000mb",
      enableTypes: ["form", "json", "text"],
    }),
  );

  //引入异常捕获中间件
  app.use(app.middlewares.errorHandler);

  //引入API签名校验中间件
  app.use(app.middlewares.apiSignVerify);

  //引入API参数校验中间件
  app.use(app.middlewares.apiParamsVerify);
};
