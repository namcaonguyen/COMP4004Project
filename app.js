const express = require("express");
const app = express();
const port = 3000;
const hbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

// connect to db
mongoose.connect("mongodb://localhost/cmsApp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

// Require User object used in finding if a user exist when logging in
const User = require("./db/user.js");

// setup handlebar engine
app.engine("hbs", hbs({extname: "hbs", defaultLayout: "layout", layoutsDir: __dirname + "/views/layouts/", partialsDir: __dirname + "/views/partials/"}));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "public"))); // set public folder

// Middleware to parse the body of the request.
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

// POST login page.
app.post("/", (req, res) => {
    var userEmail = req.body.inputEmail;
    var userPassword = req.body.inputPassword;

    // TO-DO: sanitize user input

    // validate login info
    User.find({ email: userEmail, password: userPassword }, function(err, result) {
        if (err) throw err;
        if (result.length === 0 || !result[0].approved) { // return back to login page notifying user of failed validation
            var error = ((result.length === 0) ? "Incorrect email or password." : "Please contact an administrator.");
            res.render("login", { title: "Login", errorMessage: error,  isInvalid: "is-invalid" });
        } else { // serve home page and give credentials back to client to save in cookies
            var data = { title: "Welcome", cookieEmail: result[0].email, cookiePassword: result[0].password };
            data[result[0].accountType] = true;
            res.render("index", data);
        }
    });
});

// The user is not logged in when trying to access the Account Registration.
app.use("/register", require("./routes/accountregistration.js"));

// middleware (this will execute before every route declared after this)
app.use((req, res, next) => {
    // authenticate user
    if ("email" in req.cookies && "password" in req.cookies) {
        User.find({ email: req.cookies.email, password: req.cookies.password }, function(err, result) {
            if (err) throw err;
            if (result.length === 0 || !result[0].approved) {
                var error = ((result.length === 0) ? "Incorrect email or password." : "Please contact an administrator.");
                res.render("login", { title: "Login", errorMessage: error, isInvalid: "is-invalid" });
            } else {
                res.locals.user = result[0];
                next(); // if user credentials are valid then continue to what user was trying to do
            }
        });
    } else {
        res.render("login", { title: "Login" });
    }
});

// Any routes that appear below here will be checked by the middleware first.
app.use("/", require("./routes/index.js"));
app.use("/manage-accounts", require("./routes/accountmanagement.js"));

app.use("/view-courses", require("./routes/course-management/view-courses"));
app.use("/delete-course", require("./routes/course-management/delete-course"));
app.use("/create-course", require("./routes/course-management/create-course"));

app.use("/create-class", require("./routes/class-management/create-class"));

app.use("/student", require("./routes/student-account/view-available-classes"));

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

//{
//    const createdAdmin = new User({
//        email: "admin@admin.com",
//        password: "password",
//        fullname: "admin guy",
//        accountType: "administrator",
//        approved: true
//	});
//    createdAdmin.save(function(err, createdAdmin) {
//        if (err) {
//      return console.error(err);  
//		}
//	});
//}

// Handy dev example, creates a user, course, and class (course instance)
// {
//     const createduser = new user({
//         email: "dan@gmail.com",
//         password: "password",
//         fullname: "dr dan",
//         accounttype: "professor",
//         approved: true
//     });

//     createduser.save(function (err, createduser) {
//         if ( err ) {
//             return console.error(err);
//         }

//         const course = require("./db/course.js");
//         const createdcourse = new course({
//             coursecode: "comp4004",
//             title: "software qa",
//         });

//         createdcourse.save(function (err, createdcourse) {
//             if ( err ) {
//                 return console.error(err);
//             }
            
//             const class = require("./db/class.js");
//             const createdclass = new class({
//                 course: createdcourse,
//                 professor: createduser,
//                 totalcapacity: 69
//             });

//             createdclass.save(function (err, createdclass) {
//                 if ( err ) {
//                     return console.error(err);
//                 }
//             });
//         });
//     });
// }