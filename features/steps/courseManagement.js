const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const Course = require("../../db/course.js");
const {
    tryCreateCourse
} = require("../../js/courseManagement.js");

// Set up the MongoDB.
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cmsApp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

Given("There are no courses in the database", async function () {
    await Course.deleteMany({});
    const allCourses = await Course.find({});
    assert.strictEqual(allCourses.length, 0);
});

When("A course is created with code {string} and title {string}", async function (courseCode, title) {
    const courseId = await tryCreateCourse(courseCode, title);
    assert(courseId);
});

When("There exists a course with code {string} and title {string}", async function (courseCode, title) {
    const courses = await Course.find({courseCode, title});
    assert(!!courses.length);
});
