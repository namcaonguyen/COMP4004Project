const Class = require("../db/class.js");
const User = require("../db/user.js");
const Course = require("../db/course.js");
const ClassEnrollment = require("../db/classEnrollment.js");

//ensure that the class capacity > 1
function validateClassCapacity(cap) {
    if (isNaN(cap)) return false;
    return (cap >= 1);
}

module.exports.tryCreateClass = async function (course, professor, totalCapacity, prereqs, precludes) { // returns {id:string} if success, returns {error:string} if failed
    if (!course) return { error: "Course empty" };
    if (!professor) return { error: "Professor empty" };
    if (!validateClassCapacity(totalCapacity)) return { error: "The total capacity of the class must be at least 1" };

    //get list of courses offered
    const coursesList = (await Course.find({})).map(result => {
        const { _id, courseCode, title } = result;
        return { _id, courseCode, title };
    });

    //get list of professors
    const professorList = (await User.find({ approved: true, accountType: "professor" })).map(result => {
        const { _id, email, fullname, accountType } = result;
        return { _id, email, fullname, accountType };
    });

    //before saving the class, make sure the course and prof selected still exist in the database. This is to ensure ACID properties remain effective.
    var profDeleted = true;
    for (var i = 0; i < professorList.length; i++) {
        if ((professorList[i]._id).equals(professor)) {
            profDeleted = false;
        }
    }

    var courseDeleted = true;
    for (var i = 0; i < coursesList.length; i++) {
        if ((coursesList[i]._id).equals(course)) {
            courseDeleted = false;
        }
    }

    if (profDeleted) return { error: "Sorry, that prof was deleted, choose another" };
    if (courseDeleted) return { error: "Sorry, that course was deleted, choose another" };

    //save the class to the database and return its _id
    const someClass = await new Class({ course, professor, totalCapacity, prereqs, precludes }).save();
    return { id: someClass._id };
}

// deletes class and associated data
// - delete class enrollment data
module.exports.deleteClass = async function (id) {
    await ClassEnrollment.deleteMany({ class: id });
    await Class.deleteMany({_id: id});
}