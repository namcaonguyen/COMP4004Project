const express = require("express");
const router = express.Router();
const Class = require("../../db/class.js");
const { getProfessorClassList, getStudentClassList, isEnrolled } = require("../../js/classEnrollmentManagement.js");

// display classes
router.get("/", async (req, res) => {
    const classes = (res.locals.user.accountType === "professor") ? await getProfessorClassList(res.locals.user._id) : await getStudentClassList(res.locals.user._id);
    var data = { title: "Class List", classes };
    data[res.locals.user.accountType] = true;
    
    res.render("professor-class-management/view-classes", data);
});

// get specific course
router.get("/:id", async(req, res) => {
    Class.findById(req.params.id, function(err) {
        if (err) {
            res.send("This class does not exist. If this is a mistake please contact an administrator.");
        } else {
            if (isEnrolled(res.locals.user._id, req.params.id)) {
                res.render("view-class", { title: "Welcome" });
            } else {
                res.send("You are not enrolled in this class.");
            }
        }
    });
});

// Middleware to parse the body of the request.
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

module.exports = router;