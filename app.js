const express = require("express");
const app = express();
const port = 3000;
const hbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// connect to db
mongoose.connect("mongodb://localhost/cmsApp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

// Require User object used in finding if a user exist when logging in
const User = require("./db/user.js");
// Require Academic Deadline object.
const AcademicDeadline = require("./db/academicDeadline.js");

// setup handlebar engine
app.engine("hbs", hbs({extname: "hbs", defaultLayout: "layout", layoutsDir: __dirname + "/views/layouts/", partialsDir: __dirname + "/views/partials/"}));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "public"))); // set public folder

// Middleware to parse the body of the request.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
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
app.use("/manage-accounts", require("./routes/account-management/accountmanagement.js"));
app.use("/view-students", require("./routes/account-management/view-students.js"));
app.use("/view-professors", require("./routes/account-management/view-professors.js"));

app.use("/view-courses", require("./routes/course-management/view-courses"));
app.use("/view-classes", require("./routes/course-management/view-classes"));
app.use("/delete-course", require("./routes/course-management/delete-course"));
app.use("/delete-class", require("./routes/course-management/delete-class"));
app.use("/create-course", require("./routes/course-management/create-course"));
app.use("/edit-course", require("./routes/course-management/edit-course"));

app.use("/classes", require("./routes/professor-class-management/view-classes"));

app.use("/create-class", require("./routes/class-management/create-class"));
app.use("/edit-class", require("./routes/class-management/edit-class"));

app.use("/student", require("./routes/student-account/view-available-classes"));
app.use("/edit-past-courses", require("./routes/student-account/edit-past-courses"));

app.use("/view-academic-deadline", require("./routes/view-academic-deadline.js"));

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

// On startup, set an Academic Deadline if there isn't one already.
{
    // Find an Academic Deadline in the database.
    AcademicDeadline.find(async function(err, findAcademicDeadline) {
        if ( err ) {
            return console.error(err);  
		} else {
            // If there is no Academic Deadline in the database yet...
            if ( findAcademicDeadline.length === 0 ) {
                console.log("Couldn't find an Academic Deadline. Creating one now...");
                // Create an Academic Deadline and save it to the database.
                const createdAcademicDeadline = new AcademicDeadline({
                    date: new Date(2020, 11, 30, 23, 59, 59)
				});

                // Save a new Academic Deadline.
                createdAcademicDeadline.save(function(err, createdAcademicDeadline) {
                    if ( err ) {
                        return console.error(err);
					} else {
                        console.log("Saved!");
					}
				});
            }
		}
    });
}

//Handy dev tool to create a student, an admin, a prof, a class, a course and a deliverable.
//Use [ CTRL + K + U ] to uncomment a block of code
//Use [ CTRL + K + C ] to comment a block of code

//{
//    const createdadmin = new User({
//        email: "admin@admin.com",
//        password: "password",
//        fullname: "admin guy",
//        accountType: "administrator",
//        approved: true
//    });
//    createdadmin.save(function (err, createdadmin) {
//        if (err) {
//            return console.error(err);
//        }
//    });

//    const createdstudent = new User({
//        email: "tj@tj",
//        password: "password",
//        fullname: "TJ Mendicino",
//        accountType: "student",
//        approved: true
//    });
//    createdstudent.save(function (err, createdadmin) {
//        if (err) {
//            return console.error(err);
//        }
//    });

//    const Course = require("./db/course.js");
//    const newCourse = new Course({
//        courseCode: "COMP4004",
//        title: "Software Quality Assurance",
//        prereqs: [""],
//        precludes: [""]
//    });
//    newCourse.save(function (err, newCourse) {
//        if (err) {
//            return console.error(err);
//        }
//    });
    
//    const newProfessor = new User({
//        email: "prof@prof",
//        password: "password",
//        fullname: "prof",
//        accountType: "professor",
//        approved: true
//    });
//    newProfessor.save(function (err, newProfessor) {
//        if (err) {
//            return console.error(err);
//        }
//    });

//    const Class = require("./db/class.js");
//    const newClass = new Class({
//        course: newCourse._id,
//        professor: newProfessor._id,
//        totalCapacity: 20
//    });
//    newClass.save(function (err, newClass) {
//        if (err) {
//            return console.error(err);
//        }
//    });

//    const Deliverable = require("./db/deliverable.js");
//    const newDeliverable = new Deliverable({
//        class_id: newClass._id,
//        title: "COMP4004 Deliverable 3 CMS",
//        description: "The description for D3 CMS project",
//        weight: 10
//	});
//    newDeliverable.save(function(err, newDeliverable) {
//        if (err) {
//      return console.error(err);  
//		}
//    });
//}