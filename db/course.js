const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var courseSchema  = new Schema({
    id: String,
    title: String,
    professor: String,
    date: Date,
    totalCapacity: Number,
    prereqs: [String],
    precludes: [String]
});

module.exports = mongoose.model("Course", courseSchema);