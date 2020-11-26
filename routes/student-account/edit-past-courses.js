const express = require("express");
const router = express.Router();
const User = require("../../db/user.js");
const Course = require("../../db/course.js");
const {
    removeFromList,
    addToList,
    tryToUpdateStudentPastCourses
} = require("../../js/courseManagement.js");

// GET Edit Past Courses page for student Users.
router.get("/", async (req, res) => {
    if (res.locals.user.accountType === "student") {
        // Get the student User's Object ID.
        var currentUser = await User.find({ email: req.cookies.email, password: req.cookies.password, accountType: 'student' });

        // Get the list of all Course Codes.
        const courseCodeList = (await Course.find({})).map(result => {
            const {courseCode} = result;
            return courseCode;
        });

        // Declaration of variables for the Courses that the student User has not taken.
        var otherCourses = [];
        // Populate the Other Courses array.
        otherCourses = addToList(otherCourses, courseCodeList);

        // Remove the Course Codes for the Courses that the student User has already taken.
        otherCourses = removeFromList(otherCourses, currentUser[0].coursesTaken);

        const data = { title: "Edit Past Courses", studentID: currentUser[0]._id, currentCourses: currentUser[0].coursesTaken, otherCourses: otherCourses };
        data[res.locals.user.accountType] = true;

        res.render("student-account/edit-past-courses", data);
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// POST Edit Past Courses page for student Users.
router.post("/", async (req, res) => {
    if (res.locals.user.accountType === "student") {
        // Declaration of array variables for Courses to add and remove.
        var coursesToRemove = [];
        var coursesToAdd = [];

        // If the student did not select any Courses to remove, then just set it to an empty array.
        if ( req.body.coursesToRemove == undefined ) {
            coursesToRemove = [];
		} else if ( Array.isArray(req.body.coursesToRemove) ) {
            // If multiple Courses were selected, then add them to the list.
            for ( var i = 0; i < req.body.coursesToRemove.length; ++i ) {
                coursesToRemove.push(req.body.coursesToRemove[i]);
			}
		} else {
            // If only one Course was selected, then add it to the list.
            coursesToRemove.push(req.body.coursesToRemove);
		}
        // If the student did not select any Courses to add, then just set it to an empty array.
        if ( req.body.coursesToAdd == undefined ) {
            coursesToAdd = [];
		} else if ( Array.isArray(req.body.coursesToAdd) ) {
            // If multiple Courses were selected, then add them to the list.
            for ( var i = 0; i < req.body.coursesToAdd.length; ++i ) {
                coursesToAdd.push(req.body.coursesToAdd[i]);
			}
		} else {
            // If only one Course was selected, then add it to the list.
            coursesToAdd.push(req.body.coursesToAdd);
		}

        // Try to update the student information with the Courses Taken.
        const { success, error } = await tryToUpdateStudentPastCourses(req.body.studentID, coursesToRemove, coursesToAdd);

        // If no success was returned, then it means that an error occurred.
        if ( !success ) {
            // The only error that can occur here is if the student User's account was deleted, so there is no need to display any Course information.
            const data = { error: error }
            res.render("student-account/edit-past-courses", data);
        } else {
            // Go back to the home page.
            res.redirect('/');
		}

    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

module.exports = router;