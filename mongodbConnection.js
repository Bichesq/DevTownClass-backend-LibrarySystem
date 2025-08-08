const mongoose = require('mongoose');
require("dotenv").config();

const DBconnection = async () => { 
    const DB_URL = process.env.MONGO_URI;

    mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
}

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log('Connected to MongoDB');
});

module.exports = DBconnection;