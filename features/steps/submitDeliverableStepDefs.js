const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const User = require("../../db/user.js");
const Class = require("../../db/class.js");
const Course = require("../../db/course.js");
const Deliverable = require("../../db/deliverable.js");
const DeliverableSubmission = require("../../db/deliverableSubmission.js");
const ClassEnrollment = require('../../db/classEnrollment.js');
const { tryUpdateSubmissionDeliverable, tryCreateClass, tryCreateDeliverable } = require("../../js/classManagement.js");
const { tryCreateCourse } = require("../../js/courseManagement.js");
const { tryEnrollStudentInClass, tryDropClassNoDR } = require('../../js/classEnrollmentManagement.js');
const fs = require("fs");

async function WipeDB() {
    await Class.deleteMany({}); // delete all classes
    await Course.deleteMany({}); // delete all courses    
    await User.deleteMany({}); // delete all users
    await Deliverable.deleteMany({}); // delete all deliverables
    await DeliverableSubmission.deleteMany({}); // delete all deliverable submissions
}

Given("A professor {string} creates a deliverable for a class {string} {string} a deadline", async function (profName, courseCode, deadline) {
    await WipeDB();
    // Create a Course.
    this.course = await tryCreateCourse(courseCode, "Introduction To Computer Science I", [], []);
    assert(true, !!this.course.id);
    // Create a professor User.
    this.professor = await new User({ email: "jp@cms.com", password: "password", fullname: profName, accountType: "professor", approved: true }).save();
    assert(true, !!(await User.findById(this.professor._id)));
    // Create a Class.
    this.class = await tryCreateClass(this.course.id, this.professor._id, 10);
    assert(true, !!this.class.id);
    if (deadline === "with") {
        this.date = new Date();
        this.date.setSeconds(this.date.getSeconds()+1); // deadline 1 second from now
        this.deliverable = await tryCreateDeliverable(this.class.id, "Assignment 1", "", 15, "", this.date);
    } else this.deliverable = await tryCreateDeliverable(this.class.id, "Assignment 1", "", 15);
    assert(true, !!this.deliverable.id);
});

When("There exists an approved student with name {string} email {string} and password {string}", async function (studentName, studentEmail, studentPassword) {
    this.student = await new User({ email: "zahid.dawod@cms.com", password: "password", fullname: "Zahid Dawod", accountType: "student", approved: true }).save();
    assert(true, !!(await User.findById(this.student._id)));
    await tryEnrollStudentInClass(this.student._id, this.class.id);
    assert(true, !!(await ClassEnrollment.find({ student: this.student._id })));
});

When("The student waits until its past the deadline", async function() {
    while(this.date - new Date() > 0) { }
    assert(true);
});

When("{string} submits a text file named {string} as submission to that deliverable with the contents being {string}", async function(student, fileName, text) {
    var deliverable = await Deliverable.findById(this.deliverable.id);
    this.fileName = this.student._id + "-" + (await Course.findById(this.course.id)).courseCode + "-" + deliverable.title + "-" + fileName;
    fs.writeFileSync("uploads/" + this.fileName, text);
    await tryUpdateSubmissionDeliverable(this.class.id, this.student._id, deliverable.title, this.fileName);
});

Then("There exists a deliverable submission in the DB for {string} in the first deliverable for that class", async function (student) {
    assert.strictEqual(1, (await DeliverableSubmission.find({ student_id: this.student._id, file_name: this.fileName })).length);
});

Then("The submission should not exist", async function () {
    assert.strictEqual(0, (await DeliverableSubmission.find({ student_id: this.student._id, file_name: this.fileName })).length);
});

When("{string} drops the Class", async function(studentNameParam) {
    // Try to drop the Class.
    var result = await tryDropClassNoDR(this.student._id, this.class.id);
    // Assert that the student was able to drop the Class.
    assert(!!result.success);
});