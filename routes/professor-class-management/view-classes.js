const express = require("express");
const router = express.Router();
const Class = require("../../db/class.js");
const { getProfessorClassList } = require("../../js/classEnrollmentManagement.js");

// display classes
router.get("/", async (req, res) => {
    if (res.locals.user.accountType === "professor") {
        const classes = await getProfessorClassList(res.locals.user._id);
        const data = { classes };

        res.render("professor-class-management/view-classes", data);
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// Middleware to parse the body of the request.
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

module.exports = router;