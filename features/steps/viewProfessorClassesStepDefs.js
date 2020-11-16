const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const User = require("../../db/user.js");
const Class = require("../../db/class.js");
const Course = require("../../db/course.js");
const {
    tryCreateClass
} = require("../../js/classManagement.js");

const { getProfessorClassList } = require("../../js/classEnrollmentManagement.js");

// Set up the MongoDB.
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cmsApp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

let result;

Given("There are no existing classes in the database before viewing all professor classes", async function () {
    // Delete all classes
    await Class.deleteMany({});
    const allClasses = await Class.find({});

    // Assert that no Classes found, meaning they were all deleted.
    assert.strictEqual(allClasses.length, 0);
});

Given("there are no courses in the database before viewing all professor classes", async function () {
    // Delete all courses
    await Course.deleteMany({});
    const allCourses = await Course.find({});

    // Assert that no courses found, meaning they were all deleted.
    assert.strictEqual(allCourses.length, 0);
});

Given("There is a course in the database with code {string} and title {string} before viewing all professor classes", async function (cCode, cTitle) {
    // Create the Course object to save to the database.
    const createdCourse = new Course({
        courseCode: cCode,
        title: cTitle,
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

Given("there are no professors in the database before viewing all professor classes", async function () {
    // Delete all professors
    await User.deleteMany({ accountType: "professor" });
    const allUsers = await User.find({ accountType: "professor" });

    // Assert that no professors were found, meaning they were all deleted.
    assert.strictEqual(allUsers.length, 0);
});

Given("there exists an approved professor in the database named {string} with email {string} and password {string} before viewing all professor classes", async function (userName, userEmail, userPassword) {
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


When("there exists a class for course code {string} with {string} {int} {string} {string} before viewing all professor classes", async function (classCode, classProfessor, classCapacity, classPrereqs, classPrecluded) {
    // split the prereqs and precluded by ',' into an array and remove the empty strings if any
    setOfPrereqs = classPrereqs.split(",");
    setOfPrecluded = classPrecluded.split(",");

    setOfPrereqs = setOfPrereqs.filter(item => item);
    setOfPrecluded = setOfPrecluded.filter(item => item);

    // Create class object and save it to the database.
    result = await tryCreateClass(this.createdCourseObjectId, this.createdProfessorObjectId, classCapacity, setOfPrereqs, setOfPrecluded);
});

Then("{string} can see the class in the view classes list", async function (profName) {
    // Assert that the profs class was found in the database

    const classes = await getProfessorClassList(this.createdProfessorObjectId);

    assert.equal(1, classes.length);
});

Then("{string} cannot see the class in the view classes list", async function (profName) {
    // Assert that the profs class was not found in the database since they dont have one

    const classes = await getProfessorClassList(this.createdProfessorObjectId);

    assert.equal(0, classes.length);
});