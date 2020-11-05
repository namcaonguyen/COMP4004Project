const express = require("express");
const router = express.Router();
const User = require("../db/user.js");

// GET logout page.
router.get("/logout", (req, res) => {
    res.send("Logged out.");
})

// PUT new user.
router.put("/user", (req, res) => {
    res.send("Got a PUT request at /user");
});

// DELETE existing user.
router.delete("/user", (req, res) => {
    res.send("Got a DELETE request at /user");
});

module.exports = router;