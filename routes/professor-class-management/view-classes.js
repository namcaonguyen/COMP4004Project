const express = require("express");
const multer = require("multer");
const router = express.Router();
const Class = require("../../db/class.js");
const Deliverable = require("../../db/deliverable.js");
const ClassEnrollment = require("../../db/classEnrollment.js");
const User = require("../../db/user.js");
const {
    getProfessorClassList,
    getStudentClassList,
    isEnrolled,
    isTeaching,
    getCourseCodeOfClass,
    getDeliverablesOfClass,
    isPastAcademicDeadline,
    trySetSubmissionGrade,
    calculateFinalGrade,
    trySubmitFinalGrade
} = require("../../js/classEnrollmentManagement.js");
const { tryCreateDeliverable, tryUpdateSubmissionDeliverable } = require("../../js/classManagement.js");
const { tryDropClassNoDR, tryDropClassWithDR } = require("../../js/classEnrollmentManagement.js");
const deliverableSubmission = require("../../db/deliverableSubmission.js");

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
    const classID = req.params.id;
    let optionalStudentID = req.query.selectedStudent; // professor page can specify the student in the url
    if(res.locals.user.accountType === "student") optionalStudentID = res.locals.user._id; // student page fills it in automatically


    const data = { title: "Welcome", cCode: await getCourseCodeOfClass(classID), classId: classID };

    const foundEnrollments = await ClassEnrollment.find( { class: classID } );
    let studentIsEnrolled = false;
    data.studentsEnrolled = await Promise.all(foundEnrollments.map(async classEnrollment => {
        const studentID = classEnrollment.student;
        
        if(optionalStudentID && optionalStudentID == studentID) {
            data.finalGrade = classEnrollment.finalGrade;
            studentIsEnrolled = true;
        }

        const user = (await User.find({_id: studentID}))[0];
        const name = user && user.fullname;
        return {
            id: studentID,
            name
        };
    }));

    if(!studentIsEnrolled && optionalStudentID) {
        optionalStudentID = undefined;
        res.redirect(`/classes/${req.params.id}`);
    } else {
        data.deliverables = await getDeliverablesOfClass(classID, optionalStudentID);
        data.displaySubmissions = !!optionalStudentID;
        if(optionalStudentID) data.selectedStudent = optionalStudentID;
        data.withdrawn = data.finalGrade == "WDN";
        data.calculatedGrade = await calculateFinalGrade(classID, optionalStudentID);
        
        data[res.locals.user.accountType] = true;

        res.render("view-class", data);
    }
});

router.post("/:id/updateGrade", async(req, res) => {
    if(res.locals.user.accountType !== "professor") {
        res.redirect(`/classes/${req.params.id}`);
        return;
    }

    let { grade, submission_id, action } = req.body;
    if(action == "Clear") grade = -1;
    else {
        try {
            grade = parseFloat(grade);
        } catch(e) {
            console.warn("Invalid grade submitted, expected string: ", grade);
        }
    }

    const foundSubmissions = await deliverableSubmission.find({_id: submission_id});
    if(!foundSubmissions.length) {
        console.warn(`Warning: Tried to update grade to ${grade} for non-existing submission ${submission_id}, redirecting...`);
        res.redirect(`/classes/${req.params.id}`);
        return;
    }
    if(foundSubmissions.length != 1) console.warn(`Warning: more than submission found with id ${submission_id}`);
    const submission = foundSubmissions[0];
    const { student_id } = submission;

    await trySetSubmissionGrade(submission_id, grade);

    res.redirect(`/classes/${req.params.id}?selectedStudent=${student_id}`);
});

router.post("/:id/submitFinalGrade", async(req, res) => {
    if(res.locals.user.accountType !== "professor") {
        res.redirect(`/classes/${req.params.id}`);
        return;
    }

    const classID = req.params.id;
    let { finalGrade, student_id } = req.body;
    const {success, error} = await trySubmitFinalGrade(classID, student_id, finalGrade);
    if(!success) console.warn(error);

    res.redirect(`/classes/${classID}?selectedStudent=${student_id}`);
});

// get create deliverable
router.get("/:id/create-deliverable", async (req, res) => {
    if (res.locals.user.accountType === "professor") {
        const theCourseCode = await getCourseCodeOfClass(req.params.id);
        var data = { title: "Create Deliverable", classId: req.params.id, courseCode: theCourseCode, classId: req.params.id, create: true, deliverableName: "Create Deliverable" };
        data[res.locals.user.accountType] = true;
        res.render("professor-class-management/view-deliverable", data);
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// POST create deliverable
router.post("/:id/create-deliverable", async (req, res) => {
    if (res.locals.user.accountType === "professor") {
        //create deliverable in databas
        // TO-DO: Use multer parser later when file submission for deliverable specification is being implemented.
        var { id, errorArray } = await tryCreateDeliverable(req.body.classId, req.body.title, req.body.description, req.body.weight);

        if (!id) {
            // Declaration of variable for an Error Message.
            var errorMessage = "ERROR" + ((errorArray.length > 1) ? "S:\n" : "");
            // Go through all the errors in the Error Array.
            for (i = 0; i < errorArray.length; ++i) {
                errorMessage += "- " + errorArray[i] + "\n";
            }

            const theCourseCode = await getCourseCodeOfClass(req.params.id);
            var data = { title: "Create Deliverable", classId: req.params.id, courseCode: theCourseCode, error: errorMessage, create: true, deliverableName: "Create Deliverable" };
            data[res.locals.user.accountType] = true;
            res.render("professor-class-management/view-deliverable", data);
        } else {
            res.redirect("/classes/" + req.params.id);
        }
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// middleware to ensure the deliverable exists before moving on.
router.use("/:id/:deliverable", async (req, res, next) => {
    if ((await Deliverable.find({ class_id: req.params.id, title: req.params.deliverable })).length === 0) {
        res.send("The deliverable you are requesting does not exist for this class.");
    } else {
        next();
    }
})

// GET view deliverable
router.get("/:id/:deliverable", async (req, res) => {
    const theCourseCode = await getCourseCodeOfClass(req.params.id);
    var data = { title: "Submit Deliverable", courseCode: theCourseCode, deliverableName: req.params.deliverable, classId: req.params.id };
    data[res.locals.user.accountType] = true;
    res.render("professor-class-management/view-deliverable", data);
});

// POST submit deliverable
router.post("/:id/:deliverable", async (req, res) => {
    const theCourseCode = await getCourseCodeOfClass(req.params.id);
    var data = { courseCode: theCourseCode, deliverableName: req.params.deliverable, classId: req.params.id };
    data[res.locals.user.accountType] = true;

    if (res.locals.user.accountType === "student") {
        // TO-DO: Deliverable Deadline

        var fileName = res.locals.user._id + "-" + theCourseCode + "-" + req.params.deliverable + "-";
        var storage = multer.diskStorage({
            destination: "uploads/",
            filename: function (req, file, cb) {
                fileName += file.originalname;
                cb(null, fileName);
            }
        });
        var upload = multer({ storage : storage }).any();

        upload(req, res, function(err) {
            if(!err && tryUpdateSubmissionDeliverable(req.params.id, res.locals.user._id, req.params.deliverable, fileName)) {
                data.title = "Submitted!";
                data.success = "Successfully submitted deliverable!";
                res.render("professor-class-management/view-deliverable", data);
            } else {
                data.title = "Failed!";
                data.error = "Failed to update deliverable submission. Please try again.";
                res.render("professor-class-management/view-deliverable", data);
            }
        });
    } else {
        if ("delete" in req.body) {
            // TO-DO: remove deliverable
            res.redirect("/classes/" + req.params.id + "/");
        } else {
            // TO-DO: update deliverable
            data.title = "Updated!";
            data.success = "Successfully updated deliverable!";
            res.render("professor-class-management/view-deliverable", data);
        }
    }
});

module.exports = router;