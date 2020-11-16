const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const Course = require("../../db/course.js");
const {
    tryCreateCourse, deleteCourse
} = require("../../js/courseManagement.js");

// Set up the MongoDB.
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cmsApp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

let result;

Given("There are no courses in the database", async function () {
    await Course.deleteMany({});
    const allCourses = await Course.find({});
    assert.strictEqual(allCourses.length, 0);
});

When("An admin tries to create a course with code {string} and title {string}", async function (courseCode, title) {
    result = await tryCreateCourse(courseCode, title);
});

Then("A new course is successfully created", () => {
    assert(!!result.id);
});

Then("No new course is created and an error is returned", () => {
    assert(!result.id);
    assert(!!result.error);
});

Then("There exists a course with code {string} and title {string}", async function (courseCode, title) {
    const courses = await Course.find({courseCode, title});
    assert(!!courses.length);
});

Then("There does not exist a course with code {string} and title {string}", async function (courseCode, title) {
    const courses = await Course.find({courseCode, title});
    assert(!courses.length);
});

When("An admin deletes a course with code {string}", async function (courseCode) {
    const courses = await Course.find({courseCode});
    assert.strictEqual(1, courses.length);
    await deleteCourse(courses[0]._id);
});