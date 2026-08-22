const path = require("path");
const { sep } = path;
const glob = require("glob");
/**
 * @file router-schema loader
 * @description 路由schema加载器
 * @param {object} app koa实例
 * 通过 json-schema & ajv 进行路由参数校验 配合api-params-
 *
 * app/router-schema/**.js
 * 输出：
 * app.routerSchema = {
 *  api1: jsonSchema,
 *  api2: jsonSchema,
 *  api3: jsonSchema,
 * }
 */
module.exports = (app) => {
  //读取app/router-schema下的所有js文件
  let routerSchema = {};
  glob
    .sync(
      path.resolve(app.businessDir, `.${sep}router-schema${sep}**${sep}*.js`),
    )
    .forEach((file) => {
      routerSchema = {
        ...routerSchema,
        ...require(path.resolve(file)),
      };
    });
  app.routerSchema = routerSchema;
  console.log("app.routerSchema:", app.routerSchema);
};
