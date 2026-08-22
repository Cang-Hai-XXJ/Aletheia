const md5 = require("md5");

/**
 * API 签名合法性校验
 * 避免遭到攻击
 */
module.exports = (app) => {
  return async (ctx, next) => {
    //过滤资源请求,只对API请求做签名校验
    if (ctx.path.indexOf("/api") < 0) {
      return await next();
    }

    const { path, method } = ctx;
    const { s_sign: sSign, s_t: st } = ctx.request.headers;

    // TODO：实际项目中应从环境变量读取
    const SECRET_KEY = "your-super-secret-key-123";
    const signature = md5(`${SECRET_KEY}_${st}`);
    app.logger.info(`[${method} ${path}] signature: ${signature}`);

    if (
      !sSign || //  1. 基础字段检查
      !st || // 1. 基础字段检查
      // !nonce ||  1. 基础字段检查
      // 2. 防重放攻击：检查 nonce 是否已被使用
      // 实际项目中应使用 Redis: redis.set(`nonce:${nonce}`, 1, 'EX', 300)
      // 这里仅作演示
      // if (await redis.exists(`nonce:${nonce}`)) {
      //   return res.status(403).json({ code: 403, msg: '请求不可重复提交' });
      // }
      Date.now() - st > 5 * 60 * 1000 || // 3. 防重放攻击：检查时间戳是否过期
      signature !== sSign.toLowerCase() // 4. 校验签名
    ) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        message: "签名校验失败，非法请求",
        code: 445,
      };
      return;
    }
    await next();
  };
};
