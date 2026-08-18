const path = require("path");
const { sep } = path;
const glob = require("glob");
/**
 * service loader
 * @param {object} app koa实例
 *
 * 加载app/service文件夹下所有层级的service,通过 app.service.xx.xxxx 访问
 * 例：
 * app/service/config/user-config.js
 * => app.service.config.userConfig
 */

module.exports = (app) => {
  const service = {};
  //读取app/service下的所有js文件
  glob
    .sync(path.resolve(app.businessDir, `.${sep}service${sep}**${sep}*.js`))
    // 遍历所有文件，挂载到app.service 下
    .forEach((file) => {
      // console.log(`Loading service from file: ${file}`);
      //1截取文件路径中service之后的部分
      const relativePath = path.relative(
        path.resolve(app.businessDir, `.${sep}service`),
        file,
      );
      // 2去掉文件后缀名
      const moduleName = relativePath.replace(/\.js$/, "");
      // 3把 - 转换为驼峰
      const camelCaseName = moduleName.replace(/-([a-z])/g, (g) =>
        g[1].toUpperCase(),
      );
      // console.log(`service module name: ${camelCaseName}`);
      // 4 嵌套挂载到app.service下
      const parts = camelCaseName.split(sep);
      let tempService = service;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          // 最后一个部分，挂载中间件函数
          tempService[part] = require(path.resolve(file))(app);
        } else {
          // 中间部分，创建嵌套对象
          tempService[part] = tempService[part] ?? {};
          tempService = tempService[part];
        }
      }
      // 合并到app.service下
      app.service = { ...app.service, ...service };
    });

  console.log("app.service:", app.service);
  console.log("-- serviceLoader done--");
};
