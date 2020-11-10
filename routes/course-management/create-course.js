const express = require("express");
const router = express.Router();
const Course = require("../../db/course.js");
const {
    tryCreateCourse
} = require("../../js/courseManagement.js");

// display course creation form
router.get("/", (req, res) => {
    if (res.locals.user.accountType === "administrator") {
        res.render("course-management/create-course");
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// handle course creation request
router.post("/", async (req, res) => {
    if (res.locals.user.accountType === "administrator") {
        const {courseCode, title} = req.body;
        const { id, error } = await tryCreateCourse(courseCode, title);
        if(!id) res.render("course-management/create-course", { error });
        else res.redirect('/view-courses');
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// Middleware to parse the body of the request.
router.use(express.json());
router.use(express.urlencoded( { extended: true } ));

module.exports = router;