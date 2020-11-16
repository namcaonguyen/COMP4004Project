const express = require("express");
const router = express.Router();
const Class = require("../../db/class.js");
const { getClassList } = require("../../js/classEnrollmentManagement.js");

// display classes
router.get("/", async (req, res) => {
    if (res.locals.user.accountType === "administrator") {
        const classes = await getClassList();
        
        const data = { classes };
        data[res.locals.user.accountType] = true;

        res.render("course-management/view-classes", data);
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// Middleware to parse the body of the request.
router.use(express.json());
router.use(express.urlencoded( { extended: true } ));

module.exports = router;