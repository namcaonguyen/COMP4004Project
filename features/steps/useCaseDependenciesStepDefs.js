const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const AcademicDeadline = require("../../db/academicDeadline.js");
const Class = require("../../db/class.js");
const ClassEnrollment = require("../../db/classEnrollment.js");
const Course = require("../../db/course.js");
const Deliverable = require("../../db/deliverable.js");
const DeliverableSubmission = require("../../db/deliverableSubmission.js");
const User = require("../../db/user.js");
const {
    tryCreateCourse, deleteCourse, tryToUpdateStudentPastCourses
} = require("../../js/courseManagement.js");
const {
    tryCreateClass,
    deleteClass,
    tryCreateDeliverable,
    tryUpdateSubmissionDeliverable,
    tryToUpdateClassInformation
} = require("../../js/classManagement.js");
const {
	tryEnrollStudentInClass,
    tryDropClassNoDR,
	tryDropClassWithDR,
    trySetSubmissionGrade,
    calculateFinalGrade,
    trySubmitFinalGrade
} = require("../../js/classEnrollmentManagement.js");
const {
    tryToDeleteStudent,
    tryToDeleteProfessor
} = require("../../js/accountManagement.js");
const fs = require("fs");

// Set up the MongoDB.
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cmsApp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

// Declaration of array variables to keep track of Object IDs.
let studentIDArray = new Array();
let professorIDArray = new Array();
let courseIDArray = new Array();
let classIDArray = new Array();
let deliverableIDArray = new Array();

Given("{string} {int} applies for an account with name {string}, email {string}, password {string}", async function(accountTypeParam, userIndexParam, fullnameParam, emailParam, passwordParam) {
    // Create an unapproved User to save to the database.
    const createdUnapprovedUser = new User({
        email: emailParam,
        password: passwordParam,
        fullname: fullnameParam,
        accountType: accountTypeParam,
        approved: false
	});

    // Save the unapproved User to the database.
    await createdUnapprovedUser.save();

    // Store the created User ID in an array.
    if ( accountTypeParam === 'student' ) {
        studentIDArray[userIndexParam - 1] = createdUnapprovedUser._id;
	} else if ( accountTypeParam === 'professor' ) {
        professorIDArray[userIndexParam - 1] = createdUnapprovedUser._id;
	}
});

Given("An admin can see the account application for {string} {int}", async function(accountTypeParam, userIndexParam) {
    var userObjectID;
    // Get the User Object ID for the account type.
    if ( accountTypeParam === 'student' ) {
        userObjectID = studentIDArray[userIndexParam - 1];
	} else if ( accountTypeParam === 'professor' ) {
        userObjectID = professorIDArray[userIndexParam - 1];
	}

    // Find the unapproved User in the database.
    const findUser = await User.find( { accountType: accountTypeParam, _id: userObjectID, approved: false } );

    // Assert that one User was found.
    assert.strictEqual(1, findUser.length);
});

Given("An admin rejects the account application for {string} {int}", async function(accountTypeParam, userIndexParam) {
    var userObjectID;
    // Get the User Object ID for the account type.
    if ( accountTypeParam === 'student' ) {
        userObjectID = studentIDArray[userIndexParam - 1];
	} else if ( accountTypeParam === 'professor' ) {
        userObjectID = professorIDArray[userIndexParam - 1];
	}

    // Delete the unapproved account application.
    await User.deleteOne( { _id: userObjectID, accountType: accountTypeParam, approved: false } );

    // Try to find the unapproved User in the database.
    const findUser = await User.find( { accountType: accountTypeParam, _id: userObjectID, approved: false } );
    // Assert that no User was found.
    assert.strictEqual(0, findUser.length);
});

Given("An admin approves the account application for {string} {int}", async function(accountTypeParam, userIndexParam) {
    var userObjectID;
    // Get the User Object ID for the account type.
    if ( accountTypeParam === 'student' ) {
        userObjectID = studentIDArray[userIndexParam - 1];
	} else if ( accountTypeParam === 'professor' ) {
        userObjectID = professorIDArray[userIndexParam - 1];
	}

    // Update the account to approved.
    var updateValues = { $set: { approved: true }};
    await User.updateOne({ accountType: accountTypeParam, _id: userObjectID, approved: false }, updateValues);
});

Given("An admin creates Course {int} for {string} with title {string} and prereqs {string} and precludes {string}", async function(courseIndexParam, courseCodeParam, titleParam, prereqsParam, precludesParam) {
    // Split the prereqs and precludes by ',' into an array and remove the empty strings if any
    setOfPrereqs = prereqsParam.split(",");
    setOfPrecludes = precludesParam.split(",");
    setOfPrereqs = setOfPrereqs.filter(item => item);
    setOfPrecludes = setOfPrecludes.filter(item => item);

    // Try to create the Course.
    var result = await tryCreateCourse(courseCodeParam, titleParam, setOfPrereqs, setOfPrecludes);

    // Assert that the Course was successfully created.
    assert(!!result.id);

    // Store the created Course ID in an array.
    courseIDArray[courseIndexParam - 1] = result.id;
});

Given("An admin creates Class {int} for Course {int} taught by Professor {int} with capacity {int}", async function(classIndexParam, courseIndexParam, professorIndexParam, capacityParam) {
    // Try to create the Class.
    var result = await tryCreateClass(courseIDArray[courseIndexParam - 1], professorIDArray[professorIndexParam - 1], capacityParam);
    
    // Assert that the Class was successfully created.
    assert(!!result.id);

    // Store the created Class ID in an array.
    classIDArray[classIndexParam - 1] = result.id;
});

Given("An admin deletes Course {int}", async function(courseIndexParam) {
    // Try to delete the Course.
    await deleteCourse(courseIDArray[courseIndexParam - 1]);

    // Try to find the Course in the database.
    var findCourse = await Course.find( { _id: courseIDArray[courseIndexParam - 1] } );
    // Assert that no Course was found.
    assert.strictEqual(0, findCourse.length);

    // Try to find a Class for the Course in the database.
    var findClass = await Class.find( { course: courseIDArray[courseIndexParam - 1] } );
    // Assert that no Class was found.
    assert.strictEqual(0, findClass.length);
});

Given("{string} {int} can login with email {string} and password {string}", async function(accountTypeParam, userIndexParam, emailParam, passwordParam) {
    var userObjectID;
    // Get the User Object ID for the account type.
    if ( accountTypeParam === 'student' ) {
        userObjectID = studentIDArray[userIndexParam - 1];
	} else if ( accountTypeParam === 'professor' ) {
        userObjectID = professorIDArray[userIndexParam - 1];
	}

    // Find the User with the info in the database.
    const findUser = await User.find( { accountType: accountTypeParam, _id: userObjectID, email: emailParam, password: passwordParam } );
    // Assert that this User is in the database.
    assert.strictEqual(1, findUser.length);
});

Given("Student {int} edits their past Courses to add {string} and remove {string}", async function(studentIndexParam, coursesToAddParam, coursesToRemoveParam) {
	// Split the Courses string by ',' into an array and remove the empty strings if any.
	setOfCoursesToRemove = coursesToRemoveParam.split(",");
	setOfCoursesToAdd = coursesToAddParam.split(",");
	setOfCoursesToRemove = setOfCoursesToRemove.filter(item => item);
	setOfCoursesToAdd = setOfCoursesToAdd.filter(item => item);

    // Try to update the Courses Taken of the student User.
	var result = await tryToUpdateStudentPastCourses(studentIDArray[studentIndexParam - 1], setOfCoursesToRemove, setOfCoursesToAdd);
    
    // Assert that the student information was successfully updated.
    assert(!!result.success);
});

Given("Student {int} enrolls in Class {int}", async function(studentIndexParam, classIndexParam) {
    // Try to enroll the student in the Class.
    var result = await tryEnrollStudentInClass(studentIDArray[studentIndexParam - 1], classIDArray[classIndexParam - 1]);

    // Assert that the student was enrolled in the Class.
    assert(!!result.id);
});

Given("Student {int} can see Class {int} in their Class list", async function(studentIndexParam, classIndexParam) {
    // Find the ClassEnrollment for the student and the Class.
    const findClassEnrollment = await ClassEnrollment.find( { student: studentIDArray[studentIndexParam - 1], class: classIDArray[classIndexParam - 1] } );
    // Assert that this ClassEnrollment is in the database.
    assert.strictEqual(1, findClassEnrollment.length);
});

Given("Student {int} drops Class {int} with no DR", async function(studentIndexParam, classIndexParam) {
    // Try to drop the Class with no DR.
    var result = await tryDropClassNoDR(studentIDArray[studentIndexParam - 1], classIDArray[classIndexParam - 1]);

    // Assert that the Class was dropped.
    assert(!!result.success);

    // Try to find the ClassEnrollment in the database.
    const findClassEnrollment = await ClassEnrollment.find( { student: studentIDArray[studentIndexParam - 1], class: classIDArray[classIndexParam - 1] } );
    // Assert that no ClassEnrollment was found.
    assert.strictEqual(0, findClassEnrollment.length);
});

Given("An admin cancels Class {int}", async function(classIndexParam) {
    // Delete the Class.
    await deleteClass();
});

When("Professor {int} can see Class {int} in their Class list", async function(professorIndexParam, classIndexParam) {
    // Find the Class which is assigned to the professor.
    const findClass = await Class.find( { _id: classIDArray[classIndexParam - 1], professor: professorIDArray[professorIndexParam - 1] } );
    // Assert that this Class is in the database.
    assert.strictEqual(1, findClass.length);
});

When("The professor creates Deliverable {int} for Class {int} with title {string}, description {string}, and weight {int}", async function(deliverableIndexParam, classIndexParam, titleParam, descriptionParam, weightParam) {
    // Try to create a Deliverable for the Class.
    var result = await tryCreateDeliverable(classIDArray[classIndexParam - 1], titleParam, descriptionParam, weightParam);

    // Assert that the Deliverable was created.
    assert(!!result.id);

    // Store the created Deliverable ID in an array.
    deliverableIDArray[deliverableIndexParam - 1] = result.id;
});

When("Student {int} submits for Deliverable {int} a text file with name {string} and contents {string}", async function(studentIndexParam, deliverableIndexParam, fileNameParam, contentsParam) {
    // Find the Deliverable in the database.
    const findDeliverable = await Deliverable.findById(deliverableIDArray[deliverableIndexParam - 1]);
    
    // Write to a text file.
    fs.writeFileSync("uploads/" + fileNameParam, contentsParam);

    // Try to update the Deliverable Submission.
    assert(true, await tryUpdateSubmissionDeliverable(findDeliverable.class_id, studentIDArray[studentIndexParam - 1], findDeliverable.title, fileNameParam));
});

When("Professor grades Deliverable {int} for Student {int} with a mark of {float}", async function(deliverableIndexParam, studentIndexParam, markParam) {
    // Find the Deliverable Submission of the student for this Deliverable in the database.
    const findDeliverableSubmission = await DeliverableSubmission.find( { deliverable_id: deliverableIDArray[deliverableIndexParam - 1], student_id: studentIDArray[studentIndexParam - 1] } );
    // Assert that this Deliverable Submission is in the database.
    assert.strictEqual(1, findDeliverableSubmission.length);


    // Try to grade the Deliverable Submission.
    var result = await trySetSubmissionGrade(findDeliverableSubmission[0]._id, markParam);

    // Assert that the Deliverable Submission was succesfully graded.
    assert(!!result.success);
});

When("Professor calculates a final grade for Student {int} of Class {int}", async function(studentIndexParam, classIndexParam) {
    // Calculate and a final grade for a student, based on their Deliverable grades.
    const calculatedFinalGrade = await calculateFinalGrade(classIDArray[classIndexParam - 1], studentIDArray[studentIndexParam - 1]);

    // Try to submit the student's final grade.
    var result = await trySubmitFinalGrade(classIDArray[classIndexParam - 1], studentIDArray[studentIndexParam - 1], calculatedFinalGrade);

    // Assert that the student's final grade was submitted.
    assert(!!result.success);
});

Then("Student {int} sees their grade of {float} for Class {int}", async function(studentIndexParam, gradeParam, classIndexParam) {
    // Find the Class Enrollment for the student of the Class in the database.
    const findClassEnrollment = await ClassEnrollment.find( { student: studentIDArray[studentIndexParam - 1], class: classIDArray[classIndexParam - 1] } );

    // Assert that the assigned grade for the Class is equal to what is expected.
    assert.strictEqual(gradeParam.toString(), findClassEnrollment[0].finalGrade);
});

Then("Student {int} drops Class {int} with DR", async function(studentIndexParam, classIndexParam) {
    // Try to drop the Class with DR.
    var result = await tryDropClassWithDR(studentIDArray[studentIndexParam - 1], classIDArray[classIndexParam - 1]);
    
    // Assert that the Class was dropped.
    assert(!!result.success);

    // Try to find the ClassEnrollment in the database, with a final grade of 'WDN'.
    const findClassEnrollment = await ClassEnrollment.find( { student: studentIDArray[studentIndexParam - 1], class: classIDArray[classIndexParam - 1], finalGrade: "WDN" } );
    // Assert that the ClassEnrollment of the dropped Class is still in the database.
    assert.strictEqual(1, findClassEnrollment.length);
});

Then("An admin edits Class {int} to be taught by Professor {int} and have capacity {int}", async function(classIndexParam, professorIndexParam, capacityParam) {
    // Try to update the Class information.
    var result = await tryToUpdateClassInformation(classIDArray[classIndexParam - 1], professorIDArray[professorIndexParam - 1], capacityParam);
    
    // Assert that the Class information was successfully updated.
    assert(!!result.success);
});

Then("An admin deletes {string} {int}", async function(accountTypeParam, userIndexParam) {
    // If the Account Type is a student...
    if ( accountTypeParam === 'student' ) {
        // Try to delete the student User.
        var result = await tryToDeleteStudent(studentIDArray[userIndexParam - 1]);

        // Assert that the student was deleted.
        assert(!!result.success);

        // Try to find any Deliverable Submissions with the deleted student User's ID.
        const findDeliverableSubmissions = await DeliverableSubmission.find( { student_id: studentIDArray[userIndexParam - 1] } );
        // Try to find any Class Enrollments with the deleted student User's ID.
        const findClassEnrollments = await ClassEnrollment.find( { student: studentIDArray[userIndexParam - 1] } );
        // Try to find any Users with the deleted student User's ID.
        const findStudents = await User.find( { _id: studentIDArray[userIndexParam - 1], accountType: "student" } );

        // Assert that nothing pertaining to the student was found in the database.
        assert.strictEqual(0, findDeliverableSubmissions.length);
        assert.strictEqual(0, findClassEnrollments.length);
        assert.strictEqual(0, findStudents.length);

    // If the Account Type is a professor...
	} else if ( accountTypeParam === 'professor' ) {
        // Try to delete the professor User.
        var result = await tryToDeleteProfessor(professorIDArray[userIndexParam - 1]);

        // Assert that the professor was deleted.
        assert(!!result.success);

        // Try to find the professor User in the database.
        const findProfessors = await User.find( { _id: professorIDArray[userIndexParam - 1], accountType: "professor" } );

        // Assert that no professor was found in the database.
        assert.strictEqual(0, findProfessors.length);
	}
});