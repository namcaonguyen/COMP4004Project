const express = require("express");
const router = express.Router();
const User = require("../../db/user.js");
const Course = require("../../db/course.js");
const Class = require("../../db/class.js");
const {
    tryCreateClass
} = require("../../js/classManagement.js");

// display class creation form
router.get("/", async (req, res) => {
    if (res.locals.user.accountType === "administrator") {
        //get list of courses offered
        const coursesList = (await Course.find({})).map(result => {
            const { _id, courseCode, title } = result;
            return { _id, courseCode, title };
        });

        //get list of professors
        const professorList = (await User.find({ approved: true, accountType: "professor" })).map(result => {
            const { _id, email, fullname, accountType } = result;
            return { _id, email, fullname, accountType };
        });

        res.render("class-management/create-class", { title: "Create Class", professors: professorList, courses: coursesList });
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// handle class creation request
router.post("/", async (req, res) => {
    if (res.locals.user.accountType === "administrator") {

        //get input to make the class
        var { course, professor, capacity } = req.body;

        //get list of courses offered
        const coursesList = (await Course.find({})).map(result => {
            const { _id, courseCode, title } = result;
            return { _id, courseCode, title };
        });

        //get list of professors
        const professorList = (await User.find({ approved: true, accountType: "professor" })).map(result => {
            const { _id, email, fullname, accountType } = result;
            return { _id, email, fullname, accountType };
        });

        //create class in database
        var { id, error } = await tryCreateClass(course, professor, capacity);

        if (!id) res.render("class-management/create-class", { error, professors: professorList, courses: coursesList });
        else res.redirect('/view-classes');
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// Middleware to parse the body of the request.
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

module.exports = router;