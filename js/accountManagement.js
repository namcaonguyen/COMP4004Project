const User = require("../db/user.js");
const DeliverableSubmission = require("../db/deliverableSubmission.js");
const ClassEnrollment = require("../db/classEnrollment.js");

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