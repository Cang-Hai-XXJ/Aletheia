const path = require("path");
const { sep } = path;

/**
 * config loader
 * @param {Object} app koa 实例
 * 根据环境加载配置文件
 */

module.exports = (app) => {
  //1，获取配置文件路径
  const configPath = path.resolve(app.baseDir, `.${sep}config`);
  //2，加载默认配置
  let defaultConfig = {};
  try {
    defaultConfig = require(path.resolve(configPath, "default.config.js"));
  } catch (e) {
    console.error("Error loading default config");
  }
  //3，根据环境获取配置
  let envConfig = {};
  try {
    if (app.env.isLocal()) {
      envConfig = require(path.resolve(configPath, "local.config.js"));
    } else if (app.env.isBeta()) {
      envConfig = require(path.resolve(configPath, "beta.config.js"));
    } else if (app.env.isProduction()) {
      envConfig = require(path.resolve(configPath, "prod.config.js"));
    }
  } catch (e) {
    console.error("Error loading environment config");
  }

  //4，合并配置 TODO: why use Object.assign instead of deep merge?
  app.config = Object.assign({}, defaultConfig, envConfig);
  console.log("app.config:", app.config);
  // console.log("-- configLoader done--");
};
