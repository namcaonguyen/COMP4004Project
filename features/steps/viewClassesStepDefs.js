const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const User = require("../../db/user.js");
const Class = require("../../db/class.js");
const Course = require("../../db/course.js");
const ClassEnrollment = require("../../db/classEnrollment.js");
const {
    tryCreateClass
} = require("../../js/classManagement.js");
const { tryEnrollStudentInClass, getProfessorClassList, getStudentClassList } = require("../../js/classEnrollmentManagement.js");

let result;

Given("The database is empty", async function () {
    await Class.deleteMany({}); // delete all classes
    await Course.deleteMany({}); // delete all courses    
    await User.deleteMany({}); // delete all users
    
    assert.strictEqual((await Class.find({})).length, 0); // assert that no Classes found, meaning they were all deleted.
    assert.strictEqual((await Course.find({})).length, 0); // assert that no courses found, meaning they were all deleted.
    assert.strictEqual((await User.find({})).length, 0); // assert that no professors were found, meaning they were all deleted.
});

Given("There is a course in the database with code {string} and title {string} before viewing all classes", async function (cCode, cTitle) {
    // Create the Course object to save to the database.
    const createdCourse = new Course({
        courseCode: cCode,
        title: cTitle,
    });

    // Save the course to the database.
    await createdCourse.save();

    // Find the new course in the database.
    var newCreatedCourse = await Course.findById(createdCourse._id);

    assert.equal(newCreatedCourse.courseCode, createdCourse.courseCode);
    assert.equal(newCreatedCourse.title, createdCourse.title);
    assert.equal(true, newCreatedCourse._id.equals(createdCourse._id));
});

Given("There exists an approved {string} in the database named {string} with email {string} and password {string} before viewing all classes", async function (accountTypeParam, userName, userEmail, userPassword) {
    // Create user object and save it to the database.
    const createdUser = new User({
        email: userEmail,
        password: userPassword,
        fullname: userName,
        accountType: accountTypeParam,
        approved: true
    });

    // Save the user to the database.
    await createdUser.save();

    // Find the new User in the database.
    var newCreatedUser = await User.findById(createdUser._id);

    assert.equal(newCreatedUser.fullname, createdUser.fullname);
    assert.equal(newCreatedUser.accountType, createdUser.accountType);
    assert.equal(true, newCreatedUser._id.equals(createdUser._id));
});


When("There exists a class for course code {string} with {string} {int} {string} {string} before viewing all classes", async function (code, classProfessor, classCapacity, classPrereqs, classPrecluded) {
    var course = await Course.find({ courseCode: code });
    var createdUser = await User.find({ fullname: classProfessor });

    // split the prereqs and precluded by ',' into an array and remove the empty strings if any
    setOfPrereqs = classPrereqs.split(",");
    setOfPrecluded = classPrecluded.split(",");

    setOfPrereqs = setOfPrereqs.filter(item => item);
    setOfPrecluded = setOfPrecluded.filter(item => item);

    // Create class object and save it to the database.
    await tryCreateClass(course[0]._id, createdUser[0]._id, classCapacity, setOfPrereqs, setOfPrecluded);
});

When("{string} enrolls in {string}", async function(name, code) {
    var user = await User.find({ fullname: name });
    var course = await Course.find({ courseCode: code });
    var classId = await Class.find({ course: course[0]._id });
    
    await tryEnrollStudentInClass(user[0]._id, classId[0]._id);
});

Then("{string} can see the class in the view classes list", async function (name) {
    // Assert that the user's class was found in the database
    const user = await User.find({ fullname: name });

    const classes = (user[0].accountType === "professor") ? await getProfessorClassList(user[0]._id) : await getStudentClassList(user[0]._id);

    assert.equal(1, classes.length);
});

Then("{string} cannot see the class in the view classes list", async function (name) {
    // Assert that the user's class was not found in the database since they dont have one
    const user = await User.find({ fullname: name });

    const classes = (user[0].accountType === "professor") ? await getProfessorClassList(user[0]._id) : await getStudentClassList(user[0]._id);

    assert.equal(0, classes.length);
});