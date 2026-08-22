const log4js = require("log4js");
/**
 * 日志工具
 * 直接挂载在app.logger.info/error使用
 * @param {*} app
 * @returns
 */
module.exports = (app) => {
  let logger;
  if (app.env.isLocal()) {
    // 打印在控制台
    logger = console;
  } else {
    // 把日志输出并落地到磁盘（日志落盘）
    log4js.configure({
      appenders: {
        console: {
          type: "console",
        },
        // 文件切分
        dateFile: {
          type: "dateFile",
          filename: "./logs/application.log",
          pattern: ".yyyy-MM-dd",
        },
      },
      categories: {
        default: {
          appenders: ["console", "dateFile"],
          level: "trace",
        },
      },
    });
    logger = log4js.getLogger();
  }

  return logger;
};
