module.exports = (app) => {
  const BaseController = require("./base")(app);
  return class ProjectController extends BaseController {
    async getList(ctx) {
      const { project: projectService } = app.service;
      const res = await projectService.getList();
      this.success(ctx, res);
    }
  };
};
