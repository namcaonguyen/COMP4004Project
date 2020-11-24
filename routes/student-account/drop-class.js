const express = require("express");
const router = express.Router();
const User = require("../../db/user.js");
const Class = require("../../db/class.js");
const Course = require("../../db/course.js");
const ClassEnrollment = require("../../db/classEnrollment.js");
const {
    tryDropClassNoDR
} = require("../../js/classEnrollmentManagement.js");

// Middleware to parse the body of the request.
router.use(express.json());
router.use(express.urlencoded( { extended: true } ));

router.post("/", async (req, res) => {
    if (res.locals.user.accountType === "student") {
        // Get the student User's Object ID.
        var currentUser = await User.find({ email: req.cookies.email, password: req.cookies.password, accountType: 'student' });
        const studentUserObjectID = currentUser[0]._id;

        // Get the Class's Object ID.
        const classObjectID = req.body.classID;

        const { id, error } = await tryDropClassNoDR(studentUserObjectID, classObjectID);
        // const { id, error } = await tryDropClassWithDR(studentUserObjectID, classObjectID);
        res.redirect("/classes");
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

module.exports = router;