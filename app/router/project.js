module.exports = (router, app) => {
  const { project: projectController } = app.controller;
  router.get(
    "/api/project/list",
    projectController.getList.bind(projectController),
  );
};
