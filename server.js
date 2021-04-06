require('dotenv').config();

//import mongoose and express
const mongoose = require('mongoose');
const express = require('express')
const app = express()

//establish connection to database
mongoose.connect(
    process.env.MONGODB_URI,
    { useFindAndModify: false,useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true},
    (err) => {
        if (err) return console.log("Error: ", err);
        console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
    }
);

app.use(express.json())

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('App is listening on port ' + listener.address().port)
})
 