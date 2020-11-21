const Class = require("../db/class.js");
const User = require("../db/user.js");
const Course = require("../db/course.js");
const ClassEnrollment = require("../db/classEnrollment.js");

//ensure that the class capacity > 1
function validateClassCapacity(cap) {
    if (isNaN(cap)) return false;
    return (cap >= 1);
}

module.exports.tryCreateClass = async function (course, professor, totalCapacity) { // returns {id:string} if success, returns {error:string} if failed
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
    const someClass = await new Class({ course, professor, totalCapacity}).save();
    return { id: someClass._id };
}

// deletes class and associated data
// - delete class enrollment data
module.exports.deleteClass = async function (id) {
    const classes = await Class.find({_id: id});
    if(!classes.length) return;
    const class_ = classes[0];

    await ClassEnrollment.deleteMany({ class: class_ });
    await Class.deleteMany({_id: id});
}

// Function to validate the inputs for when Class information is being updated.
// Param:   classIDParam        Object ID of the Class Object being updated
// Param:   professorIDParam    Object ID of the professor User being assigned
// Param:   capacityParam       New capacity
// Return an error array full of error messages.
async function validateUpdateClassInputs( classIDParam, professorIDParam, capacityParam ) {
	// Declaration of array varible to hold error messages.
    var errorArray = [];

    // Check if a professor was selected.
    if ( !professorIDParam ) {
        errorArray.push("Professor empty.");
	}
    // Check if the Class Capacity is greater or equal than 1.
    if ( !validateClassCapacity(capacityParam) ) {
        errorArray.push("The total capacity of the class must be at least 1.");
	}
    // Check if the Class Capacity is too low.
    const foundEnrollments = await ClassEnrollment.find( { class: classIDParam } );
    if ( capacityParam < foundEnrollments.length && foundEnrollments.length > 0 ) {
        var errorString = "There are already " + foundEnrollments.length + " student(s) enrolled in this Class. You cannot lower the capacity any further than " + foundEnrollments.length + ".";
        errorArray.push(errorString);
	}

    // Get a list of professors
    const professorList = (await User.find({ approved: true, accountType: "professor" })).map(result => {
        const { _id, email, fullname, accountType } = result;
        return { _id, email, fullname, accountType };
    });
    // Before updating the Class information, make sure that the professor selected still exists in the database. This is to ensure ACID properties remain effective.
    var professorInDatabase = true;
    for ( var i = 0; i < professorList.length; i++ ) {
        if ( (professorList[i]._id).equals(professorIDParam) ) {
            professorInDatabase = false;
        }
    }
    // Check if the professor is still in the database.
    if ( professorInDatabase ) {
        errorArray.push("Sorry, that professor was deleted. Choose another one.");
	}

    return errorArray;
}

// Function to try and update Class information.
// Param:   classIDParam        Object ID of the Class Object being updated
// Param:   professorIDParam    Object ID of the professor User being assigned
// Param:   capacityParam       New capacity
// Return success or an error array.
module.exports.tryToUpdateClassInformation = async function( classIDParam, professorIDParam, capacityParam ) {
    // Check the inputs for errors.
    var errorArray = await validateUpdateClassInputs( classIDParam, professorIDParam, capacityParam );

    // If there are errors in the date inputs...
    if ( errorArray.length > 0 ) {
		return { errorArray: errorArray };
	} else {
        // Update the Class information.
        var updateValues = { $set: { professor: professorIDParam, totalCapacity: capacityParam }};
        await Class.updateOne({ _id: classIDParam }, updateValues);

        return { success: true };
    }
}