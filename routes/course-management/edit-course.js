const express = require("express");
const router = express.Router();
const User = require("../../db/user.js");
const Course = require("../../db/course.js");
const {
    removeFromList,
    addToList,
    tryToUpdateCourseInformation
} = require("../../js/courseManagement.js");

// GET Edit Course page for administrator Users.
router.get("/", async (req, res) => {
    if (res.locals.user.accountType === "administrator") {
        // Get the Course object for the chosen Course Object ID.
        const foundCourse = await Course.find( { _id: req.query.courseID } );

        // Get the list of all Course Codes.
        const courseCodeList = (await Course.find({})).map(result => {
            const {courseCode} = result;
            return courseCode;
        });

        // Declaration of variables for the prereqs and precludes that are not associated with the Course.
        var otherPrereqs = [];
        var otherPrecludes = [];
        // Populate the other prereqs and other precludes arrays.
        otherPrereqs = addToList(otherPrereqs, courseCodeList);
        otherPrecludes = addToList(otherPrecludes, courseCodeList);

        // Remove the Course Codes for the prereqs and precludes that are already associated with the Course.
        otherPrereqs = removeFromList(otherPrereqs, foundCourse[0].prereqs);
        otherPrecludes = removeFromList(otherPrecludes, foundCourse[0].precludes);
        // Remove the Course Code for the current Course Object.
        otherPrereqs = removeFromList(otherPrereqs, [foundCourse[0].courseCode]);
        otherPrecludes = removeFromList(otherPrecludes, [foundCourse[0].courseCode]);

        const data = { title: "Edit Course", courseID: req.query.courseID, courseCode: foundCourse[0].courseCode, title: foundCourse[0].title, 
            currentPrereqs: foundCourse[0].prereqs, otherPrereqs: otherPrereqs, currentPrecludes: foundCourse[0].precludes, otherPrecludes: otherPrecludes };
        data[res.locals.user.accountType] = true;

        res.render("course-management/edit-course", data);
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// POST Edit Course page for administrator Users.
router.post("/", async (req, res) => {
    if (res.locals.user.accountType === "administrator") {
        // Declaration of array variables for prerequisites and precludes to add and remove.
        var prereqsToRemove = [];
        var precludesToRemove = [];
        var prereqsToAdd = [];
        var precludesToAdd = [];

        // If the administrator did not select any prereqs to remove, then just set it to an empty array.
        if ( req.body.prereqsToRemove == undefined ) {
            prereqsToRemove = [];
		} else if ( Array.isArray(req.body.prereqsToRemove) ) {
            // If multiple prereqs were selected, then add them to the list.
            for ( var i = 0; i < req.body.prereqsToRemove.length; ++i ) {
                prereqsToRemove.push(req.body.prereqsToRemove[i]);
			}
		} else {
            // If only one prereq was selected, then add it to the list.
            prereqsToRemove.push(req.body.prereqsToRemove);
		}
        // If the administrator did not select any precludes to remove, then just set it to an empty array.
        if ( req.body.precludesToRemove == undefined ) {
            precludesToRemove = [];
		} else if ( Array.isArray(req.body.precludesToRemove) ) {
            // If multiple precludes were selected, then add them to the list.
            for ( var i = 0; i < req.body.precludesToRemove.length; ++i ) {
                precludesToRemove.push(req.body.precludesToRemove[i]);
			}
		} else {
            // If only one prereq was selected, then add it to the list.
            precludesToRemove.push(req.body.precludesToRemove);
		}
        // If the administrator did not select any prereqs to add, then just set it to an empty array.
        if ( req.body.prereqsToAdd == undefined ) {
            prereqsToAdd = [];
		} else if ( Array.isArray(req.body.prereqsToAdd) ) {
            // If multiple prereqs were selected, then add them to the list.
            for ( var i = 0; i < req.body.prereqsToAdd.length; ++i ) {
                prereqsToAdd.push(req.body.prereqsToAdd[i]);
			}
		} else {
            // If only one prereq was selected, then add it to the list.
            prereqsToAdd.push(req.body.prereqsToAdd);
		}
        // If the administrator did not select any precludes to add, then just set it to an empty array.
        if ( req.body.precludesToAdd == undefined ) {
            precludesToAdd = [];
		} else if ( Array.isArray(req.body.precludesToAdd) ) {
            // If multiple precludes were selected, then add them to the list.
            for ( var i = 0; i < req.body.precludesToAdd.length; ++i ) {
                precludesToAdd.push(req.body.precludesToAdd[i]);
			}
		} else {
            // If only one prereq was selected, then add it to the list.
            precludesToAdd.push(req.body.precludesToAdd);
		}

        // Try to update the Course information.
        const { success, errorArray } 
            = await tryToUpdateCourseInformation(req.body.courseID, req.body.title, prereqsToRemove, precludesToRemove, prereqsToAdd, precludesToAdd);

        // If no success was returned, then it means that an error occurred.
        if ( !success ) {
            // Get the Course object for the chosen Course Object ID.
            const foundCourse = await Course.find( { _id: req.body.courseID } );
            
            // Declaration of variable for an Error Message.
            var errorMessage = "ERROR" + ((errorArray.length > 1) ? "S:\n" : "");
            // Go through all the errors in the Error Array.
            for ( i = 0; i < errorArray.length; ++i ) {
                errorMessage += "- " + errorArray[i] + "\n";
		    }

            // Get the list of all Course Codes.
            const courseCodeList = (await Course.find({})).map(result => {
                const {courseCode} = result;
                return courseCode;
            });

            // Declaration of variables for the prereqs and precludes that are not associated with the Course.
            var otherPrereqs = [];
            var otherPrecludes = [];
            // Populate the other prereqs and other precludes arrays.
            otherPrereqs = addToList(otherPrereqs, courseCodeList);
            otherPrecludes = addToList(otherPrecludes, courseCodeList);

            // Remove the Course Codes for the prereqs and precludes that are already associated with the Course.
            otherPrereqs = removeFromList(otherPrereqs, foundCourse[0].prereqs);
            otherPrecludes = removeFromList(otherPrecludes, foundCourse[0].precludes);
            // Remove the Course Code for the current Course Object.
            otherPrereqs = removeFromList(otherPrereqs, [foundCourse[0].courseCode]);
            otherPrecludes = removeFromList(otherPrecludes, [foundCourse[0].courseCode]);

            const data = { error: errorMessage, courseID: req.query.courseID, courseCode: foundCourse[0].courseCode, title: foundCourse[0].title,
                currentPrereqs: foundCourse[0].prereqs, otherPrereqs: otherPrereqs, currentPrecludes: foundCourse[0].precludes, otherPrecludes: otherPrecludes };
            data[res.locals.user.accountType] = true;

            // Rerender the page with the error message.
            res.render("course-management/edit-course", data);
		} else {
            res.redirect("/view-courses");
		}
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

module.exports = router;