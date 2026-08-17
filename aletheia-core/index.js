const Koa = require("koa");
const path = require("path");
const { sep } = path;
const glob = require("glob");
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

    // load global middleware app/globalMiddleware.js
    try {
      require(path.resolve(app.businessDir, `.${sep}globalMiddleware.js`))(app);
    } catch (error) {
      console.warn("There is no global middleware");
    }

    // load all loaders
    // TODO: learn how to sue glob and /*
    glob
      .sync(path.resolve(__dirname, `loader${sep}*.js`))
      .map((loader) => require(loader)(app));

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
