const express = require("express");
const router = express.Router();
const Course = require("../../db/course.js");
const { deleteCourse } = require("../../js/courseManagement.js");

// delete course
router.post("/", (req, res) => {
    if (res.locals.user.accountType === "administrator") {
        const courseID = req.body.delete;
        deleteCourse(courseID);
        res.redirect("/view-courses");
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// Middleware to parse the body of the request.
router.use(express.json());
router.use(express.urlencoded( { extended: true } ));

module.exports = router;