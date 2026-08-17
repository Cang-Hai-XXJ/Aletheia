const path = require("path");
const { sep } = path;
const glob = require("glob");
/**
 * controller loader
 * @param {object} app koa实例
 *
 * 加载app/controller文件夹下所有层级的controller,通过 app.controller.xx.xxxx 访问
 * 例：
 * app/controller/config/user-config.js
 * => app.controller.config.userConfig
 */

module.exports = (app) => {
  //读取app/controller下的所有js文件
  glob
    .sync(path.resolve(app.businessDir, `.${sep}controller${sep}**${sep}*.js`))
    // 遍历所有文件，挂载到app.controller 下
    .forEach((file) => {
      // console.log(`Loading controller from file: ${file}`);
      //1截取文件路径中controller之后的部分
      const relativePath = path.relative(
        path.resolve(app.businessDir, `.${sep}controller`),
        file,
      );
      // 2去掉文件后缀名
      const moduleName = relativePath.replace(/\.js$/, "");
      // 3把 - 转换为驼峰
      const camelCaseName = moduleName.replace(/-([a-z])/g, (g) =>
        g[1].toUpperCase(),
      );
      // console.log(`controller module name: ${camelCaseName}`);
      // 4 嵌套挂载到app.controller下
      const parts = camelCaseName.split(sep);
      const controller = {};
      let tempController = {};
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          // 最后一个部分，挂载中间件函数
          tempController[part] = require(path.resolve(file))(app);
        } else {
          // 中间部分，创建嵌套对象
          tempController[part] = tempController[part] || {};
          controller[part] = tempController[part];
        }
        tempController = tempController[part];
      }
      // 合并到app.controller下
      app.controller = { ...app.controller, ...controller };
    });

  console.log("app.controller:", app.controller);
  console.log("-- controllerLoader done--");
};
