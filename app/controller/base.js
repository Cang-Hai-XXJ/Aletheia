module.exports = (app) =>
  /**
   * controller 基类
   * 统一收拢 controller层相关公共方法
   */
  class BaseController {
    constructor() {
      this.app = app;
      this.controller = app.controller;
      this.service = app.service;
    }
    /**
     * API处理成功统一返回结构
     * @param {object} ctx 上下文
     * @param {object} data 核心数据
     * @param {object} metadata 附加数据
     */
    success(ctx, data = {}, metadata = {}) {
      ctx.status = 200;
      ctx.body = {
        success: true,
        data,
        metadata,
      };
    }
    /**
     * API处理失败统一返回结构
     * @param {object} ctx 上下文
     * @param {object} message 错误信息
     * @param {object} code 错误码
     */
    fail(ctx, message, code) {
      ctx.body = {
        success: false,
        message,
        code,
      };
    }
  };
