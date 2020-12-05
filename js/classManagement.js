const Class = require("../db/class.js");
const User = require("../db/user.js");
const Course = require("../db/course.js");
const Deliverable = require("../db/deliverable.js");
const DeliverableSubmission = require("../db/deliverableSubmission.js");
const ClassEnrollment = require("../db/classEnrollment.js");
const fs = require("fs");

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
    await Class.deleteMany({ _id: id });
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

/**
 * @description Function to check if a professor is assigned to a Class.
 * @param   professorIDParam    Object ID of the professor
 * @param   classIDParam        Object ID of the Class
 */
async function isProfessorAssignedToClass( professorIDParam, classIDParam ) {
    // Try to find the Class in the database which is assigned to the professor.
    var findClass = await Class.find( { _id: classIDParam, professor: professorIDParam } );
    
    // If the Class could not be found in the database...
    if ( findClass.length === 0 ) {
        return false;
	} else {
        return true;
	}
}

/**
 * @description This function to create a deliverable. Returns success or an error array.
 * @param {string} professorIDParam - Object ID of the professor User trying to create a deliverable
 * @param {string} classIDParam - Object ID of the Class Object being updated
 * @param {string} titleParam - Title of the deliverable
 * @param {string} descriptionParam - Description of the deliverable
 * @param {string} weightParam - Weight of the deliverable
 * @param {string} specificationFile - The specification file of the deliverable
 * @param {string} deadlineParam - The deadline of the deliverable
 */
module.exports.tryCreateDeliverable = async function (professorIDParam, classIDParam, titleParam, descriptionParam, weightParam, specificationFile, deadlineParam) {
    // Check if the professor User is assigned to the Class.
    if ( await isProfessorAssignedToClass(professorIDParam, classIDParam) == false ) {
        var errorArray = [];
        errorArray.push("You are not assigned to this Class!");
        return { errorArray: errorArray };
	}
    
    // Check the inputs for errors.
    var errorArray = await validateCreateDeliverableInputs(classIDParam, titleParam, descriptionParam, weightParam, specificationFile, deadlineParam);

    // If there are errors in the deliverable inputs...
    if (errorArray.length > 0) {
        return { errorArray: errorArray };
    } else {
        // Create deliverable object and save it to the database.
        const createdDeliverable = new Deliverable({
            class_id: classIDParam,
            title: titleParam,
            description: descriptionParam,
            specification_file: specificationFile,
            weight: weightParam,
            deadline: deadlineParam,
            is_deleting: false
        });

        // Save the deliverable to the database.
        await createdDeliverable.save();

        return { id: createdDeliverable._id };
    }
}

// Function to validate the inputs for when Class information is being updated.
// Param:   classIDParam        Object ID of the Class Object being updated
// Param:   professorIDParam    Object ID of the professor User being assigned
// Param:   capacityParam       New capacity
// Return an error array full of error messages.
async function validateCreateDeliverableInputs(classIDParam, titleParam, descriptionParam, weightParam, specificationFile, deadlineParam) {
    // Declaration of array varible to hold error messages.
    var errorArray = [];

    // Check if another deliverable has the same title in this class.
    if ((await Deliverable.find({ class_id: classIDParam, title: { $regex: new RegExp("^" + titleParam.toLowerCase(), "i") }})).length !== 0) {
        errorArray.push("A deliverable with that title already exists in this class.");
    }
    // Check if the weight is greater or equal than 1 and less than or equal to 100.
    if ((weightParam < 0) || (weightParam > 100)) {
        errorArray.push("The weight of the deliverable must be >= 0 and <= 100 %.");
    }
    // Check if the description is not greater than 255 characters.
    if (descriptionParam.length > 255) {
        errorArray.push("The description of the deliverable can be at most 255 characters.");
    }
    // Check if spec file is provided or not
    if (!specificationFile) {
        specificationFile = "";
    }
    // Check if deadline has not passed yet or is even provided
    if (deadlineParam) {
        if (new Date() > deadlineParam) {
            errorArray.push("The deadline has already passed.");
        }
    } else {
        deadlineParam = new Date();
        deadlineParam.setDate(deadlineParam.getDate() + 1);
    }
    

    // Before creating the deliverable, make sure that the class selected still exists in the database. This is to ensure ACID properties remain in effect.
    const foundClass = await Class.find({ _id: classIDParam });
    var classInDatabase = true;
    if (foundClass.length == 0) {
        classInDatabase = false;
    }

    // Check if the class is still in the database.
    if (!classInDatabase) {
        errorArray.push("Sorry, that class was deleted.");
    }

    return errorArray;
}

/**
 * @description This function tries to delete a deliverable and all related content for it in a specific class.
 * @param {string} deliverableId - The id of the deliverable.
 */
module.exports.tryToDeleteDeliverable = async function (deliverableId) {

    // Find the deliverable to make sure it still exists
    var foundDeliverable = await Deliverable.find({ _id: deliverableId });
    if (!foundDeliverable.length) {
        return false;
    }

    // Find the deliverable submissions, if there are any then return an error
    var deliverableSubmissions = await DeliverableSubmission.find({ deliverable_id: deliverableId });
    if (deliverableSubmissions.length > 0) {
        return false;
    }

    var foundClass = await Class.find({ _id: foundDeliverable[0].class_id });
    if (!foundClass.length) {
        return false;
    }

    // update is_deleting flag so no one can interact with this deliverable while deletion is in process.
    await Deliverable.updateOne({ _id: deliverableId }, { $set: { is_deleting: true } });

    // remove spec file if exists
    let specFile = (await Deliverable.findById(deliverableId)).specification_file;
    if (specFile) fs.unlinkSync("uploads/" + specFile);

    // remove all submission files for this deliverable before deleting the deliverable itself.
    let allSubmissions = await DeliverableSubmission.find({ deliverable_id: deliverableId });
    for (let i = 0; i < allSubmissions.length; i++) {
        if (allSubmissions[i].file_name) {
            fs.unlinkSync("uploads/" + allSubmissions[i].file_name);
        }
    }

    // delete all deliverable submissions for this deliverable from database.
    await DeliverableSubmission.deleteMany({ deliverable_id: deliverableId });

    // delete deliverable
    await Deliverable.deleteOne({ _id: deliverableId });

    return true;
}

/**
 * @description Function to check of a Class with an Object ID exists in the database.
 * @param   classID Object ID of the Class
 * @return whether or not the Class exists in the database
 */
async function doesClassExist( classID ) {
    // Try to find the Class in the database.
    var findClass = await Class.find( { _id: classID } );

    // If no Classes with the ID were found in the database...
    if ( findClass.length === 0 ) {
        return false;
	} else {
        return true;
	}
}

/**
 * @description Function to check if a student is enrolled in a Class.
 * @param   studentIDParam
 * @param   classIDParam
 * @return whether or not the student is enrolled in the Class.
 */
 async function isStudentEnrolledInClass( studentIDParam, classIDParam ) {
    // Try to find the ClassEnrollment in the database.
    var findClassEnrollment = await ClassEnrollment.find( { student: studentIDParam, class: classIDParam } );

    // If the ClassEnrollment was not found in the database...
    if ( findClassEnrollment.length === 0 ) {
        return false;
	} else {
        return true;
	}
 }

/**
 * @description This function updates the deliverable submission info for a specific student in a class.
 * @param {string} classId - The id of the class.
 * @param {string} studentId - The id of the student submitting the file.
 * @param {string} deliverableTitle - The name of the deliverable.
 * @param {string} fileNameRef - The name of the file to reference later.
 */
module.exports.tryUpdateSubmissionDeliverable = async function (classId, studentId, deliverableTitle, fileNameRef) {
    // Check if the Class still exists.
    if ( await doesClassExist(classId) == false ) {
        return { result: false, response: "This class does not exist. If this is a mistake please contact an administrator." };
	}
    // Check if the student is enrolled in the Class.
    if ( await isStudentEnrolledInClass(studentId, classId) == false ) {
        return { result: false, response: "You are not enrolled in this Class." };
	}

    // Check if a file was submitted.
    if (!fileNameRef) return { result: false, response: "A file was not submitted! Please try again." };

    // Find the associated Deliverable.
    const deliverable = await Deliverable.find({ class_id: classId, title: deliverableTitle });
    if (deliverable.length !== 0) { // check if deliverable exists in this class.
        if (new Date() > deliverable[0].deadline) {
            return { result: false, response: "You cannot submit past the deadline."};
        } else {
            const query = { deliverable_id: deliverable[0]._id, student_id: studentId };
            const deliverableSubmission = await DeliverableSubmission.find(query);
            if (deliverableSubmission.length === 0) { // create submission deliverable if it doesn't exist.
                const submission = new DeliverableSubmission({
                    deliverable_id: deliverable[0]._id,
                    student_id: studentId,
                    file_name: fileNameRef,
                    grade: -1
                });
            
                await submission.save(); // save the submission to the database.
            } else { // otherwise update existing submission deliverable.
                if (deliverableSubmission[0].file_name !== fileNameRef) fs.unlinkSync("uploads/" + deliverableSubmission[0].file_name); // delete old submission file only if filename is different otherwise multer automatically replaces it old file
                await DeliverableSubmission.updateOne(query, { $set: { file_name: fileNameRef } }); // update file name reference in db to new file
            }
            return { result: true, response: "" }; // sucessfully updated submission deliverable
        }
    }
    return { result: false, response: "This Deliverable does not exist." }; // something went wrong
}


/**
 * @description This function attempts to update the deliverable info for a specific class.
 * @param {string} class_id - The id of the class.
 * @param {string} title - The name of the deliverable.
 * @param {string} description - The description of the deliverable.
 * @param {string} specification_file - The name of the specification file to reference later.
 * @param {string} weight - The weight of the deliverable.
 * @param {string} deadline - The deadline of the deliverable.
 */
module.exports.tryUpdateDeliverable = async function (classId, title, description, specification_file, weight, deadline) {
    if (!classId) return false;

    var updateValues = { $set: { } };
    if (title) updateValues.$set.title = title;
    if (description) updateValues.$set.description = description;
    if (specification_file) updateValues.$set.specification_file = specification_file;
    if (weight) updateValues.$set.weight = weight;
    if (deadline) updateValues.$set.deadline = deadline;

    if (Object.keys(updateValues.$set).length > 0) {
        var oldSpecFile = (await Deliverable.find({ class_id: classId }))[0].specification_file;
        if (oldSpecFile) fs.unlinkSync("uploads/" + oldSpecFile);
        await Deliverable.updateOne({ class_id: classId }, updateValues);
        return true;
    } else return false;
}


/**
 * @description returns the original file name.
 * @param {string} file_name - The string to parse.
 * @param {string} deliverable_title - The title of the deliverable.
 */
function getOriginalFileName (file_name, deliverable_title) {
	let fileNameArr = file_name.split("-"), index = 0;
	for (let i = 0; i < fileNameArr.length; i++) {
		index += fileNameArr[i].length + 1; // +1 for the hyphen thats missing
		if (fileNameArr[i] === deliverable_title) break;
	}
	let fileName = "";
	for (let i = index; i < file_name.length; i++) {
		fileName += file_name[i];
	}
	return fileName;
};
module.exports.getOriginalFileName = getOriginalFileName;

/**
 * @description This function attempts to retrieve all the deliverable submissions and other related info.
 * @param {string} deliverableId - The id of the deliverable.
 */
module.exports.tryRetrieveSubmittedDeliverables = async function (deliverableId) {
    var title = (await Deliverable.findById(deliverableId)).title;
    var submissions = (await DeliverableSubmission.find({ deliverable_id: deliverableId }));
    var allSubmissions = [];
    for (let i = 0; i < submissions.length; i++) {
        let currentSubmission = {};
        currentSubmission.studentId = submissions[i].student_id;
        currentSubmission.fileName = getOriginalFileName(submissions[i].file_name, title);
        currentSubmission.fullName = (await User.findById(submissions[i].student_id)).fullname;
        currentSubmission.grade = submissions[i].grade;
        allSubmissions.push(currentSubmission);
    }
    return allSubmissions;
}