const Class = require("../db/class.js");
const User = require("../db/user.js");
const Course = require("../db/course.js");
const ClassEnrollment = require("../db/classEnrollment.js");
const AcademicDeadline = require("../db/academicDeadline.js");

// Function to get a Class List of the available Classes. It includes data that is used to display information to the user.
// Return a list of Classes.
module.exports.getClassList = async function() {
	var classList = [];

	// Find all the Classes in the database.
	var foundClasses = await Class.find({});

	// Go through the results of the query.
	for ( let i = 0; i < foundClasses.length; ++i ) {
		classList.push(await getClassInfo(foundClasses[i]));
	}

	return classList;
}

async function getClassInfo(class_) {
	// Declare temporary Class variable.
	let tempClass = {};
	tempClass._id = class_._id;
	tempClass.totalCapacity = class_.totalCapacity;
	tempClass.prereqs = class_.prereqs;
	tempClass.precludes = class_.precludes;

	// Find the Course associated with the Class.
	var associatedCourse = await Course.find({ _id: class_.course });

	tempClass.courseCode = associatedCourse[0].courseCode;
	tempClass.title = associatedCourse[0].title;

	// Find the Professor associated with the Class.
	var associatedProfessor = await User.find({ _id: class_.professor });

	tempClass.professor = associatedProfessor[0].fullname;
	return tempClass;
}
module.exports.getClassInfo = getClassInfo;

// Function to check if it is past the Academic Deadline.
// Return whether or not it is past the Academic Deadline.
async function isPastAcademicDeadline() {
	// Get the Academic Deadline.
	var findAcademicDeadline = await AcademicDeadline.find({});
	// Get the current date.
	var currentDate = new Date();

	// If there isn't exactly one Academic Deadline in the database...
	if ( findAcademicDeadline.length != 1 ) {
		return console.error("Something went wrong. Unexpected Academic Deadline...");
	}

	// If the Academic Deadline has already past...
	if ( findAcademicDeadline[0].date.getTime() < currentDate.getTime() ) {
		return true;
	} else {
		return false;
	}
}

// Function to check if the Class is full.
// Param:	classObjectID	ID of the Class to check
// Return boolean for if the Class is full or not.
async function isClassFull(classObjectID) {
	// Get the Total Capacity of the Class.
	var currentClass = await Class.find( { _id: classObjectID } );

	var currentlyEnrolled = ( await ClassEnrollment.find( { class: classObjectID } ) ).length;
	
	// Count the number of students enrolled in the Class.
	// If the number of students enrolled in the Class reaches the Total Capacity, then the Class is full.
	if ( ( await ClassEnrollment.find( { class: classObjectID } ) ).length >= currentClass[0].totalCapacity ) {
		return true;
	} else {
		return false;
	}
}

// Function to try and enroll a student User in a Class.
// Param:	studentUserObjectID	ID of the student User enrolling
// Param:	classObjectID		ID of the Class to enroll in
// Return {id:string} for a success, and {error:string} for a failure.
module.exports.tryEnrollStudentInClass = async function(studentUserObjectID, classObjectID) {
	// Check if it is past the Academic Deadline.
	if ( await isPastAcademicDeadline() ) {
		return { error: "Sorry, it's too late to enroll in any Classes." };
	}

	// Check if the student User is already enrolled in the Class.
	if ( ( await ClassEnrollment.find( { student: studentUserObjectID, class: classObjectID } ) ).length ) {
		return { error: "You are already enrolled in that Class!" };
	}
	// Check if the Class is full.
	if ( await isClassFull(classObjectID) ) {
		return { error: "The Class is already full." };
	}
	// TODO: Check for prerequisites.

	// Save the Enrollment record to the database.
	const enrollment = await new ClassEnrollment({ student: studentUserObjectID, class: classObjectID, finalGrade: "IN PROGRESS" }).save();
	return { id: enrollment._id };
}