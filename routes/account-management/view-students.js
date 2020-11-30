const express = require("express");
const router = express.Router();
const User = require("../../db/user.js");
const {
    getStudentList,
    tryToDeleteStudent
} = require("../../js/accountManagement.js");

// GET View Students page for administrator Users.
router.get("/", async (req, res) => {
    if (res.locals.user.accountType === "administrator") {
        // Get the list of student Users.
        var studentUserList = await getStudentList();

        const data = { title: "View Students", students: studentUserList };
        data[res.locals.user.accountType] = true;

        res.render("account-management/view-students", data);
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// POST View Students page for administrator Users.
router.post("/", async (req, res) => {
    if (res.locals.user.accountType === "administrator") {

        // Get the student's User Object ID.
        const studentUserObjectID = req.body.studentObjectID;

        // Try to delete a student User.
        const { success, error } = await tryToDeleteStudent(studentUserObjectID);

        // If the student was not successfully deleted, rerender the page with the error message displayed.
        if ( !success ) {
            // Get the list of student Users.
            var studentUserList = await getStudentList();
            
            const data = { title: "View Students", students: studentUserList, error: error };
            data[res.locals.user.accountType] = true;
            
            res.render("account-management/view-students", data)  
		} else {
            // Get the list of student Users.
            var studentUserList = await getStudentList();
            
            const data = { title: "View Students", students: studentUserList };
            res.render("account-management/view-students", data);
		}
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

module.exports = router;