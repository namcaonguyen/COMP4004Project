const express = require("express");
const router = express.Router();
const Busboy = require("busboy");
const Class = require("../../db/class.js");
const { getProfessorClassList, getStudentClassList, isEnrolled, isTeaching, getCourseCodeOfClass, getDeliverablesOfClass, isPastAcademicDeadline } = require("../../js/classEnrollmentManagement.js");
const { tryCreateDeliverable } = require("../../js/classManagement.js");
const { tryDropClassNoDR, tryDropClassWithDR } = require("../../js/classEnrollmentManagement.js");

// Middleware to parse the body of the request.
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// display classes

async function renderClasses(req, res, data={}) {
    data.title = "Class List";
    data.classes = (res.locals.user.accountType === "professor") ? await getProfessorClassList(res.locals.user._id) : await getStudentClassList(res.locals.user._id);
    data[res.locals.user.accountType] = true;
    data.deadlinePassed = await isPastAcademicDeadline();
    res.render("professor-class-management/view-classes", data);
}

router.get("/", async (req, res) => {
    await renderClasses(req, res);
});

router.post("/", async (req, res) => {
    const data = {};

    let dropNoDR, dropWithDR;
    {
        const action = req.body.action;
        dropNoDR = action == "drop-no-dr";
        dropWithDR = action == "drop-with-dr";
    }
    if(dropNoDR || dropWithDR) {
        if (res.locals.user.accountType === "student") {
            const studentID = res.locals.user._id;
            const classID = req.body.classID;

            const { success, error } = await (
                (dropNoDR ? tryDropClassNoDR : tryDropClassWithDR)(studentID, classID)
            );
            if(!success) data.error = error;
        } else {
            res.render("forbidden", { title: "Access Denied" });
        }
    }

    await renderClasses(req, res, data);
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

// middleware to check wether the class a user requested is valid or if the user is authorized to interact with it.
router.use("/:id", (req, res, next) => {
    Class.findById(req.params.id, async function(err) {
        if (err) {
            res.send("This class does not exist. If this is a mistake please contact an administrator.");
        } else {
            if (await isEnrolled(res.locals.user._id, req.params.id) || await isTeaching(res.locals.user._id, req.params.id)) {
                next();
            } else {
                res.send("You are not enrolled in this class.");
            }
        }
    });
});

// GET specific course
router.get("/:id", async(req, res) => {
    const theCourseCode = await getCourseCodeOfClass(req.params.id);
    const foundDeliverables = await getDeliverablesOfClass(req.params.id);
    var data = { title: "Welcome", cCode: theCourseCode, deliverables: foundDeliverables, classId: req.params.id };
    data[res.locals.user.accountType] = true;
    res.render("view-class", data);
});

// GET view deliverable
router.get("/:id/:deliverable", async (req, res) => {
    if ((await Deliverable.find({ class_id: req.params.id, title: req.params.deliverable })).length === 0) {
        res.send("The deliverable you are requesting does not exist for this class.");
    } else {
        const theCourseCode = await getCourseCodeOfClass(req.params.id);
        var data = { title: "Submit Deliverable", courseCode: theCourseCode, deliverableName: req.params.deliverable, classId: req.params.id };
        data[res.locals.user.accountType] = true;
        res.render("professor-class-management/view-deliverable", data);
    }
});

// POST submit deliverable
router.post("/:id/:deliverable", async (req, res) => {
    // ***** WIP ***** //
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log(file);
        console.log(filename);
        console.log(encoding);
        console.log(mimetype);
    });
    const theCourseCode = await getCourseCodeOfClass(req.params.id);
    var data = { title: "Submitted!", courseCode: theCourseCode, deliverableName: req.params.deliverable, classId: req.params.id, success: "Successfully submitted deliverable!" };
    data[res.locals.user.accountType] = true;
    res.render("professor-class-management/view-deliverable", data);
    // ***** WIP ***** //
});

module.exports = router;