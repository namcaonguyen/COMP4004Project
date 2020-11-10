const Course = require("../db/course.js");

module.exports.tryCreateCourse = async function(courseCode, title) { // returns new course id or null if course code is already in use
    if((await Course.find({ courseCode })).length) return null;
    const course = await new Course({courseCode, title}).save();
    return course._id;
}