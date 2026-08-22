module.exports = (router, app) => {
  const { view: viewController } = app.controller;
  // 用书输入 http://ip:port/view/xxxx 能渲染对应页面
  router.get("/view/:page", viewController.renderPage.bind(viewController));
};
