const dbConfig = require("../../config/db.config");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.url = dbConfig.url;

db.posts = require("./post-model")(mongoose);
db.videos = require("./video-model")(mongoose);
db.webinars = require("./webinar-model")(mongoose);
db.tips = require("./tips-model")(mongoose);

module.exports = db;
