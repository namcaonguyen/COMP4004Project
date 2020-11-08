const express = require("express");
const app = express();
const port = 3000;
const hbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");

// routes
const index = require("./routes/index.js");
const accountRegistration = require("./routes/accountregistration.js");

// connect to db
mongoose.connect("mongodb://localhost/cmsApp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

// Require User object used in finding if a user exist when logging in
const User = require("./db/user.js");

// setup handlebar engine
app.engine("hbs", hbs({extname: "hbs", defaultLayout: "layout", layoutsDir: __dirname + "/views/layouts/"}));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "public"))); // set public folder

// Middleware to parse the body of the request.
app.use(express.json());
app.use(express.urlencoded());

// Validates the user email/password when logging in
async function validateLogin(userEmail, userPassword, resp) {
    var findUser = await User.find({ email: userEmail, password: userPassword });

    if (findUser.length > 0) {
        resp.render('administrator_home_page');
        //resp.redirect('administrator_home_page');
    } else {
        // return back to login page notifying user of failed validation
        resp.render("login", { title: "Login", response: "is-invalid" });
    }
}

// POST login page.
app.post("/", (req, res) => {
    
    // validate login info
    var userEmail = req.body.inputEmail;
    var userPassword = req.body.inputPassword;

    validateLogin(userEmail, userPassword, res);
});

// The user is not logged in when trying to access the Account Registration.
app.use("/accountregistration", accountRegistration);

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