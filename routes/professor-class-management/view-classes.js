const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const Class = require("../../db/class.js");
const Deliverable = require("../../db/deliverable.js");
const DeliverableSubmission = require("../../db/deliverableSubmission.js");
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
const { tryCreateDeliverable, tryUpdateSubmissionDeliverable, tryUpdateDeliverable, tryToDeleteDeliverable, tryRetrieveSubmittedDeliverables, getOriginalFileName } = require("../../js/classManagement.js");
const { tryDropClassNoDR, tryDropClassWithDR } = require("../../js/classEnrollmentManagement.js");

const upload = multer({
    storage : multer.diskStorage({
        destination: "uploads/",
        filename: async (req, file, cb) => {
            const user = await User.find({ email: req.cookies.email, password: req.cookies.password });
            const theCourseCode = await getCourseCodeOfClass(req.params.id);
            cb(null, (user[0]._id + "-" + theCourseCode + "-" + (req.params.deliverable || req.body.title) + "-" + file.originalname));
        }
    })
});

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
                res.send("You are not allowed to see this class.");
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

    if(!studentIsEnrolled && req.query.selectedStudent) {
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

    const foundSubmissions = await DeliverableSubmission.find({_id: submission_id});
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
router.post("/:id/create-deliverable", upload.any("deliverable_file"), async (req, res) => {
    if (res.locals.user.accountType === "professor") {
        // Get the current professor User's Object ID.
        var currentProfessor = await User.find( { email: req.cookies.email, password: req.cookies.password, accountType: 'professor' } );
        const professorUserObjectID = currentProfessor[0]._id;

        // Create Deliverable in database
        var fileName = (req.files.length === 0) ? "" : req.files[0].filename;
        var { id, errorArray } = await tryCreateDeliverable(professorUserObjectID, req.body.classId, req.body.title, req.body.description, req.body.weight, fileName, req.body.deadline);

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
    res.locals.deliverable = (await Deliverable.find({ class_id: req.params.id, title: req.params.deliverable }))[0];
    if (!res.locals.deliverable || res.locals.deliverable.is_deleting) {
        res.send("The deliverable you are requesting does not exist for this class.");
    } else {
        res.locals.data = { courseCode: (await getCourseCodeOfClass(req.params.id)), deliverableName: req.params.deliverable, classId: req.params.id, description: res.locals.deliverable.description, deadline: res.locals.deliverable.deadline };
        res.locals.data[res.locals.user.accountType] = true;
        if (res.locals.deliverable.specification_file) // get specification file name
            res.locals.data.specification_file = getOriginalFileName(res.locals.deliverable.specification_file, res.locals.deliverable.title);
        next();
    }
});

// GET view deliverable
router.get("/:id/:deliverable", async (req, res) => {
    var deliverable = res.locals.deliverable, data = res.locals.data;
    data.title = (res.locals.user.accountType === "student") ? "Submit Deliverable" : "Update Deliverable";
    // get submission file name if exists
    let file_name = (await DeliverableSubmission.find({ deliverable_id: res.locals.deliverable._id, student_id: res.locals.user._id }))[0];
    if (file_name) data.file_name = getOriginalFileName(file_name.file_name, deliverable.title);
    res.render("professor-class-management/view-deliverable", data);
});

// POST submit deliverable
router.post("/:id/:deliverable", upload.any("deliverable_file"), async (req, res) => {
    var deliverable = res.locals.deliverable, data = res.locals.data;
    var fileName = (typeof req.files === "undefined" || req.files.length === 0) ? "" : req.files[0].filename;

    data.title = "Failed!";
    if (res.locals.user.accountType === "student") {
        var { result, response } = await tryUpdateSubmissionDeliverable(req.params.id, res.locals.user._id, req.params.deliverable, fileName);
        // get updated submission file name
        let file_name = (await DeliverableSubmission.find({ deliverable_id: res.locals.deliverable._id, student_id: res.locals.user._id }))[0];
        if (file_name) data.file_name = getOriginalFileName(file_name.file_name, deliverable.title);
        if (result) {
            data.title = "Success!";
            data.success = "Successfully submitted deliverable!";
            res.render("professor-class-management/view-deliverable", data);
        } else {
            data.error = "ERROR: Failed to update submission, " + response;
            res.render("professor-class-management/view-deliverable", data);
        }
    } else {
        if ("delete" in req.body) {
            var result = await tryToDeleteDeliverable(deliverable._id);
            if (!result) {
                data.error = "Failed to delete deliverable.";
                res.render("professor-class-management/view-deliverable", data);
                return;
            }
        } else if (!(await tryUpdateDeliverable(req.params.id, req.body.title, req.body.description, fileName, req.body.weight, req.body.deadline))) {
            data.error = "Failed to update deliverable. Please try again.";
            res.render("professor-class-management/view-deliverable", data);
            return;
        }
        res.redirect("/classes/" + req.params.id + "/");
    }
});

// GET submitted deliverables
router.get("/:id/:deliverable/view-deliverable-submissions", async (req, res) => {
    if (res.locals.user.accountType === "professor") {
        var deliverable = res.locals.deliverable, data = res.locals.data;
        data.submissions = await tryRetrieveSubmittedDeliverables(deliverable._id);
        data.title = req.params.deliverable + " Submissions";
        res.render("professor-class-management/view-deliverable-submissions", data);
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// GET file
router.get("/:id/:deliverable/:fileNameOrStudentId", async (req, res) => {
    var deliverable = res.locals.deliverable, data = res.locals.data;
    var spec_file_name = getOriginalFileName(deliverable.specification_file, deliverable.title);

    if (req.params.fileNameOrStudentId === spec_file_name) { // check if the user is trying to download the specification file
        res.sendFile(path.resolve(__dirname + "../../../uploads/" + deliverable.specification_file));
    } else { // if not then either the spec file isn't uploaded or they are requesting for a specific submission file
        var query;
        if (res.locals.user.accountType === "student") { // if the user making the request is a student then they should only be able to download their own submissions
            let fileName = res.locals.user._id + "-" + data.courseCode + "-" + req.params.deliverable + "-" + req.params.fileNameOrStudentId;
            query = { file_name: fileName, student_id: res.locals.user._id };
        } else { // otherwise professors/admins can download any
            query = (req.params.fileNameOrStudentId.includes(".")) ? { file_name: req.params.fileNameOrStudentId } : { student_id: req.params.fileNameOrStudentId };
            query.deliverable_id = deliverable._id;
        }
        try {
            var submission = (await DeliverableSubmission.find(query))[0];
            if (submission) {
                res.download(path.resolve(__dirname + "../../../uploads/" + submission.file_name), getOriginalFileName(submission.file_name, deliverable.title));
                return;
            }
        } catch(err) {
            console.warn("Parameter " + req.params.fileNameOrStudentId + " is not of type ObjectId.");
        }
        res.send("An error has occured, there are a few possible reasons this may have happened:<br>-The requested file does not exist.<br>-You are trying to access a file that you're not eligble to.");
    }
});

module.exports = router;