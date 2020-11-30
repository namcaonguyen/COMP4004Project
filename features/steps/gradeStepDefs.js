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
const { tryEnrollStudentInClass, trySetSubmissionGrade, calculateFinalGrade, trySubmitFinalGrade } = require('../../js/classEnrollmentManagement.js');
const fs = require("fs");
const deliverableSubmission = require('../../db/deliverableSubmission.js');

Given("The database is clear", async function () {
    await Class.deleteMany({}); // delete all classes
    await Course.deleteMany({}); // delete all courses    
    await User.deleteMany({}); // delete all users
    await Deliverable.deleteMany({}); // delete all deliverables
    await DeliverableSubmission.deleteMany({}); // delete all deliverable submissions
});

Given("A professor with email {string} creates a deliverable for their class with course code {string}, titled {string} with weight {float}", async function (
    email,
    courseCode,
    title,
    weight
    ) {
        const course = await Course.findOne({courseCode});
        const prof = await User.findOne({email});
        const class_ = await Class.findOne({course: course._id, professor: prof._id});
        const deliverable = await tryCreateDeliverable(class_._id, title, "", weight);
        assert(!!deliverable.id);
    }
);

When("A student with email {string} submits a text file named {string} for deliverable {string}", async function(email, fileName, title) {
    const student = await User.findOne({email});
    const deliverable = await Deliverable.findOne({title});
    const class_ = await Class.findById(deliverable.class_id);
    const course = await Course.findById(class_.course);
    fileName = student._id + "-" + course.courseCode + "-" + deliverable.title + "-" + fileName;
    fs.writeFileSync("uploads/" + fileName, "This is the contents of my submission");
    assert(true, await tryUpdateSubmissionDeliverable(class_._id, student._id, deliverable.title, fileName));
});

Then("A professor grades a submission for deliverable {string} as {float} and is successful", async function(title, grade) {
    const deliverable = await Deliverable.findOne({title});
    const submission = await deliverableSubmission.findOne({deliverable_id: deliverable._id});
    const { success, error } = await trySetSubmissionGrade(submission._id, grade);
    assert(success && !error);
});

Then("A professor grades a submission for deliverable {string} as {float} and fails", async function(title, grade) {
    const deliverable = await Deliverable.findOne({title});
    const submission = await deliverableSubmission.findOne({deliverable_id: deliverable._id});
    const { success, error } = await trySetSubmissionGrade(submission._id, grade);
    assert(!success && error);
});

Then("A professor with email {string} calculates the final grade for a student with email {string} in their class with course code {string} as being {float}", async function(
    profEmail, studentEmail, courseCode, finalGrade
    ) {
        const prof = await User.findOne({email: profEmail});
        const student = await User.findOne({email: studentEmail});

        const course = await Course.findOne({courseCode});
        const class_ = await Class.findOne({course: course._id, professor: prof._id});

        const calculatedFinalGrade = await calculateFinalGrade(class_._id, student._id);
        assert.strictEqual(finalGrade, calculatedFinalGrade);
    }
);

Then("A professor with email {string} submits the final grade for a student with email {string} in their class with course code {string} as being {float} and is successful", async function(
    profEmail, studentEmail, courseCode, finalGrade
    ) {
        const prof = await User.findOne({email: profEmail});
        const student = await User.findOne({email: studentEmail});

        const course = await Course.findOne({courseCode});
        const class_ = await Class.findOne({course: course._id, professor: prof._id});

        const {success, error} = await trySubmitFinalGrade(class_._id, student._id, finalGrade);
        assert(success && !error);
    }
);

Then("A professor with email {string} submits the final grade for a student with email {string} in their class with course code {string} as being {float} and fails", async function(
    profEmail, studentEmail, courseCode, finalGrade
    ) {
        const prof = await User.findOne({email: profEmail});
        const student = await User.findOne({email: studentEmail});

        const course = await Course.findOne({courseCode});
        const class_ = await Class.findOne({course: course._id, professor: prof._id});

        const {success, error} = await trySubmitFinalGrade(class_._id, student._id, finalGrade);
        assert(!success && error);
    }
);