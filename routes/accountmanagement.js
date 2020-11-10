const express = require("express");
const router = express.Router();
const User = require("../db/user.js");

// GET view account requests page.
router.get("/view-account-requests", (req, res) => {
    if (res.locals.user.accountType === "administrator") {
        var accountList = [];
        var query = { approved: false };
        User.find(query, function(err, result) {
            if (err) {
                throw err;
            }
            for (let i = 0; i < result.length; i++) {
                let user = {};
                user._id = result[i]._id;
                user.email = result[i].email;
                user.fullname = result[i].fullname;
                user.accountType = result[i].accountType;
                accountList.push(user);
            }
        });
        res.render("approveaccounts", { title: "Approve Account Requests" , accounts: accountList });
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// POST view account requests page.
router.post("/view-account-requests", (req, res) => {
    if (res.locals.user.accountType === "administrator") {
        if ("userId" in req.body) {
            var query = { _id: req.body.userId };
            if ("approve" in req.body) {
                var updateValues = { $set: { approved: true }};
                User.update(query, updateValues, function(err) {
                    if (err) {
                        throw err;
                    }
                });
            } else if ("decline" in req.body) {
                User.deleteOne(query, function(err) { 
                    if (err) {
                        throw err;
                    }
                });
            }
            res.redirect("/manage-accounts/view-account-requests");
        }
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// PUT new user.
router.put("/user", (req, res) => {
    res.send("Got a PUT request at /user");
});

// DELETE existing user.
router.delete("/user", (req, res) => {
    res.send("Got a DELETE request at /user");
});

module.exports = router;