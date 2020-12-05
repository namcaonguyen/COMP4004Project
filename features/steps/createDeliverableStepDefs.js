const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const User = require("../../db/user.js");
const Class = require("../../db/class.js");
const Course = require("../../db/course.js");
const Deliverable = require("../../db/deliverable.js");
const {
    tryCreateDeliverable,
    tryToUpdateClassInformation
} = require("../../js/classManagement.js");

Given("The database is empty before creating a deliverable", async function () {
    await Class.deleteMany({}); // delete all classes
    await Course.deleteMany({}); // delete all courses    
    await User.deleteMany({}); // delete all users
    await Deliverable.deleteMany({}); // delete all users

    assert.strictEqual((await Class.find({})).length, 0); // assert that no Classes found, meaning they were all deleted.
    assert.strictEqual((await Course.find({})).length, 0); // assert that no courses found, meaning they were all deleted.
    assert.strictEqual((await User.find({})).length, 0); // assert that no professors were found, meaning they were all deleted.
    assert.strictEqual((await Deliverable.find({})).length, 0); // assert that no professors were found, meaning they were all deleted.
});

Given("There exists a course with course code {string} and title {string}", async function (cCode, courseTitle) {
    // Create user object and save it to the database.
    const createdCourse = new Course({
        courseCode: cCode,
        title: courseTitle
    });

    // Save the user to the database.
    await createdCourse.save();

    // Find the new Course in the database.
    var newCreatedCourse = await Course.find({ _id: createdCourse._id }, function (err, foundCourses) {
        if (err) {
            return console.error(err);
        } else {
            return foundCourses;
        }
    });

    assert.equal(true, newCreatedCourse[0]._id.equals(createdCourse._id));

    this.createdCourseObjectId = createdCourse._id;
});

Given("There exists a class for COMP4004 with {string} as the professor and class capacity of {int}", async function (emailParam, classCapacity) {
    // Try to find the professor with the email in the database.
    const findProf = await User.find( { email: emailParam, accountType: "professor" } );
    
    // Create class object and save it to the database.
    const createdClass = new Class({
        course: this.createdCourseObjectId,
        professor: findProf[0]._id,
        totalCapacity: classCapacity
    });

    // Save the class to the database.
    await createdClass.save();

    // Find the new Course in the database.
    var newCreatedClass = await Class.find({ _id: createdClass._id }, function (err, foundClasses) {
        if (err) {
            return console.error(err);
        } else {
            return foundClasses;
        }
    });

    assert.equal(true, newCreatedClass[0]._id.equals(createdClass._id));

    this.createdClassObjectId = createdClass._id;
});

When("Professor with email {string} tries to create a deliverable for COMP4004 with {string} {string} and {int}", async function (emailParam, deliverableTitle, deliverableDesc, deliverableWeight) {
    // Try to find the professor with the email in the database.
    const findProf = await User.find( { email: emailParam, accountType: 'professor' } );

    // Create deliverable object and save it to the database.
    result = await tryCreateDeliverable(findProf[0]._id, this.createdClassObjectId, deliverableTitle, deliverableDesc, deliverableWeight);
    
    this.createdDeliverableObjectId = result.id;
});

Then("There exists a deliverable for the class with {string} {string} and {int}", async function (deliverableTitle, deliverableDesc, deliverableWeight) {
    // Find all the deliverables with the given attributes.
    const allDeliverables = await Deliverable.find({ _id: this.createdDeliverableObjectId, class_id: this.createdClassObjectId, title: deliverableTitle, description: deliverableDesc, weight: deliverableWeight });

    // Assert that a deliverable was found, meaning it was saved.
    assert.equal(allDeliverables.length, 1);
});

Then("The deliverable does not exist in the database", async function () {
    // Find all the deliverables with the given attributes.
    const allDeliverables = await Deliverable.find({ _id: this.createdDeliverableObjectId });

    // Assert that a deliverable was not found, meaning it was never created.
    assert.equal(allDeliverables.length, 0);
});

Given("The class was deleted", async function () {
    // Delete the class
    await Class.deleteMany({ _id: this.createdClassObjectId });
    const theClass = await Class.find({ _id: this.createdClassObjectId });

    // Assert that the class was not found, meaning they was deleted.
    assert.strictEqual(theClass.length, 0);
});

When("An administrator tries reassign the class to professor with email {string}", async function(emailParam) {
    // Try to find the professor with the email in the database.
    const findProf = await User.find( { email: emailParam } );
    // Try to update the Class information.
    await tryToUpdateClassInformation(this.createdClassObjectId, findProf[0]._id, 50);
});