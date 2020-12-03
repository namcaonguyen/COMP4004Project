const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var deliverableSchema = new Schema({
    class_id: { type: Schema.Types.ObjectId, ref: 'Class' },
    title: String,
    description: String,
    specification_file: String,
    weight: Number,
    deadline: Date,
    is_deleting: Boolean
});

module.exports = mongoose.model("Deliverable", deliverableSchema);