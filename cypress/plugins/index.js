// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('task', {
    // Task to log a message.
    log(message) {
      console.log(message)

      return null
	  }
  })

  on('task', {
    // Task to clear the database for testing.
    clearDatabase() {
      const User = require("../../db/user.js");
      const Course = require("../../db/course.js");
      const Class = require("../../db/class.js");
      const ClassEnrollment = require("../../db/classEnrollment.js");
      const Deliverable = require("../../db/deliverable.js");
      const DeliverableSubmission = require("../../db/deliverableSubmission.js");

      // Set up the MongoDB.
      const mongoose = require("mongoose");
      mongoose.connect("mongodb://localhost/cmsApp");
      const db = mongoose.connection;
      db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

      // Clear the database.
      // NOTE: DO NOT USE THE 'AWAIT' KEYWORD HERE!!! IT DOES NOT WORK!!!

      // Delete all the student Users.
      User.deleteMany({accountType: "student"}, function(err) {
        if ( err ) {
          console.log(err);  
		    }
      });
      // Delete all the professor Users.
      User.deleteMany({accountType: "professor"}, function(err) {
        if ( err ) {
          console.log(err);  
		    }
      });
      // Delete all the Courses.
      Course.deleteMany({}, function(err) {
        if ( err ) {
          console.log(err);  
		    }
	    });
      // Delete all the Classes.
      Class.deleteMany({}, function(err) {
        if ( err ) {
          console.log(err);  
		    }
	    });
      // Delete all the ClassEnrollments.
      ClassEnrollment.deleteMany({}, function(err) {
        if ( err ) {
          console.log(err);  
		    }
	    });
      // Delete all the Deliverables.
      Deliverable.deleteMany({}, function(err) {
        if ( err ) {
          console.log(err);  
		    }
	    });
      // Delete all the DeliverableSubmissions.
      DeliverableSubmission.deleteMany({}, function(err) {
        if ( err ) {
          console.log(err);  
		    }
	    });
      
      return null
    },
    populateDBForDeliverableTesting() {
      const User = require("../../db/user.js");
      const Course = require("../../db/course.js");
      const Class = require("../../db/class.js");
      const mongoose = require("mongoose");
      mongoose.connect("mongodb://localhost/cmsApp");

      const student = new User({
        email: "zahid.dawod@cms.com",
        password: "password",
        fullname: "Zahid Dawod",
        accountType: "student",
        coursesTaken: [],
        approved: true
      });

      const professor = new User({
        email: "jp@cms.com",
        password: "password",
        fullname: "Jean-Pierre Corriveau",
        accountType: "professor",
        coursesTaken: [],
        approved: true
      });

      const course = new Course({
        courseCode: "COMP4004",
        title: "Software Quality Assurance"
      });

      const class_ = new Class({
        course: course._id,
        professor: professor._id,
        totalCapacity: 2
      });
      
      let arr = [student, professor, course, class_]; // array of objects to return

      // save to db
      student.save();
      professor.save();
      course.save();
      class_.save();

      return arr;
    },
    forceUpdateDeadline({ newDate, classId, titleParam }) {
      const Deliverable = require("../../db/deliverable.js");
      const mongoose = require("mongoose");
      mongoose.connect("mongodb://localhost/cmsApp");
      Deliverable.updateOne({ class_id: classId, title: titleParam }, { $set: { deadline: newDate } }, (err) => {
        if (err) throw err;
      });
      return null;
    }
  })
}
