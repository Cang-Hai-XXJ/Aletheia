const Ajv = require("ajv");
const ajv = new Ajv();

/**
 * API 参数合法性校验
 */
module.exports = (app) => {
  return async (ctx, next) => {
    const $schema = "http://json-schema.org/draft-07/schema#";
    //过滤资源请求,只对API请求做参数合法性校验
    if (ctx.path.indexOf("/api") < 0) {
      return await next();
    }

    //获取请求参数
    const { params, path, method } = ctx;
    const { body, query, headers } = ctx.request;

    //记录日志
    app.logger.info(`[${method} ${path}] body: ${JSON.stringify(body)}`);
    app.logger.info(`[${method} ${path}] query: ${JSON.stringify(query)}`);
    app.logger.info(`[${method} ${path}] params: ${JSON.stringify(params)}`);
    app.logger.info(`[${method} ${path}] headers: ${JSON.stringify(headers)}`);

    const schema = app.routerSchema[path.substring(1)]?.[method.toLowerCase()];
    console.log("schema", schema);
    if (!schema) {
      return await next();
    }

    let valid = true;

    let validate;

    //校验headers
    if (valid && headers && schema.headers) {
      schema.headers.$schema = $schema;
      validate = ajv.compile(schema.headers);
      valid = validate(headers);
    }

    //校验body
    if (valid && body && schema.body) {
      schema.body.$schema = $schema;
      validate = ajv.compile(schema.body);
      valid = validate(body);
    }

    //校验query
    if (valid && query && schema.query) {
      schema.query.$schema = $schema;
      validate = ajv.compile(schema.query);
      valid = validate(query);
    }

    //校验params
    if (valid && params && schema.params) {
      schema.params.$schema = $schema;
      validate = ajv.compile(schema.params);
      valid = validate(params);
    }

    if (!valid) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        message: `参数不合法：${ajv.errorsText(validate.errors)}`,
        code: 442,
      };
      return;
    }

    await next();
  };
};
