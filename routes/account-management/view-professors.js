const express = require("express");
const router = express.Router();
const User = require("../../db/user.js");
const {
    getProfessorList,
    tryToDeleteProfessor
} = require("../../js/accountManagement.js");

// GET View Professors page for administrator Users.
router.get("/", async (req, res) => {
    if (res.locals.user.accountType === "administrator") {
        // Get the list of professor Users.
        var professorUserList = await getProfessorList();

        const data = { title: "View Professors", professors: professorUserList };
        data[res.locals.user.accountType] = true;

        res.render("account-management/view-professors", data);
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// POST View Professors page for administrator Users.
router.post("/", async (req, res) => {
    if (res.locals.user.accountType === "administrator") {

        // Get the professor's User Object ID.
        const professorUserObjectID = req.body.professorObjectID;

        // Try to delete a professor User.
        const { success, error } = await tryToDeleteProfessor(professorUserObjectID);

        // If the professor was not successfully deleted, rerender the page with the error message displayed.
        if (!success) {
            // Get the list of professor Users.
            var professorUserList = await getProfessorList();

            const data = { title: "View Professors", professors: professorUserList, error: error };
            data[res.locals.user.accountType] = true;

            res.render("account-management/view-professors", data)
        } else {
            // Get the list of professor Users.
            var professorUserList = await getProfessorList();

            const data = { title: "View Professors", professors: professorUserList };
            res.render("account-management/view-professors", data);
        }
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

module.exports = router;