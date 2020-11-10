const Course = require("../db/course.js");

function validateCourseCode(courseCode) {
    if(courseCode.length != 8) return false;

    for(let i = 0; i < 4; i++) {
        var char = courseCode[i];
        if(char < "A" || char > "Z") return false;
    }

    for(let i = 4; i < 8; i++) {
        var char = courseCode[i];
        if(char < "0" || char > "9") return false;
    }

    return true;
}

module.exports.tryCreateCourse = async function(courseCode, title) { // returns {id:string} if success, returns {error:string} if failed
    if(!courseCode) return { error: "Course code empty" };
    if(!title) return { error: "Title empty" };
    if(!validateCourseCode(courseCode)) return { error: "Invalid course code, should be 4 capital letters and 4 digits" };
    if((await Course.find({ courseCode })).length) return { error: "Course exists" };

    const course = await new Course({courseCode, title}).save();
    return {id: course._id};
}