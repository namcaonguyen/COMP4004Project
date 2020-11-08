const express = require("express");
const router = express.Router();

// GET home page.
router.get("/", (req, res) => {
    res.render("index", { title: "Welcome" });
});

// GET logout page.
router.get("/logout", (req, res) => {
    res.send("Logged out.");
});

module.exports = router;