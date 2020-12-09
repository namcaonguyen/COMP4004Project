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
let studentIDWantsToEnrollArray = new Array();

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

Given("{string}s {int} and {int} apply for an account with name {string} and {string}, email {string} and {string}, password {string} and {string}", async function(accountTypeParam, userIndex1Param, userIndex2Param, fullname1Param, fullname2Param, email1Param, email2Param, password1Param, password2Param) {
    // Create the first unapproved User to save to the database.
    const createdUnapprovedUser1 = new User({
        email: email1Param,
        password: password1Param,
        fullname: fullname1Param,
        accountType: accountTypeParam,
        approved: false
	});
    // Create the second unapproved User to save to the database.
    const createdUnapprovedUser2 = new User({
        email: email2Param,
        password: password2Param,
        fullname: fullname2Param,
        accountType: accountTypeParam,
        approved: false
	});

    // Save the unapproved Users to the database.
    // NOTE: In order to mimic simultaneous registrations, we will NOT use the 'await' keyword here!!!
    createdUnapprovedUser1.save();
    createdUnapprovedUser2.save();

    // Wait for the Users to finish trying to register.
    await new Promise(r => setTimeout(r, 100));

    // Store the created User IDs in an array.
    if ( accountTypeParam === 'student' ) {
        studentIDArray[userIndex1Param - 1] = createdUnapprovedUser1._id;
        studentIDArray[userIndex2Param - 1] = createdUnapprovedUser2._id;
	} else if ( accountTypeParam === 'professor' ) {
        professorIDArray[userIndex1Param - 1] = createdUnapprovedUser1._id;
        professorIDArray[userIndex2Param - 1] = createdUnapprovedUser2._id;
	}
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
    const findUser = await User.find( { accountType: accountTypeParam, _id: userObjectID, email: emailParam, password: passwordParam, approved: true } );
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

When("Students {int} and {int} submit for Deliverable {int} a text file with name {string} and {string} and contents {string} and {string}", async function(studentIndex1Param, studentIndex2Param, deliverableIndexParam, fileName1Param, fileName2Param, contents1Param, contents2Param) {
    // Find the Deliverable in the database.
    const findDeliverable = await Deliverable.findById(deliverableIDArray[deliverableIndexParam - 1]);

    // Write both text files that will be used for the Deliverable Submissions.
    fs.writeFileSync("uploads/" + fileName1Param, contents1Param);
    fs.writeFileSync("uploads/" + fileName2Param, contents2Param);

    // Try to update the Deliverable Submission.
    // NOTE: In order to mimic students simultaneously submitting their files, we will NOT use the 'await' keyword here!!!
    var result1 = tryUpdateSubmissionDeliverable(findDeliverable.class_id, studentIDArray[studentIndex1Param - 1], findDeliverable.title, fileName1Param);
    var result2 = tryUpdateSubmissionDeliverable(findDeliverable.class_id, studentIDArray[studentIndex2Param - 1], findDeliverable.title, fileName2Param);

    // Wait for the students to finish submitting.
    await new Promise(r => setTimeout(r, 100));

    // Assert that the Deliverable Submissions went through.
    assert(true, result1);
    assert(true, result2);
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

When("Professor {int} creates Deliverable {int} for Class {int} with title {string}, description {string}, and weight {int}", async function(professorIndexParam, deliverableIndexParam, classIndexParam, titleParam, descriptionParam, weightParam) {
    // Try to create a Deliverable for the Class.
    var result = await tryCreateDeliverable(professorIDArray[professorIndexParam - 1], classIDArray[classIndexParam - 1], titleParam, descriptionParam, weightParam);

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

When("Professor {int} grades Deliverable {int} for Student {int} with a mark of {float}", async function(professorIndexParam, deliverableIndexParam, studentIndexParam, markParam) {
    // Find the Deliverable Submission of the student for this Deliverable in the database.
    const findDeliverableSubmission = await DeliverableSubmission.find( { deliverable_id: deliverableIDArray[deliverableIndexParam - 1], student_id: studentIDArray[studentIndexParam - 1] } );
    // Assert that this Deliverable Submission is in the database.
    assert.strictEqual(1, findDeliverableSubmission.length);


    // Try to grade the Deliverable Submission.
    var result = await trySetSubmissionGrade(professorIDArray[professorIndexParam - 1], findDeliverableSubmission[0]._id, markParam);
    
    // Assert that the Deliverable Submission was succesfully graded.
    assert(!!result.success);
});

// When("Professor calculates a final grade for Student {int} of Class {int}", async function(studentIndexParam, classIndexParam) {
//     // Calculate and a final grade for a student, based on their Deliverable grades.
//     const calculatedFinalGrade = await calculateFinalGrade(classIDArray[classIndexParam - 1], studentIDArray[studentIndexParam - 1]);

//     // Try to submit the student's final grade.
//     var result = await trySubmitFinalGrade(classIDArray[classIndexParam - 1], studentIDArray[studentIndexParam - 1], calculatedFinalGrade);

//     // Assert that the student's final grade was submitted.
//     assert(!!result.success);
// });

Then("Professor {int} and {int} calculate a final grade for student {int} of Class {int} and student {int} of Class {int}", async function(professorIndex1Param, professorIndex2Param, studentIndex1Param, classIndex1Param, studentIndex2Param, classIndex2Param) {
    // Calculate and a final grade for both students, based on their Deliverable grades.
    const calculatedFinalGrade1 = await calculateFinalGrade(classIDArray[classIndex1Param - 1], studentIDArray[studentIndex1Param - 1]);
    const calculatedFinalGrade2 = await calculateFinalGrade(classIDArray[classIndex2Param - 1], studentIDArray[studentIndex2Param - 1]);

    // Try to submit the students' final grade.
    // NOTE: In order to mimic two professors simultaneously submitting the final grades, we do NOT use the 'await' keyword here!!!
    var result1 = trySubmitFinalGrade(classIDArray[classIndex1Param - 1], studentIDArray[studentIndex1Param - 1], calculatedFinalGrade1, professorIDArray[professorIndex1Param - 1]);
    var result2 = trySubmitFinalGrade(classIDArray[classIndex2Param - 1], studentIDArray[studentIndex2Param - 1], calculatedFinalGrade2, professorIDArray[professorIndex2Param - 1]);

    // Wait for the final grades to submit.
    await Promise.all([result1, result2]);
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

Given("Student {int} wants to enroll in Class {int}", async function(studentIndexParam, classIndexParam) {
    // Store the student that wants to enroll in an array.
    studentIDWantsToEnrollArray.push(studentIDArray[studentIndexParam - 1]);
});

When("All students who want to enroll in Class {int} try to enroll at the same time", async function(classIndexParam) {
    // Go through all the students that want to enroll.
    for ( var i = 0; i < studentIDWantsToEnrollArray.length; ++i ) {
        // Try to enroll the student in the Class.
        // NOTE: In order to mimic multiple students trying to enroll at the same time, we will NOT use the 'await' keyword here!!!
        tryEnrollStudentInClass(studentIDWantsToEnrollArray[i], classIDArray[classIndexParam - 1]);
	}

    // Wait for the students to finish trying to enroll.
    await new Promise(r => setTimeout(r, 100));
});

When("All students who want to enroll in Class {int} try to enroll at the same time while student {int} drops the Class", async function(classIndexParam, studentIndexParam) {
    // Try to drop the Class for the student.
    // NOTE: In order to mimic dropping the class while the other students try to enroll at the same time, we will NOT use the 'await' keyword here!!!
    tryDropClassNoDR(studentIDArray[studentIndexParam - 1], classIDArray[classIndexParam - 1]);
    
    // Go through all the students that want to enroll.
    for ( var i = 0; i < studentIDWantsToEnrollArray.length; ++i ) {
        // Try to enroll the student in the Class.
        // NOTE: In order to mimic multiple students trying to enroll at the same time, we will NOT use the 'await' keyword here!!!
        tryEnrollStudentInClass(studentIDWantsToEnrollArray[i], classIDArray[classIndexParam - 1]);
	}

    // Wait for the students to finish trying to enroll.
    await new Promise(r => setTimeout(r, 100));
});

Then("Only {int} of the students that wanted to enroll in Class {int} were able to", async function(expectedEnrollmentsParam, classIndexParam) {
    // Declaration of variable to keep track of the number of successful enrollments.
    var numberOfSuccessfulEnrollments = 0;

    // Go through all the students that tried to enroll.
    for ( var i = 0; i < studentIDWantsToEnrollArray.length; ++i ) {
        // Try to find the student's ClassEnrollment in the database.
        const findClassEnrollment = await ClassEnrollment.find( { student: studentIDWantsToEnrollArray[i], class: classIDArray[classIndexParam - 1] } );
        // If the student was able to enroll in the Class...
        if ( findClassEnrollment.length === 1 ) {
            // Increment the variable.
            ++numberOfSuccessfulEnrollments;
		}
	}

    // Assert that exactly the expected number of students were able to enroll.
    assert.strictEqual(numberOfSuccessfulEnrollments, expectedEnrollmentsParam);
});

Then("No more than {int} of the students that wanted to enroll in Class {int} should have been able to", async function(expectedEnrollmentsParam, classIndexParam) {
    // Declaration of variable to keep track of the number of successful enrollments.
    var numberOfSuccessfulEnrollments = 0;

    // Go through all the students that tried to enroll.
    for ( var i = 0; i < studentIDWantsToEnrollArray.length; ++i ) {
        // Try to find the student's ClassEnrollment in the database.
        const findClassEnrollment = await ClassEnrollment.find( { student: studentIDWantsToEnrollArray[i], class: classIDArray[classIndexParam - 1] } );
        // If the student was able to enroll in the Class...
        if ( findClassEnrollment.length === 1 ) {
            // Increment the variable.
            ++numberOfSuccessfulEnrollments;
		}
	}

    // Assert that no more than the expected number of students were able to enroll.
    // Since actions are being done simultaneously, it's possible that less than the expected number of students were able to enroll if the first student took too long to drop.
    assert.strictEqual(true, numberOfSuccessfulEnrollments <= expectedEnrollmentsParam);
});