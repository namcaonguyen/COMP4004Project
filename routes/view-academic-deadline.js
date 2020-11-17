const express = require("express");
const router = express.Router();
const AcademicDeadline = require("../db/academicDeadline.js");
const {
    getAcademicDeadline,
    tryToUpdateAcademicDeadline
} = require("../js/academicDeadlineManagement.js");

// GET View Academic Deadline page for all Users.
router.get("/", async (req, res) => {
    var academicDeadline = await getAcademicDeadline();

    const data = { title: "View Academic Deadline", deadlineDate: academicDeadline[0].date };
    data[res.locals.user.accountType] = true;

    res.render("view-academic-deadline", data);
});

// Middleware to parse the body of the request.
router.use(express.json());
router.use(express.urlencoded( { extended: true } ));

// POST View Academic Deadline page for administrator Users.
router.post("/", async (req, res) => {
    if (res.locals.user.accountType === "administrator") {
        const { year, month, day } = req.body;

        // Try to update the Academic Deadline.
        const { success, errorArray } = await tryToUpdateAcademicDeadline(year, month, day);

        // Get the updated Academic Deadline from the database.
        var academicDeadline = await getAcademicDeadline();

        if ( !success ) {
            // Declaration of variable for an Error Message.
            var errorMessage = "ERROR" + ((errorArray.length > 1) ? "S:\n" : "");
            // Go through all the errors in the Error Array.
            for ( i = 0; i < errorArray.length; ++i ) {
                errorMessage += "- " + errorArray[i] + "\n";
		    }

            var data = { title: "View Academic Deadline", deadlineDate: academicDeadline[0].date, error: errorMessage };
            data[res.locals.user.accountType] = true;
            res.render("view-academic-deadline", data);
		} else {
            var data = { title: "View Academic Deadline", deadlineDate: academicDeadline[0].date };
            data[res.locals.user.accountType] = true;
            res.render("view-academic-deadline", data);
		}

    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

module.exports = router;