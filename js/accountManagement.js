const User = require("../db/user.js");
const DeliverableSubmission = require("../db/deliverableSubmission.js");
const ClassEnrollment = require("../db/classEnrollment.js");
const Class = require("../db/class.js");

/**
 * @description Function to get a list of student Users. It includes data that is used to display information to the user.
 * @return a list of student Users.
 */
module.exports.getStudentList = async function() {
	var studentUserList = [];

	// Find all the student Users in the database.
	var foundStudentUsers = await User.find( { accountType: "student", approved: true } );

	// Go through the results of the query.
	for ( let i = 0; i < foundStudentUsers.length; ++i ) {
		let userInfo = {};

		userInfo._id = foundStudentUsers[i]._id;
		userInfo.email = foundStudentUsers[i].email;
		userInfo.fullname = foundStudentUsers[i].fullname;
		userInfo.coursesTaken = foundStudentUsers[i].coursesTaken;

		studentUserList.push(userInfo);
	}

	return studentUserList;
}

/**
 * @description	Function to try to delete a student User.
 * @param	studentUserObjectID	Object ID of the student User to delete
 * @return success or error.
 */
module.exports.tryToDeleteStudent = async function(studentUserObjectID) {
	// Delete all Deliverable Submissions made by this student.
	await DeliverableSubmission.deleteMany( { student_id: studentUserObjectID } );

	// Delete all the Class Enrollments of this student.
	await ClassEnrollment.deleteMany( { student: studentUserObjectID } );

	// Delete the student.
	await User.deleteOne( { _id: studentUserObjectID } );

	return { success: true };
}


/**
 * @description Function to get a list of professor Users. It includes data that is used to display information to the user.
 * @return a list of professors Users.
 */
module.exports.getProfessorList = async function () {
	var professorUserList = [];

	// Find all the professor Users in the database.
	var foundProfessorUsers = await User.find({ accountType: "professor", approved: true });

	// Go through the results of the query.
	for (let i = 0; i < foundProfessorUsers.length; ++i) {
		let userInfo = {};

		userInfo._id = foundProfessorUsers[i]._id;
		userInfo.email = foundProfessorUsers[i].email;
		userInfo.fullname = foundProfessorUsers[i].fullname;

		professorUserList.push(userInfo);
	}

	return professorUserList;
}

/**
 * @description	Function to try to delete a professor User.
 * @param	professorUserObjectID	Object ID of the professor User to delete
 * @return success or error.
 */
module.exports.tryToDeleteProfessor = async function (professorUserObjectID) {
	// Find all the classes where the professor is the professor of that class.
	var foundClasses = await Class.find({ professor: professorUserObjectID });

	// Delete the professor.
	if (foundClasses.length > 0) {
		return { success: false, error: "You cannot delete a professor if they are assigned to a class." };
	} else {
		await User.deleteOne({ _id: professorUserObjectID });
		return { success: true };
    }

	return { success: true };
}