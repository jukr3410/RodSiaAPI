require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const logger = require("morgan");
const MongoDbConfig = require("./configs/mongodb.config");
const AppResponseDto = require("./dtos/responses/appResponse.dto");
const app = express();
const session = require("express-session");
const cors = require("cors");
const auth = require("./middlewares/auth.middleware");
const http = require("http");

// socket io
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(
    "Server is running on port http://localhost:" + listener.address().port
  );
});

MongoDbConfig.configure()
  .then((res) => {
    // routes
    const userRoute = require("./routes/user.routes");
    const serviceRoute = require("./routes/service.routes");
    const serviceTypeRoute = require("./routes/serviceType.routes");
    const reviewRoute = require("./routes/review.routes");
    const requestSerivceRoute = require("./routes/requestService.routes");
    const infoAssistantRoute = require("./routes/infoAssistant.routes");
    const garageRoutes = require("./routes/garage.routes");
    const fileUploadRoute = require("./routes/fileUpload.routes");
    const authenticationRoute = require("./routes/authentication.routes");

    app.use(logger("dev"));
    // parses incoming requests with JSON payloads
    app.use(express.json());
    app.use(cors());

    // routes middleware
    app.use("/api", userRoute);
    app.use("/api", serviceRoute);
    app.use("/api", serviceTypeRoute);
    app.use("/api", reviewRoute);
    app.use("/api", requestSerivceRoute);
    app.use("/api", infoAssistantRoute);
    app.use("/api", garageRoutes);
    app.use("/api", fileUploadRoute);
    app.use("/api/auth", authenticationRoute);
    app.get("/", (req, res) => {
      res.send(
        "<h1>Rodsia API</h1><h4>Message: Success</h4><p>Version 1.0</p>"
      );
    });
    app.get("/welcome", auth, (req, res) => {
      res.status(200).send("Welcome 🙌 ");
    });

    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Credentials", true);
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, content-type, application/json"
      );
      res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, GET, PUT, PATCH, DELETE,HEAD, OPTIONS"
      );
      next();
    });

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(err.status || 500);
      // res.json({
      //     error: {
      //         status: statusCode,
      //         message: err.message
      //     }
      // });
      res.json(
        AppResponseDto.buildWithErrorMessages("Something went wrong 5xx " + err)
      );
    });
  })
  .catch((err) => {
    throw err;
  });

module.exports = app;
