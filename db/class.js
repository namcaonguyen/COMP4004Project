const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var classSchema = new Schema({
    course: {type: Schema.Types.ObjectId, ref: 'Course'},
    professor: {type: Schema.Types.ObjectId, ref: 'User'},
    totalCapacity: Number
});

module.exports = mongoose.model("Class", classSchema);