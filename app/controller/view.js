module.exports = (app) => {
  return class ViewController {
    async renderPage(ctx) {
      await ctx.render(`output/entry.${ctx.params.page}`, {
        name: app.options?.name,
        env: app.env.get(),
        options: JSON.stringify(app.options),
      });
    }
  };
};
