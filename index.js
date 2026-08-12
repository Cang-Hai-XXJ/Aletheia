const Koa = require("koa");

const app = new Koa();

//start the server
try {
  const port = process.env.PORT || 3000;
  const host = process.env.HOST || "localhost";
  app.listen(port, host);
  console.log(`Server is running on port ${port} and host ${host}`);
} catch (error) {
  console.error("Error starting the server:", error);
}
