const express = require("express");
const router = express.Router();
const User = require("../../db/user.js");
const Course = require("../../db/course.js");
const Class = require("../../db/class.js");
const {
    tryToUpdateClassInformation
} = require("../../js/classManagement.js");

// GET Edit Class page for administrator Users.
router.get("/", async (req, res) => {
    if (res.locals.user.accountType === "administrator") {
        // Get the Class object for the chosen ID.
        const foundClass = await Class.find( { _id: req.query.classID } );

        // Get the Course Code of the Class.
        const foundCourse = await Course.find( { _id: foundClass[0].course } );

        // Get a list of professor Users.
        const professorList = (await User.find({ approved: true, accountType: "professor" })).map(result => {
            const { _id, email, fullname, accountType } = result;
            var currentProfessor = false;
            if ( _id === foundClass[0].professor ) {
                currentProfessor = true;
			}
            return { _id, email, fullname, accountType, currentProfessor };
        });

        const data = { title: "Edit Class", classID: req.query.classID, courseCode: foundCourse[0].courseCode, professors: professorList, classCapacity: foundClass[0].totalCapacity };
        data[res.locals.user.accountType] = true;

        res.render("class-management/edit-class", data);
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// POST Edit Class page for administrator Users.
router.post("/", async (req, res) => {
    if (res.locals.user.accountType === "administrator") {
        // Try to update the Class information.
        const { success, errorArray } = await tryToUpdateClassInformation(req.body.classID, req.body.professor, req.body.capacity);

        // If no success was returned, then it means that an error occurred.
        if ( !success ) {
            // Get the Class object for the chosen ID.
            const foundClass = await Class.find( { _id: req.body.classID } );

            // Get a list of professor Users.
            const professorList = (await User.find({ approved: true, accountType: "professor" })).map(result => {
                const { _id, email, fullname, accountType } = result;
                return { _id, email, fullname, accountType };
            });

            // Get the Course Code of the Class.
            const foundCourse = await Course.find( { _id: foundClass[0].course } );
            
            // Declaration of variable for an Error Message.
            var errorMessage = "ERROR" + ((errorArray.length > 1) ? "S:\n" : "");
            // Go through all the errors in the Error Array.
            for ( i = 0; i < errorArray.length; ++i ) {
                errorMessage += "- " + errorArray[i] + "\n";
		    }

            const data = { error: errorMessage, classID: req.body.classID, courseCode: foundCourse[0].courseCode, professors: professorList, classCapacity: foundClass[0].totalCapacity };
            data[res.locals.user.accountType] = true;

            // Rerender the page with the error message.
            res.render("class-management/edit-class", data);
		} else {
            res.redirect("/view-classes");
		}
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

module.exports = router;