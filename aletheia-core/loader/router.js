const KoaRouter = require("koa-router");
const path = require("path");
const { sep } = path;
const glob = require("glob");
/**
 * router loader
 * @param {object} app koa实例
 * 解析所有 app/router 下的js文件，加载到KoaRouter中
 */

module.exports = (app) => {
  // 创建一个新的KoaRouter实例
  const router = new KoaRouter();

  // 读取app/router下的所有js文件
  glob
    .sync(path.resolve(app.businessDir, `.${sep}router${sep}**${sep}*.js`))
    // 遍历所有文件，挂载到KoaRouter中
    .forEach((file) => {
      require(path.resolve(file))(router, app);
      app.use(router.routes()).use(router.allowedMethods());
    });

  // 兜底路由（健壮性）
  router.get("*", async (ctx) => {
    ctx.status = 302; // 临时重定向
    ctx.redirect(app?.options?.homePage ?? "/");
  });

  // console.log("router:", router);
  // console.log("-- routerLoader done--");
};
