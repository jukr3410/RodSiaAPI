require('dotenv').config();
const createError = require('http-errors');
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const logger = require('morgan');
const app = express();

app.use(express.json()); // parses incoming requests with JSON payloads


const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('App is listening on port ' + listener.address().port)
})


//routes
const userRoute = require("./routes/user");

//routes middleware
app.use("/users", userRoute);

//establish connection to database
mongoose.connect(
    process.env.MONGODB_URI,
    { useFindAndModify: false,useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true},
    (err) => {
        if (err) return console.log("Error: ", err);
        console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
    }
);


module.exports = app;