const Koa = require("koa");
const path = require("path");
const { sep } = path;
// const glob = require("glob");

const middlewareLoader = require("./loader/middleware");
const routerSchemaLoader = require("./loader/router-schema");
const routerLoader = require("./loader/router");
const controllerLoader = require("./loader/controller");
const serviceLoader = require("./loader/service");
const configLoader = require("./loader/config");
const extendLoader = require("./loader/extend");
/**
 *  @param {object} options - 项目配置
 *  options = {
 *    name : "项目名称",
 *    homePage : "项目主页",
 *  }
 */
const env = require("./env");
module.exports = {
  start(options = {}) {
    const app = new Koa();

    // app options
    app.options = options;

    // base directory
    app.baseDir = path.resolve(__dirname, "..");
    //TODO: learn how to use path
    // console.log(`Base directory: ${app.baseDir}`, `${process.cwd()}`);
    // business logic directory
    app.businessDir = path.resolve(app.baseDir, `.${sep}app`);
    // console.log(`Business logic directory: ${app.businessDir}`);

    // init env options
    app.env = env();
    console.log("start env:", app.env.get());

    // load all loaders
    // TODO: learn how to sue glob and /*
    // glob.sync(path.resolve(__dirname, `loader${sep}*.js`)).forEach((loader) => {
    //   require(loader)(app);
    // });

    // 加载 middleware
    middlewareLoader(app);

    // 加载 router-schema
    routerSchemaLoader(app);

    // 加载 controller
    controllerLoader(app);

    // 加载 service
    serviceLoader(app);

    // 加载 config
    configLoader(app);

    // 加载 extend
    extendLoader(app);

    // load global middleware app/globalMiddleware.js
    try {
      require(path.resolve(app.businessDir, `.${sep}globalMiddleware.js`))(app);
    } catch (error) {
      console.warn("There is no global middleware");
    }

    // 加载 router,需要写在加载其他中间件之后，在进行路由分发
    routerLoader(app);

    //start the server
    try {
      const port = process.env.PORT || 3000;
      const host = process.env.HOST || "localhost";

      //TODO: learn how to use koa
      app.listen(port, host);
      console.log(`Server is running on port ${port} and host ${host}`);
    } catch (error) {
      console.error("Error starting the server:", error);
    }
  },
};
