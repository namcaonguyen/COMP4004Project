const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var deliverableSchema = new Schema({
    class_id: { type: Schema.Types.ObjectId, ref: 'Class' },
    title: String,
    description: String,
    weight: Number
});

module.exports = mongoose.model("Deliverable", deliverableSchema);