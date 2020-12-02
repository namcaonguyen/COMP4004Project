const express = require("express");
const router = express.Router();
const User = require("../../db/user.js");
const {
    getAdministratorList,
    tryToDeleteAdministrator
} = require("../../js/accountManagement.js");

// GET View administrators page for administrator Users.
router.get("/", async (req, res) => {
    if (res.locals.user.accountType === "administrator") {
        // Get the list of admin Users.
        var adminUserList = await getAdministratorList();
        const data = { title: "View Administrators", administrators: adminUserList };
        data[res.locals.user.accountType] = true;

        res.render("account-management/view-administrators", data);
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// POST View administrators page for administrator Users.
router.post("/", async (req, res) => {
    if (res.locals.user.accountType === "administrator") {
        
        // Get the admin's User Object ID.
        const adminUserObjectID = req.body.administratorObjectID;
        const curAdminObjectID = res.locals.user._id;

        // Try to delete an admin User.
        const { success, error } = await tryToDeleteAdministrator(adminUserObjectID, curAdminObjectID);

        // If the admin was not successfully deleted, rerender the page with the error message displayed.
        if (!success) {
            // Get the list of admin Users.
            var adminUserList = await getAdministratorList();

            const data = { title: "View Administrators", administrators: adminUserList, error: error };
            data[res.locals.user.accountType] = true;

            res.render("account-management/view-administrators", data)
        } else {
            // Get the list of admin Users.
            var adminUserList = await getAdministratorList();

            const data = { title: "View Administrators", administrators: adminUserList };
            res.render("account-management/view-administrators", data);
        }
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

module.exports = router;