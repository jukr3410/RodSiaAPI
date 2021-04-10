const mongoose = require('mongoose');
exports.configure = function() {
    mongoose.Promise = global.Promise;
    mongoose.set('debug', true);
    mongoose.connection.on('error', function(err) {
        console.error(err);
    });
    mongoose.connection.once('open', () => {
        console.log('[+] Connected to database seccessfully');
    });

    return mongoose.connect(process.env.MONGODB_URI, {
        debug: process.env.DEBUG || true,
        keepAlive: true,
        useNewUrlParser: true,
    });
}