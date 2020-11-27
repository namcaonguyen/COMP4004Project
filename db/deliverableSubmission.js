const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var deliverableSubmissionSchema = new Schema({
    deliverable_id: { type: Schema.Types.ObjectId, ref: 'Deliverable' },
    student_id: { type: Schema.Types.ObjectId, ref: 'User' },
    file_name: String,
    grade: Number
});

module.exports = mongoose.model("deliverableSubmission", deliverableSubmissionSchema);