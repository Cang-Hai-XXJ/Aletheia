const path = require("path");
const { sep } = path;
const glob = require("glob");
/**
 * middleware loader
 * @param {object} app koa实例
 *
 * 加载app/middleware文件夹下所有层级的middleware,通过 app.middlewares.xx.xxxx 访问
 * 例：
 * app/middleware/config/user-config.js
 * => app.middlewares.config.userConfig
 */

module.exports = (app) => {
  const middleware = {};
  //读取app/middleware下的所有js文件
  glob
    .sync(path.resolve(app.businessDir, `.${sep}middleware${sep}**${sep}*.js`))
    // 遍历所有文件，挂载到app.middleware 下
    .forEach((file) => {
      // console.log(`Loading middleware from file: ${file}`);
      //1截取文件路径中middleware之后的部分
      const relativePath = path.relative(
        path.resolve(app.businessDir, `.${sep}middleware`),
        file,
      );
      // 2去掉文件后缀名
      const moduleName = relativePath.replace(/\.js$/, "");
      // 3把 - 转换为驼峰
      const camelCaseName = moduleName.replace(/-([a-z])/g, (g) =>
        g[1].toUpperCase(),
      );
      // console.log(`Middleware module name: ${camelCaseName}`);
      // 4 嵌套挂载到app.middleware下
      const parts = camelCaseName.split(sep);
      let tempMiddleware = middleware;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          // 最后一个部分，挂载中间件函数
          tempMiddleware[part] = require(path.resolve(file))(app);
        } else {
          // 中间部分，创建嵌套对象
          tempMiddleware[part] = tempMiddleware[part] || {};
          tempMiddleware = tempMiddleware[part];
        }
      }
      // 合并到app.middleware下
      app.middlewares = { ...app.middlewares, ...middleware };
    });

  console.log("app.middlewares:", app.middlewares);
  // console.log("-- middlewareLoader done--");
};
