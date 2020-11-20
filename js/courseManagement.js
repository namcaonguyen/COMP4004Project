const Course = require("../db/course.js");
const Class = require("../db/class.js");
const { deleteClass } = require("./classManagement.js");

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

module.exports.tryCreateCourse = async function(courseCode, title, prereqs, precludes) { // returns {id:string} if success, returns {error:string} if failed
    if(!courseCode) return { error: "Course code empty" };
    if(!title) return { error: "Title empty" };
    if(!validateCourseCode(courseCode)) return { error: "Invalid course code, should be 4 capital letters and 4 digits" };
    if((await Course.find({ courseCode })).length) return { error: "Course exists" };

    const course = await new Course({courseCode, title, prereqs, precludes}).save();
    
    return {id: course._id};
}

// deletes it properly so that associated data is removed. first arg is course itself, NOT course code
// - delete prereqs
// - deletes classes (by classing classManagement.deleteClass)
// - deletes class enrollments (vicariously, by calling classManagement.deleteClass)
module.exports.deleteCourse = async function(courseID) {
    const courses = await Course.find({_id: courseID});
    if(!courses.length) return;
    const course = courses[0];

    const classes = await Class.find({course});
    for(const class_ of classes) {
        await deleteClass(class_._id);
    }
    await Course.deleteOne(course);
}