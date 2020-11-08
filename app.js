const express = require("express");
const app = express();
const port = 3000;
const hbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");

// routes
const index = require("./routes/index.js");
const accountRegistration = require("./routes/accountregistration.js");
const accountMangement = require("./routes/accountmanagement.js");

// connect to db
mongoose.connect("mongodb://localhost/cmsApp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

// setup handlebar engine
app.engine("hbs", hbs({extname: "hbs", defaultLayout: "layout", layoutsDir: __dirname + "/views/layouts/"}));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "public"))); // set public folder

// POST login page.
app.post("/", (req, res) => {
    // validate login info

    // return back to login page notifying user of failed validation
    res.render("login", { title: "Login", response: "is-invalid" });
});

// The user is not logged in when trying to access the Account Registration.
app.use("/register", accountRegistration);

// middleware (this will execute before every route declared after this)
app.use((req, res, next) => {
    // is user logged in?
    var loggedIn = false; // ***** fake check, remove later *****

    // if not then request login
    if (!loggedIn) res.render("login", { title: "Login" });
    else next(); // otherwise continue to what user was trying to do
});

// Any routes that appear below here will be checked by the middleware first.
app.use("/", index);
app.use("/account-management", accountMangement);
/*
 *
 * Add more routes here
 *
 */

// catch error and forward it to handler
app.use((req, res, next) => {
    var err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// handler
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.render("error", { title: "Something went wrong", errorStatus: err.status, errorMessage: err.message });
});

// start server
app.listen(port, () => {
    console.log(`\nSERVER: Successfully running on http://127.0.0.1:${port}/`);
	console.log(`SERVER: Ctrl-C to shutdown the server gracefully.\n`);
});

// handle CTRL-C SIGINT signal
process.on("SIGINT", () => {
	console.log("\nSERVER: Shutting down with SIGINT signal.");
	process.exit(1);
});