const path = require("path");
const { sep } = path;
const glob = require("glob");
/**
 * extend loader
 * @param {object} app koa实例
 *
 * 加载app/extend文件夹下所有的extend,通过 app.xxxx 访问
 * 例：
 * app/extend/user-config.js
 * => app.userConfig
 */

module.exports = (app) => {
  //读取app/extend下的所有js文件
  glob
    .sync(path.resolve(app.businessDir, `.${sep}extend${sep}**${sep}*.js`))
    // 遍历所有文件，挂载到app 下
    .forEach((file) => {
      //1截取文件路径中extend之后的部分
      const relativePath = path.relative(
        path.resolve(app.businessDir, `.${sep}extend`),
        file,
      );
      // 2去掉文件后缀名
      const moduleName = relativePath.replace(/\.js$/, "");
      // 3把 - 转换为驼峰
      const camelCaseName = moduleName.replace(/-([a-z])/g, (g) =>
        g[1].toUpperCase(),
      );
      if (camelCaseName in app) {
        console.warn(
          `Warning: app.${camelCaseName} already exists in app, skipping extend from file: ${file}`,
        );
      } else {
        // 4 挂载到app下
        app[camelCaseName] = require(path.resolve(file))(app);
      }
    });

  console.log("app:", app);
  console.log("-- extendLoader done--");
};
