const express = require("express");
require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const statusMonitor = require("express-status-monitor-plus");
const connect = require("./db/connect");

//env variables
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB || "";
//env variables

const app = express();

app.use(cors());

//express body json parsing middleware
app.use(express.json());

//express url parsing middleware
app.use(express.urlencoded({ extended: false }));

app.use(
  statusMonitor({
    path: "/api/status",
  })
);
app.get("/", function (req, res) {
  res.send("Hello World");
});

//teachers Route
const teachersRoutes = require("./routes/teachers");
app.use("/api/v1/teachers", teachersRoutes);
//teachers Route

//student Route
const studentRoutes = require("./routes/students");
app.use("/api/v1/students", studentRoutes);
//student Route

//classes Route
const classRoutes = require("./routes/class");
app.use("/api/v1/class", classRoutes);
//classes Route

//analytics Route
const analyticsRoutes = require("./routes/analytics");
app.use("/api/v1/analytics", analyticsRoutes);
//analytics Route

//error handler middleware
const globalErrorHandler = require("./middleware/globalErrorHandler");
app.use(globalErrorHandler);
//error handler middleware

const startServer = async () => {
  try {
    await connect(DB_URI);
    app.listen(PORT, () => {
      console.log(`Server Started at port ${PORT}`);
      console.log("");
      console.log("\x1b[36m%s\x1b[0m", `http://localhost:${PORT}/`);
      console.log("^ click here");
      console.log("");
    });
  } catch (e) {
    console.log(e);
  }
};

startServer();

