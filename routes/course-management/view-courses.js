const express = require("express");
const router = express.Router();
const Course = require("../../db/course.js");

// display courses
router.get("/", async (req, res) => {
    if (res.locals.user.accountType === "administrator") {
        const courses = (await Course.find({})).map(result => {
            const {courseCode, title, _id} = result;
            return {courseCode, title, _id};
        });
        res.render("course-management/view-courses", { courses });
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// Middleware to parse the body of the request.
router.use(express.json());
router.use(express.urlencoded( { extended: true } ));

module.exports = router;