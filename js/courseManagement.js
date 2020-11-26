const Course = require("../db/course.js");
const Class = require("../db/class.js");
const User = require("../db/user.js");
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

// Function to validate the inputs for when Class information is being updated.
// Param:   courseIDParam        Object ID of the Class Object being updated
// Param:   titleParam          Object ID of the professor User being assigned
// Return an error array full of error messages.
async function validateUpdateCourseInputs( courseIDParam, titleParam ) {
	// Declaration of array varible to hold error messages.
    var errorArray = [];

    // Check if there is a title.
    if ( !titleParam ) {
        errorArray.push("You need a Course title!");
	}

    return errorArray;
}

// Function to remove elements from a list.
// Param: listParam     The list being updated
// Parm: toRemoveParam  List of elements to remove
function removeFromList( listParam, toRemoveParam ) {
    // Go through the 'toRemove' list.
    for ( var i = 0; i < toRemoveParam.length; ++i ) {
        // If the element to remove is in the list...
        if ( listParam.indexOf(toRemoveParam[i]) != -1 ) {
            // Remove the element from the list.
            listParam.splice(listParam.indexOf(toRemoveParam[i]), 1);
		}
	}

    return listParam;
}
module.exports.removeFromList = removeFromList;

// Function to add elements to a list.
// Param: listParam     The list being updated
// Param: toAddParam    List of elements to add
// Return an updated list.
function addToList( listParam, toAddParam ) {
    // Go through the 'toAdd' list.
    for ( var i = 0; i < toAddParam.length; ++i ) {
        // Add the element to the list.
        listParam.push(toAddParam[i]);
	}

    return listParam;
}
module.exports.addToList = addToList;

// Function to get an updated list after removing and adding elements.
// Param: currentListParam  The list being update
// Param: toRemoveParam     List of elements to remove
// Param: toAddParam        List of elements to add
// Return an updated list.
function getUpdatedList( currentListParam, toRemoveParam, toAddParam ) {
    // Remove elements from the list.
    currentListParam = removeFromList(currentListParam, toRemoveParam);
    // Add elements to the list.
    currentListParam = addToList(currentListParam, toAddParam);

    return currentListParam;
}

// Function to try and update Course information.
// Param:   classIDParam            Object ID of the Course Object being updated
// Param:   titleParam              New title
// Param:   prereqsToRemoveParam    Prerequisites to remove from the Course
// Param:   precludesToRemoveParam  Precludes to remove from the Course
// Param:   prereqsToAddParam       Prerequisites to add to the Course
// Param:   precludesToAddParam     Precludes to add to the Course
// Return success or an error array.
module.exports.tryToUpdateCourseInformation = async function( courseIDParam, titleParam, prereqsToRemoveParam, precludesToRemoveParam, prereqsToAddParam, precludesToAddParam ) {
    // Check the inputs for errors.
    var errorArray = await validateUpdateCourseInputs(courseIDParam, titleParam);

    // Get the Course Object.
    var findCourse = await Course.find( { _id: courseIDParam } );

    // Declare variables for the updated prerequisites and updated precludes arrays, and populate them.
    var updatedPrereqs = [];
    updatedPrereqs = addToList(updatedPrereqs, findCourse[0].prereqs);
    var updatedPrecludes = [];
    updatedPrecludes = addToList(updatedPrecludes, findCourse[0].precludes);

    // Get the updated Prerequisites list.
    updatedPrereqs = getUpdatedList(updatedPrereqs, prereqsToRemoveParam, prereqsToAddParam);
    // Get the updated Precludes list.
    updatedPrecludes = getUpdatedList(updatedPrecludes, precludesToRemoveParam, precludesToAddParam);

    // If there are errors in the inputs...
    if ( errorArray.length > 0 ) {
		return { errorArray: errorArray };
	} else {
        // Update the Course information.
        var updateValues = { $set: { title: titleParam, prereqs: updatedPrereqs, precludes: updatedPrecludes }};
        await Course.updateOne({ _id: courseIDParam }, updateValues);

        return { success: true };
    }
}

// Function to try and update the student Users's past Courses.
module.exports.tryToUpdateStudentPastCourses = async function( studentIDParam, coursesToRemoveParam, coursesToAddParam ) {
    // Get the student User.
    var findUser = await User.find( { _id: studentIDParam } );

    if ( findUser.length === 1 ) {
        // Declare a variable for the updated Courses array, and populate it.
        var updatedCourses = [];
        updatedCourses = addToList(updatedCourses, findUser[0].coursesTaken);

        // Get the updated Courses list.
        updatedCourses = getUpdatedList(updatedCourses, coursesToRemoveParam, coursesToAddParam);

        // Update the student User's Courses Taken attribute.
        var updateValues = { $set: { coursesTaken: updatedCourses } };
        await User.updateOne({ _id: studentIDParam }, updateValues);

        return { success: true };
	} else {
        return { error: "Something went wrong with your account. Please contact an administrator." };
	}

}