const express = require("express");
const router = express.Router();

// GET home page.
router.get("/", (req, res) => {
    var data = { title: "Welcome" };
    data[res.locals.user.accountType] = true;
    res.render("index", data);
});

// GET logout page.
router.get("/logout", (req, res) => {
    res.render("logout");
});

module.exports = router;