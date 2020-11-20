const express = require("express");
const router = express.Router();
const Course = require("../../db/course.js");
const {
    tryCreateCourse
} = require("../../js/courseManagement.js");

// display course creation form
router.get("/", async (req, res) => {
    if (res.locals.user.accountType === "administrator") {
        // Get list of Courses offered
        const coursesList = (await Course.find({})).map(result => {
            const { _id, courseCode, title } = result;
            return { _id, courseCode, title };
        });

        res.render("course-management/create-course", { title: "Create Course", courses: coursesList } );
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// handle course creation request
router.post("/", async (req, res) => {
    if (res.locals.user.accountType === "administrator") {
        // Get the input from the request body.
        var { courseCode, title, prereqs, precludes } = req.body;

        // If the administrator did not select any prereqs or precludes, just set them to an empty array.
        if ( prereqs == undefined ) {
            prereqs = [];
        }
        if ( precludes == undefined ) {
            precludes = [];
        }

        // If an empty space was inputted as a prereq or precluded class, remove it.
        // Remove empty prereqs.
        for ( var i = 0; i < prereqs.length; i++ ) {
            if ( prereqs[i] === "" ) {
                prereqs.splice(i, 1);
                i++;
            }
        }
        // Remove empty precludes.
        for ( var i = 0; i < precludes.length; i++ ) {
            if ( precludes[i] === "" ) {
                precludes.splice(i, 1);
                i++;
            }
        }

        // Try to create the Course.
        const { id, error } = await tryCreateCourse(courseCode, title, prereqs, precludes);
        // If no ID was returned, then it means that an error occurred.
        if(!id) {
            // Get list of Courses offered
            const coursesList = (await Course.find({})).map(result => {
                const { _id, courseCode, title } = result;
                return { _id, courseCode, title };
            });
            res.render("course-management/create-course", { error, courses: coursesList });
        } else {
            res.redirect('/view-courses');
        }
    } else {
        res.render("forbidden", { title: "Access Denied" });
    }
});

// Middleware to parse the body of the request.
router.use(express.json());
router.use(express.urlencoded( { extended: true } ));

module.exports = router;