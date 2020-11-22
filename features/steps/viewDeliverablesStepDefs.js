const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const User = require("../../db/user.js");
const Class = require("../../db/class.js");
const Course = require("../../db/course.js");
const Deliverable = require("../../db/deliverable.js");
const deliverableSubmission = require("../../db/deliverableSubmission.js");
const ClassEnrollment = require("../../db/classEnrollment.js");
const {
    tryCreateClass
} = require("../../js/classManagement.js");
const {
    tryCreateCourse
} = require("../../js/courseManagement.js");

Given("The database is empty before viewing deliverables", async function () {
    await Class.deleteMany({}); // delete all classes
    await Course.deleteMany({}); // delete all courses    
    await User.deleteMany({}); // delete all users
    await Deliverable.deleteMany({}); // delete all the deliverables
    await deliverableSubmission.deleteMany({}); // delete all the deliverable submissions

    assert.strictEqual((await Class.find({})).length, 0); // assert that no Classes found, meaning they were all deleted.
    assert.strictEqual((await Course.find({})).length, 0); // assert that no courses found, meaning they were all deleted.
    assert.strictEqual((await User.find({})).length, 0); // assert that no professors were found, meaning they were all deleted.
    assert.strictEqual((await Deliverable.find({})).length, 0); // assert that no courses found, meaning they were all deleted.
    assert.strictEqual((await deliverableSubmission.find({})).length, 0); // assert that no professors were found, meaning they were all deleted.
});

Given("There exists a course with code {string} and title {string} and prereqs {string} and precludes {string} before viewing deliverables", async function (courseCodeParam, titleParam, prereqsParam, precludesParam) {
    // Split the prereqs and precludes by ',' into an array and remove the empty strings if any
    setOfPrereqs = prereqsParam.split(",");
    setOfPrecludes = precludesParam.split(",");
    setOfPrereqs = setOfPrereqs.filter(item => item);
    setOfPrecludes = setOfPrecludes.filter(item => item);

    // Create Course object and save it to the database.
    const createdCourse = new Course({
        courseCode: courseCodeParam,
        title: titleParam,
        prereqs: setOfPrereqs,
        precludes: setOfPrecludes
    });

    // Save the user to the database.
    await createdCourse.save();

    assert.strictEqual((await Course.find({})).length, 1);

    this.createdCourseObjectId = createdCourse._id;
});

Given("There exists an approved professor in the database named {string} with email {string} and password {string} before viewing deliverables", async function (userName, userEmail, userPassword) {
    // Create user object and save it to the database.
    const createdProfessor = new User({
        email: userEmail,
        password: userPassword,
        fullname: userName,
        accountType: "professor",
        approved: true
    });

    // Save the user to the database.
    await createdProfessor.save();

    // Find the new User in the database.
    var newCreatedProfessor = await User.find({ _id: createdProfessor._id, accountType: "professor" }, function (err, foundProfessors) {
        if (err) {
            return console.error(err);
        } else {
            return foundProfessors;
        }
    });

    assert.equal(newCreatedProfessor[0].fullname, createdProfessor.fullname);
    assert.equal(newCreatedProfessor[0].accountType, createdProfessor.accountType);
    assert.equal(true, newCreatedProfessor[0]._id.equals(createdProfessor._id));

    this.createdProfessorObjectId = createdProfessor._id;
});

Given("There exists a Class for {string} with capacity {int} before viewing deliverables", async function (courseCodeParam, totalCapacityParam) {
    // Create a Class object to save to the database.
    const createdClass = new Class({
        course: this.createdCourseObjectId,
        professor: this.createdProfessorObjectId,
        totalCapacity: totalCapacityParam,
    });

    // Save the Class to the database.
    await createdClass.save();

    // Find the new Class in the database.
    var newCreatedClass = await Class.find({ _id: createdClass._id });

    // Assert that the newly created Class was found in the database.
    assert.equal(true, newCreatedClass.length);

    this.createdClassObjectID = createdClass._id;
});

When("The professor creates a deliverable for the class with title {string} with a weight of {int} and a description of {string}", async function (titleParam, weightParam, descriptionParam) {
    // Create a Deliverable object to save to the database.
    const createdDeliverable = new Deliverable({
        class_id: this.createdClassObjectID,
        title: titleParam,
        description: descriptionParam,
        weight: weightParam
    });

    // Save the Deliverable to the database.
    await createdDeliverable.save();

    // Find the new Deliverable in the database.
    var newCreatedDeliverable = await Deliverable.find({ _id: createdDeliverable._id });

    // Assert that the newly created deliverable was found in the database.
    assert.equal(true, newCreatedDeliverable.length);

    this.createdDeliverableObjectID = createdDeliverable._id;
});

Then("The professor can see the deliverable in the deliverables list", async function () {
    // Assert that the deliverable was found for the class
    const foundDeliverable = await Deliverable.find({ _id: this.createdDeliverableObjectID, class_id: this.createdClassObjectID });
    assert.equal(1, foundDeliverable.length);
});

Then("The professor can't see any deliverables in the deliverables list for his class", async function () {
    // Assert that no deliverable was found for the class
    const foundDeliverable = await Deliverable.find({ class_id: this.createdClassObjectID });
    assert.equal(0, foundDeliverable.length);
});

Given("There exists an approved student in the database named {string} with email {string} and password {string} and is enrolled in the class", async function (nameParam, emailParam, passwordParam) {
    // Create a User object to save to the database.
    const createdStudent = new User({
        email: emailParam,
        password: passwordParam,
        fullname: nameParam,
        accountType: "student",
        approved: true
    });

    // Save the User to the database.
    await createdStudent.save();

    // Find the new student in the database.
    var newCreatedStudent = await User.find({ _id: createdStudent._id });

    // Assert that the newly created student was found in the database.
    assert.equal(true, newCreatedStudent.length);

    this.createdStudentObjectID = createdStudent._id;
});

Then("The student can see the deliverable in the deliverables list", async function () {
    // Assert that the deliverable was found for the class
    const foundDeliverable = await Deliverable.find({ _id: this.createdDeliverableObjectID, class_id: this.createdClassObjectID });
    assert.equal(1, foundDeliverable.length);
});

Then("The student can't see any deliverables in the deliverables list for his class", async function () {
    // Assert that no deliverable was found for the class
    const foundDeliverable = await Deliverable.find({ class_id: this.createdClassObjectID });
    assert.equal(0, foundDeliverable.length);
});