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

        let error;
        if(!courseCode) error = "Please enter a course code";
        else if(!title) error = "Please enter a course title";
        else {
            const id = await tryCreateCourse(courseCode, title);
            if(!id) error = "Failed, course code already in use";
            else {
                res.redirect('/view-courses');
                return;
            }
        };

        // if error, redisplay page with error
        res.render("course-management/create-course", { error });
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// Middleware to parse the body of the request.
router.use(express.json());
router.use(express.urlencoded( { extended: true } ));

module.exports = router;