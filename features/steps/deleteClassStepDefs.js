const Class = require("../../db/class.js");
const Course = require("../../db/course.js");
const User = require("../../db/user.js");
const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const { deleteClass } = require("../../js/classManagement.js");

Then("An Admin deletes a class for course code {string} with {string}", async function (courseCodeString, classProfessorString) {

    const profs = await User.find({ fullname: classProfessorString });
    assert.strictEqual(1, profs.length);
    const professor = profs[0];

    const courses = await Course.find({courseCode: courseCodeString});
    assert.strictEqual(1, courses.length);
    const course = courses[0];

    const allClasses = await Class.find({ course, professor });
    assert.strictEqual(allClasses.length, 1);
    const class_ = allClasses[0];
    
    await deleteClass(class_.id);
});

Then("There does not exist a class for course code {string} with {string}", async function (courseCodeString, classProfessorString) {

    const profs = await User.find({ fullname: classProfessorString });
    assert.strictEqual(1, profs.length);
    const professor = profs[0];

    const courses = await Course.find({courseCode: courseCodeString});
    assert.strictEqual(1, courses.length);
    const course = courses[0];

    const allClasses = await Class.find({ course, professor });
    assert.strictEqual(allClasses.length, 0);
});

Then("The number of classes in the database is {int}", async function (numClasses) {
    const classes = await Class.find({});
    assert.strictEqual(numClasses, classes.length);
});