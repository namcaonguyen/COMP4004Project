const express = require("express");
const router = express.Router();
const Course = require("../../db/course.js");
const { deleteClass } = require("../../js/classManagement.js");

// delete course
router.post("/", (req, res) => {
    if (res.locals.user.accountType === "administrator") {
        const classID = req.body.delete;
        deleteClass(classID);
        res.redirect("/view-classes");
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// Middleware to parse the body of the request.
router.use(express.json());
router.use(express.urlencoded( { extended: true } ));

module.exports = router;