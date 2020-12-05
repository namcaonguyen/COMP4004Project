const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const User = require("../../db/user.js");
const Class = require("../../db/class.js");
const ClassEnrollment = require("../../db/classEnrollment.js");
const Course = require("../../db/course.js");
const Deliverable = require("../../db/deliverable.js");
const DeliverableSubmission = require("../../db/deliverableSubmission.js");
const { tryCreateClass, tryCreateDeliverable, tryUpdateDeliverable, tryToDeleteDeliverable } = require("../../js/classManagement.js");
const { tryCreateCourse } = require("../../js/courseManagement.js");
const { deleteClass } = require("../../js/classManagement.js");

async function WipeDB() {
    await Class.deleteMany({}); // delete all classes
    await Course.deleteMany({}); // delete all courses    
    await User.deleteMany({}); // delete all users
    await Deliverable.deleteMany({}); // delete all deliverables
    await DeliverableSubmission.deleteMany({}); // delete all deliverable submissions
}

Given("A professor creates a deliverable with info {string} {string} {int}", async function (title, description, weight) {
    await WipeDB();
    this.course = await tryCreateCourse("COMP1405", "Introduction To Computer Science I", [], []);
    this.professor = await new User({ email: "jp@cms.com", password: "password", fullname: "Jean-Pierre Corriveau", accountType: "professor", approved: true }).save();
    this.class = await tryCreateClass(this.course.id, this.professor._id, 10);
    this.deliverable = await tryCreateDeliverable(this.professor._id, this.class.id, title, description, weight);
    assert.strictEqual(true, !!this.deliverable.id);
});

When("The professor updates the deliverable {string} to {string}", async function (info, newValue) {
    var response;
    if (info === "title") response = await tryUpdateDeliverable(this.class.id, newValue, this.deliverable.description, "", this.deliverable.weight);
    else if (info === "description") response = await tryUpdateDeliverable(this.class.id, this.deliverable.title, newValue, "", this.deliverable.weight);
    else if (info === "weight") response = await tryUpdateDeliverable(this.class.id, this.deliverable.title, this.deliverable.description, "", newValue);
    else {
        assert(false);
        return;
    }
    assert.strictEqual(true, response);
});

When("The professor deletes that deliverable", async function() {
    assert.strictEqual(true, (await tryToDeleteDeliverable(this.deliverable.id)));
});

Then("The deliverable should not exist anymore in the database", async function() {
    assert.strictEqual(null, (await Deliverable.findById(this.deliverable.id)));
});

Then("The deliverable {string} should now be {string}", async function (info, value) {
    assert.strictEqual(value, (await Deliverable.findById(this.deliverable.id))[info]);
});

Then("The deliverable weight should still be {int}", async function (value) {
    assert.strictEqual(value, (await Deliverable.findById(this.deliverable.id)).weight);
});

Given("The professor tries to delete that deliverable again", async function () {
    var success = await tryToDeleteDeliverable(this.deliverable.id);
    this.success = success;
});

Given("The professor tries to delete that deliverable", async function () {
    var success = await tryToDeleteDeliverable(this.deliverable.id);
    this.success = success;
});

Then("The result is a unsuccessful delete attempt", async function () {
    assert.strictEqual(false, this.success);
});

When("An administrator deletes the class", async function () {
    await deleteClass(this.class.id);
    assert.strictEqual(0, (await Class.find({ _id: this.class.id })).length);
});