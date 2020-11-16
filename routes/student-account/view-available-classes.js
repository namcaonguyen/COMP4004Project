const express = require("express");
const router = express.Router();
const User = require("../../db/user.js");
const Class = require("../../db/class.js");
const Course = require("../../db/course.js");
const ClassEnrollment = require("../../db/classEnrollment.js");
const {
    getClassList,
    tryEnrollStudentInClass
} = require("../../js/classEnrollmentManagement.js");

// GET View Available Classes page for student Users.
router.get("/view-available-classes", async (req, res) => {
    if (res.locals.user.accountType === "student") {
        // Get the list of available Classes.
        var classList = await getClassList();

        const data = { title: "View Available Classes", classes: classList };
        data[res.locals.user.accountType] = true;

        res.render("student-account/view-available-classes", data);
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// Middleware to parse the body of the request.
router.use(express.json());
router.use(express.urlencoded( { extended: true } ));

// POST View Available Classes page for student Users.
router.post("/view-available-classes", async (req, res) => {
    if (res.locals.user.accountType === "student") {
        // Get the student User's Object ID.
        var currentUser = await User.find({ email: req.cookies.email, password: req.cookies.password, accountType: 'student' });
        const studentUserObjectID = currentUser[0]._id;

        // Get the Class's Object ID.
        const classObjectID = req.body.classID;

        // Try to create a record for this student's enrollment in the Class.
        const { id, error } = await tryEnrollStudentInClass(studentUserObjectID, classObjectID);

        // If the record was not successfully saved, rerender the page with the error message displayed.
        if ( !id ) {
            // Get the list of available Classes.
            var classList = await getClassList();
            
            const data = { title: "View Available Classes", classes: classList, error: error };
            data[res.locals.user.accountType] = true;
            
            res.render("student-account/view-available-classes", data)  
		} else {
            res.redirect("/");
		}
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

module.exports = router;