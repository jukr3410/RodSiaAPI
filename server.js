require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const logger = require("morgan");
const MongoDbConfig = require("./configs/mongodb.config");
const app = express();


const listener = app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port " + listener.address().port);
});

MongoDbConfig.configure()
    .then((res) => {
        // routes
        const userRoute = require("./routes/user.routes");
        const serviceRoute = require("./routes/service.routes")
        const {
            count
        } = require("console");


        app.use(logger("dev"));
        // parses incoming requests with JSON payloads
        app.use(express.json());


        // routes middleware
        app.use("/users", userRoute);
        app.use("/services", serviceRoute);

        // catch 404 and forward to error handler
        app.use(function (req, res, next) {
            next(createError(404));
        });

        // error handler
        app.use(function (err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.json({
                error: {
                    status: statusCode,
                    message: err.message
                }
            });
            //res.json(AppResponseDto.buildWithErrorMessages('Something went wrong 5xx ' + err));
        });


    })
    .catch((err) => {
        throw err;
    });



module.exports = app;