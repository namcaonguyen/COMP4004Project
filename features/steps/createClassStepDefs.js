const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const User = require("../../db/user.js");
const Class = require("../../db/class.js");
const Course = require("../../db/course.js");
const {
    tryCreateClass
} = require("../../js/classManagement.js");

// Set up the MongoDB.
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cmsApp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

let result;

Given("There are no existing classes in the database", async function () {
    // Delete all classes
    await Class.deleteMany({});
    const allClasses = await Class.find({});

    // Assert that no Classes found, meaning they were all deleted.
    assert.strictEqual(allClasses.length, 0);
});

Given("there are no courses in the database", async function () {
    // Delete all courses
    await Course.deleteMany({});
    const allCourses = await Course.find({});

    // Assert that no courses found, meaning they were all deleted.
    assert.strictEqual(allCourses.length, 0);
});

Given("There is a course in the database with code {string} and title {string} and prereqs {string} and precludes {string}", async function (cCode, cTitle, cPrereqs, cPrecludes) {
    // Split the prereqs and precludes by ',' into an array and remove the empty strings if any.
    setOfPrereqs = cPrereqs.split(",");
    setOfPrecludes = cPrecludes.split(",");
    setOfPrereqs = setOfPrereqs.filter(item => item);
    setOfPrecludes = setOfPrecludes.filter(item => item);
    
    // Create the Course object to save to the database.
    const createdCourse = new Course({
        courseCode: cCode,
        title: cTitle,
        prereqs: setOfPrereqs,
        precludes: setOfPrecludes
    });

    // Save the course to the database.
    await createdCourse.save();

    // Find the new course in the database.
    var newCreatedCourse = await Course.find({ _id: createdCourse._id }, function (err, foundCourses) {
        if (err) {
            return console.error(err);
        } else {
            return foundCourses;
        }
    });

    assert.equal(newCreatedCourse[0].courseCode, createdCourse.courseCode);
    assert.equal(newCreatedCourse[0].title, createdCourse.title);
    assert.equal(true, newCreatedCourse[0]._id.equals(createdCourse._id));

    this.createdCourseObjectId = createdCourse._id;
});

Given("there are no professors in the database", async function () {
    // Delete all professors
    await User.deleteMany({ accountType: "professor" });
    const allUsers = await User.find({ accountType: "professor" });

    // Assert that no professors were found, meaning they were all deleted.
    assert.strictEqual(allUsers.length, 0);
});

Given("there exists an approved professor in the database named {string} with email {string} and password {string}", async function (userName, userEmail, userPassword) {
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


When("An admin tries to create a class for course code {string} with {string} and capacity {int}", async function (classCode, classProfessor, classCapacity) {
    // Create class object and save it to the database.
    result = await tryCreateClass( this.createdCourseObjectId, this.createdProfessorObjectId, classCapacity );
});

Then("There exists a class for the {string} with {string} and capacity {int}", async function (classCodeString, classProfessorString, classCapacity) {
    // Find all the Classes with the given attributes.
    const allClasses = await Class.find({ _id: result.id, course: this.createdCourseObjectId, professor: this.createdProfessorObjectId, totalCapacity: classCapacity });

    // Assert that a class was found, meaning it was saved.
    assert.equal(allClasses.length, 1);
});

Then("class is not found in the database", async function() {
    const allClasses = await Class.find({});

    assert.equal(0, allClasses.length);
});

Given("the course was deleted", async function() {
    // Delete the course
    await Course.deleteMany({ _id: this.createdCourseObjectId });
    const theCourse = await Course.find({ _id: this.createdCourseObjectId });

    // Assert that the course was not found, meaning it was deleted.
    assert.strictEqual(theCourse.length, 0);
});

Given("the prof was deleted", async function () {
    // Delete the prof
    await User.deleteMany({ _id: this.createdProfessorObjectId });
    const theProf = await User.find({ _id: this.createdProfessorObjectId });

    // Assert that the prof was not found, meaning they was deleted.
    assert.strictEqual(theProf.length, 0);
});

Then("the prof is not found in the database", async function () {
    // Assert that the prof was not found in the database
    const allUsers = await User.find({ _id: this.createdProfessorObjectId });

    assert.equal(0, allUsers.length);
});