const User = require('./user.js');
const Course = require('./course.js');
const Class = require('./class.js');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cmsApp');

// The purpose of this script is to generate temporary data for testing purposes.

var users = [
    new User({
        email: "zahiddawod@hotmail.com",
        password: "password",
        fullname: "Zahid Dawod",
        accountType: "administrator",
        approved: true
    }),
    new User({
        email: "bob_vance@cms.com",
        password: "password",
        fullname: "Bob Vance",
        accountType: "professor",
        approved: true
    }),
    new User({
        email: "mike_hunt@cms.com",
        password: "password",
        fullname: "Mike Hunt",
        accountType: "student",
        approved: true
    }),
    new User({
        email: "jack@cms.com",
        password: "password",
        fullname: "Jack",
        accountType: "student",
        approved: true
    }),
    new User({
        email: "test@cms.com",
        password: "password",
        fullname: "Test",
        accountType: "student",
        approved: false
    })
];

var courses = [

];

var classes = [

];

// delete everything from the database before adding the new content
User.deleteMany({}, function(err){
    if(err) {
      console.log('ERROR: Removing Users failed');
      return;
    }
});
  
Course.deleteMany({}, function(err){
    if(err) {
      console.log('ERROR: Removing Courses failed');
      return;
    }
});
  
Class.deleteMany({}, function(err){
    if(err) {
      console.log('ERROR: Removing Classes failed');
      return;
    }
});

// save objects to database
(async () => {
    for (let i = 0; i < users.length; i++)
        await users[i].save();
    
    for (let i = 0; i < courses.length; i++)
        await courses[i].save();

    for (let i = 0; i < classes.length; i++)
        await classes[i].save();

    mongoose.disconnect();
})();