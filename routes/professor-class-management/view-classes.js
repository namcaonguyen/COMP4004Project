const express = require("express");
const router = express.Router();
const Class = require("../../db/class.js");
const { getProfessorClassList, getStudentClassList, isEnrolled, getCourseCodeOfClass, getDeliverablesOfClass } = require("../../js/classEnrollmentManagement.js");
const { tryCreateDeliverable } = require("../../js/classManagement.js");

// display classes
router.get("/", async (req, res) => {
    const classes = (res.locals.user.accountType === "professor") ? await getProfessorClassList(res.locals.user._id) : await getStudentClassList(res.locals.user._id);
    var data = { title: "Class List", classes };
    data[res.locals.user.accountType] = true;
    
    res.render("professor-class-management/view-classes", data);
});

// get create deliverable
router.get("/create-deliverable", async (req, res) => {
    if (res.locals.user.accountType === "professor") {
        var data = { title: "Create Deliverable", classId: req.query.classId, classCourseCode: req.query.cCode };
        data[res.locals.user.accountType] = true;
        res.render("professor-class-management/create-deliverable", data);
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// POST create deliverable
router.post("/create-deliverable", async (req, res) => {
    if (res.locals.user.accountType === "professor") {
        //tryCreateDeliverable(req.body.classId, req.body.title, req.body.description, req.body.weight);

        //create deliverable in database
        var { id, errorArray } = await tryCreateDeliverable(req.body.classId, req.body.title, req.body.description, req.body.weight);

        if (!id) {
            // Declaration of variable for an Error Message.
            var errorMessage = "ERROR" + ((errorArray.length > 1) ? "S:\n" : "");
            // Go through all the errors in the Error Array.
            for (i = 0; i < errorArray.length; ++i) {
                errorMessage += "- " + errorArray[i] + "\n";
            }

            var data = { title: "Create Deliverable", classId: req.query.classId, classCourseCode: req.query.cCode, error: errorMessage };
            data[res.locals.user.accountType] = true;
            res.render("professor-class-management/create-deliverable", data);
        }
        else res.redirect(req.query.classId);

    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// get specific course
router.get("/:id", async(req, res) => {
    Class.findById(req.params.id, async function(err) {
        if (err) {
            res.send("This class does not exist. If this is a mistake please contact an administrator.");
        } else {
            if (await isEnrolled(res.locals.user._id, req.params.id)) {
                const theCourseCode = await getCourseCodeOfClass(req.params.id);
                const foundDeliverables = await getDeliverablesOfClass(req.params.id);
                var data = { title: "Welcome", cCode: theCourseCode, deliverables: foundDeliverables, classId: req.params.id };
                data[res.locals.user.accountType] = true;
                res.render("view-class", data);
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