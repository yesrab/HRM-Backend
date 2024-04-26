const express = require("express");
require("dotenv").config();
require("express-async-errors");

const statusMonitor = require("express-status-monitor-plus");
const connect = require("./db/connect");

//env variables
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB || "";
//env variables

const app = express();
app.use(
  statusMonitor({
    path: "/api/status",
  })
);
app.get("/", function (req, res) {
  res.send("Hello World");
});

//error handler middleware
const globalErrorHandler = require("./middleware/globalErrorHandler");
app.use(globalErrorHandler);
//error handler middleware

const startServer = async () => {
  try {
    await connect(DB_URI);
    app.listen(PORT, () => {
      console.log(`Server Started at port ${PORT}`);
      console.log("\x1b[36m%s\x1b[0m", `http://localhost:${PORT}/`);
    });
  } catch (e) {
    console.log(e);
  }
};

startServer();