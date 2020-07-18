const express = require("express");
const projectsRouter = require("./api/projects/projectsRouter.js");
const actionsRouter = require("./api/actions/actionsRouter.js");
const cors = require("cors");
const server = express();

server.use(express.json());
server.use(cors());

//custom middlewears
server.use(logger);

server.use("/api/projects", projectsRouter);
server.use("/api/actions", actionsRouter);

server.get("/", (req, res) => {
  res.send(`<h2>This is Sprint1 for Unit4!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(
    `${req.method} Request ${req.url} [${new Date().toISOString()}] `
  );
  next();
}

module.exports = server;
