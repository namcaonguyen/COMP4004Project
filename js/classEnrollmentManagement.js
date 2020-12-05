const Class = require("../db/class.js");
const User = require("../db/user.js");
const Course = require("../db/course.js");
const Deliverable = require("../db/deliverable.js");
const ClassEnrollment = require("../db/classEnrollment.js");
const AcademicDeadline = require("../db/academicDeadline.js");
const {
	addToList,
	removeFromList
} = require("./courseManagement.js");
const deliverableSubmission = require("../db/deliverableSubmission.js");
const { getOriginalFileName } = require("./classManagement.js");

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

// Function to get the info of an individual Class object.
// Param:	class_	Class object
// Return info about the Class object.
async function getClassInfo(class_) {
	// Declare temporary Class variable.
	let tempClass = {};
	tempClass._id = class_._id;
	tempClass.totalCapacity = class_.totalCapacity;

	// Find the Course associated with the Class.
	var associatedCourse = await Course.find({ _id: class_.course });

	tempClass.courseCode = associatedCourse[0].courseCode;
	tempClass.title = associatedCourse[0].title;
	tempClass.prereqs = associatedCourse[0].prereqs;
	tempClass.precludes = associatedCourse[0].precludes;

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
	return findAcademicDeadline[0].date.getTime() < currentDate.getTime();
}
module.exports.isPastAcademicDeadline = isPastAcademicDeadline;

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

/**
 * @description	Function to check if a preclude of a prerequisite has been taken by the student.
 * @param prereqCourseCodeParam	Course code of the prerequisite to check
 * @param coursesTakenListParam	List of Courses taken by the student
 * @return whether or not the the student has taken a preclude of the prerequisite.
 */
async function studentHasTakenPrecludedCourse( prereqCourseCodeParam, coursesTakenListParam ) {
	// Declaration of boolean variable for if a preclude of the prerequisite was taken, initially set to false.
	var hasStudentTakenPrecludeOfPrereq = false;

	// Go through the list of Courses taken by the student.
	// This is to check if any of the courses taken preclude the desired prerequisite.
	for ( var i = 0; i < coursesTakenListParam.length; ++i ) {
		// Find the Course Object with the Course Code.
		var findCourse = await Course.find( { courseCode: coursesTakenListParam[i] } );

		// If there is no such Course in the database...
		if ( findCourse.length === 0 ) {
			// Move onto the next Course.
			continue;
		} else {
			// Declaration of variable for the precludes of the current Course.
			var precludesOfTakenCourse = findCourse[0].precludes;

			// If the prerequisite Course Code is in the list of precludes...
			if ( precludesOfTakenCourse.indexOf(prereqCourseCodeParam) != -1 ) {
				// The student has taken a preclude of the prereq. Set the boolean to true.
				hasStudentTakenPrecludeOfPrereq = true;
			}
		}
	}

	// Find the Course Object of the prerequisite Course Code.
	var findPrereqCourse = await Course.find( { courseCode: prereqCourseCodeParam } );
	// If there is a Course in the database...
	if ( findPrereqCourse.length != 0 ) {
		// Declaration of variable for the precludes of the prerequisite.
		var precludesOfPrerequisite = findPrereqCourse[0].precludes;

		// Go through the precludes of the prerequisite.
		for ( var i = 0; i < precludesOfPrerequisite.length; ++i ) {
			// If the current preclude of the prerequisite is in the student's list of Courses taken...
			if ( coursesTakenListParam.indexOf(precludesOfPrerequisite[i]) != -1 ) {
				// The student has taken a preclude of the prereq. Set the boolean to true.
				hasStudentTakenPrecludeOfPrereq = true;
			}
		}
	}

	return hasStudentTakenPrecludeOfPrereq;
}

/**
 * @description	Function to check if the prerequisites required for the Class Course are satisfied.
 * @param classObjectIDParam		Object ID of the Class
 * @param studentUserObjectIDParam	Object ID of the student User
 * @return whether or not the prerequisites are satisfied.
 */
async function arePrerequisitesSatisfied( classObjectIDParam, studentUserObjectIDParam ) {
	// Get the Class Object.
	var findClass = await Class.find( { _id: classObjectIDParam } );
	// Get the student User Object.
	var findStudent = await User.find( { _id: studentUserObjectIDParam } );

	// If the Class or student User can't be found in the database...
	if ( findClass.length === 0 || findStudent.length === 0 ) {
		// Return early if the Class can't be found.
		return false;
	} else {
		// Get the Course Object associated with the Class.
		var findCourse = await Course.find( { _id: findClass[0].course } );
		// Declaration of variables for the required prerequisites and the student's Courses Taken, and populate them.
		var requiredPrerequisitesList = [];
		requiredPrerequisitesList = addToList(requiredPrerequisitesList, findCourse[0].prereqs);
		var studentCoursesTakenList = [];
		studentCoursesTakenList = addToList(studentCoursesTakenList, findStudent[0].coursesTaken);

		// Remove Courses from the prerequisites list that the student has already taken.
		requiredPrerequisitesList = removeFromList(requiredPrerequisitesList, studentCoursesTakenList);

		// If the prerequisites list is empty, then that means all prerequisites have been satisfied.
		if ( requiredPrerequisitesList.length === 0 ) {
			return true;
		}

		// Else, there are still some prerequisites that the student has not taken.
		// However, it is possible that the student has taken a precluded Course of a prerequisite.
		// Check for the precludes of the prerequisites.

		// Go backwards through the list of remaining prerequisites.
		for ( var i = requiredPrerequisitesList.length - 1; i >= 0; i-- ) {
			// If the student has taken a preclude of the current prerequisite...
			if ( await studentHasTakenPrecludedCourse(requiredPrerequisitesList[i], studentCoursesTakenList) ) {
				// Remove the prerequisite from the list.
				requiredPrerequisitesList.splice(i, 1);
			}
		}

		// Check again if the prerequisites list is empty. That means all prerequisites have been satisfied.
		if ( requiredPrerequisitesList.length === 0 ) {
			return true;
		} else {
			return false;
		}
	}
}

// Function to check if the Class still exists in the database.
// Param:	classObjectID	ID of the Class to check
// Return boolean for if the Class still exists or not.
async function doesClassStillExist(classObjectID) {
	// Look for the current Class in the database.
	var currentClass = await Class.find( { _id: classObjectID } );

	// If a Class with the Object ID could not be found...
	if ( currentClass.length === 0 ) {
		return false;
	} else {
		return true;
	}
}

/**
 * @description Function to check if the Class is over capacity. If it is, then delete any excess enrollments.
 * @param	classObjectID	ID of the Class to check
 * @return boolean for if the Class is over capacity or not
 */
async function checkAndEnforceIsClassOverCapacity( classObjectID ) {
	// Get the Total Capacity of the Class.
	var currentClass = await Class.find( { _id: classObjectID } );
	// Get all the enrollments of the Class.
	var currentlyEnrolled = await ClassEnrollment.find( { class: classObjectID } );
	
	// Count the number of students enrolled in the Class.
	// If the number of students enrolled in the Class is greater than the Total Capacity, then the Class is over capacity.
	if ( currentlyEnrolled.length > currentClass[0].totalCapacity ) {
		// Delete the most recent enrollments above the capacity.
		for ( var i = currentlyEnrolled.length; i > currentClass[0].totalCapacity; i-- ) {
			await ClassEnrollment.deleteOne( { _id: currentlyEnrolled[i - 1]._id } );
		}
		
		var findtest = await ClassEnrollment.find({});

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
	// Check if the Class still exists, in case an administrator User cancelled it.
	if ( await doesClassStillExist(classObjectID) == false ) {
		return { error: "Sorry, that Class has been cancelled." };
	}
	// Check if the Class is full.
	if ( await isClassFull(classObjectID) ) {
		return { error: "The Class is already full." };
	}
	// Check if the prerequisites are satisfied.
	if ( await arePrerequisitesSatisfied(classObjectID, studentUserObjectID) == false ) {
		return { error: "The prerequisites for this Class are not satisfied." };
	}

	// Check again before enrolling if the Class still exists.
	if ( await doesClassStillExist(classObjectID) == false ) {
		return { error: "Sorry, that Class has been cancelled." };
	}

	// Save the Enrollment record to the database.
	const enrollment = await new ClassEnrollment({ student: studentUserObjectID, class: classObjectID, finalGrade: "IN PROGRESS" }).save();
	
	// Check if the Class is over capacity. If it is, then delete the excess enrollments.
	if ( await checkAndEnforceIsClassOverCapacity(classObjectID) ) {
		// Try to find the created Enrollment in the database.
		const findEnrollment = await ClassEnrollment.find( { _id: enrollment._id } );
		// If the enrollment wasn't in the database, then it was deleted because the Class was over capacity.
		if ( findEnrollment.length === 0 ) {
			return { error: "The Class is already full." };
		}
	}
	
	return { id: enrollment._id };
}

// before deadline
module.exports.tryDropClassNoDR = async function (studentID, classID) {

	// Check to see if the class still exists
	var foundClasses = await Class.find({ _id: classID });
	// If the class doesn't exist, return error.
	if (!foundClasses.length) {
		return { success: false, error: "The class was already cancelled by an administrator." }
	}

	// Check to see if the student is still enrolled in the class
	var foundEnrollments = await ClassEnrollment.find({ student: studentID, class: classID });
	// If the student is not enrolled, return error.
	if (!foundEnrollments.length) {
		return { success: false, error: "You are not enrolled in that class." }
	}

	const query = {
		student: studentID,
		class: classID
	};

	if(await isPastAcademicDeadline()) return { success: false, error: "Deadline has already passed, drop with DR instead :(" };

	const { deletedCount } = await ClassEnrollment.deleteMany(query);

	if(!deletedCount) return { success: false, error: "Not already enrolled." };
	return { success: true }; // no error
}

// this is a seperate function because: the page presented to the user should state "Drop DR",
// and THAT version of the page should be rendered if we're past the deadline
// that way the user doesn't select "Drop" (no DR) as the deadline passes, and then accidentally drops the class with DR
module.exports.tryDropClassWithDR = async function(studentID, classID) {
	const query = {
		student: studentID,
		class: classID
	};

	if(!(await isPastAcademicDeadline())) return { success: false, error: "Deadline hasn't passed yet, drop without DR instead :)" };

	const classEnrollments = await ClassEnrollment.find(query);
	if(!classEnrollments.length) return { success: false, error: "Not already enrolled." };
	if(classEnrollments.length !== 1) console.warn("WARNING: Student is enrolled in the same class multiple times!");

	await ClassEnrollment.updateMany(query, {
		$set: {
			finalGrade: "WDN"
		}
	});
	
	return { success: true }; // no error
}

// Function to get all classes where the specified professor is the prof of the class. It includes data that is used to display information to the user.
// Return a list of Classes of a specific professor.
module.exports.getProfessorClassList = async function (profID) {
	var classList = [];

	// Find all the Classes in the database.
	var foundClasses = await Class.find({ professor: profID });

	// Go through the results of the query.
	for (let i = 0; i < foundClasses.length; ++i) {
		var currentClassInfo = await getClassInfo(foundClasses[i]);
		classList.push({
			_id: currentClassInfo._id,
			title: currentClassInfo.title,
			courseCode: currentClassInfo.courseCode,
			numOfEnrolled: (await ClassEnrollment.find({ class: currentClassInfo._id })).length + "/" + currentClassInfo.totalCapacity
		});
	}

	return classList;
}

// function to get all classes that the specified student is enrolled in.
module.exports.getStudentClassList = async function (id) {
	var classList = [];

	var classes = await ClassEnrollment.find({ student: id });

	for (let i = 0; i < classes.length; ++i) {
		const finalGrade = classes[i].finalGrade;
		var currentClass = await Class.findById(classes[i].class);
		var currentClassInfo = await getClassInfo(currentClass);
		classList.push({
			_id: currentClassInfo._id,
			title: currentClassInfo.title,
			courseCode: currentClassInfo.courseCode,
			professor: currentClassInfo.professor,
			finalGrade,
			withdrawn: finalGrade == "WDN" 
		});
	}

	return classList;
}

/**
 * @description Checks whether or not the user with the ID is enrolled in a specific class.
 * @param {string} id - The id of the user to check.
 * @param {string} classId - The id of the class.
 */
module.exports.isEnrolled = async function (id, classId) {
	return ((await ClassEnrollment.find({ student: id, class: classId })).length !== 0);
}

/**
 * @description Checks whether or not the professor is teaching the class.
 * @param {string} id - The id of the user to check.
 * @param {string} classId - The id of the class.
 */
module.exports.isTeaching = async function (id, classId) {
	return ((await Class.find({ _id: classId, professor: id })).length !== 0);
}

/**
 * @description returns the course code of a given class.
 * @param {string} classId - The id of the class.
 */
module.exports.getCourseCodeOfClass = async function (classId) {
	const foundClasses = await Class.find({ _id: classId });
	const foundCourses = await Course.find({ _id: foundClasses[0].course });
	return foundCourses[0].courseCode;
}

/**
 * @description returns a list of deliverables for a class.
 * @param {string} classId - The id of the class.
 * @param {string=} optionalStudentId - The id of the student, if you want the grades and file names to be filled in
 */
async function getDeliverablesOfClass (classId, optionalStudentId=undefined) {
	const query = { class_id: classId };
	const deliverables = (await Deliverable.find(query)).map(result => {
		const { _id, title, weight } = result;
		return { _id, title, weight };
	});

	if(optionalStudentId) {
		for(const deliverable of deliverables) {
			const studentSubmissions = await deliverableSubmission.find({
				deliverable_id: deliverable._id,
				student_id: optionalStudentId
			});
			
			if(studentSubmissions.length) {
				if(studentSubmissions.length != 1) console.warn(`Warning: Found multiple submissions for deliverable id ${deliverable._id} and student id ${optionalStudentId}`);
				const studentSubmission = studentSubmissions[0];
				
				deliverable.submission_id = studentSubmission._id;

				const rawGrade = deliverable.grade = studentSubmission.grade; // may be -1
				if(rawGrade < 0) {
					deliverable.graded = false;
				} else {
					deliverable.graded = true;
				}

				if (studentSubmission.file_name) {
					deliverable.file_name = studentSubmission.file_name;
					deliverable.original_file_name = getOriginalFileName(studentSubmission.file_name, deliverable.title);
				}
			}
		}
	}

	return deliverables;
}
module.exports.getDeliverablesOfClass = getDeliverablesOfClass;

/**
 * @description This function updates the grade of a deliverable submission
 * @param {string} submission_id - The id of the submission.
 * @param {number=-1} grade - The new grade from 0-100.
 */
module.exports.trySetSubmissionGrade = async function (submission_id, grade=-1) {
    if(typeof grade == "number" && !isNaN(grade)) {
        if((grade >= 0 && grade <= 100) || grade == -1) {
            await deliverableSubmission.updateMany({ _id: submission_id }, { $set: { grade }});
            return { success: true };
        } else return { success: false, error: "Grade must be in range [0, 100] (or -1 to clear)" };
    } else return { success: false, error: "Grade must be of type number" };
}

/**
 * @description This function returns the final grade. Assumes student is enrolled
 * @param {string} class_id - The id of the class
 * @param {string} student_id - The id of the student
 * @returns {number}
 */
module.exports.calculateFinalGrade = async function (class_id, student_id) {
	const precision = 100; // eg. precision=100 -> 25.79%... eg. precision=10 -> 25.8%

    const deliverables = await getDeliverablesOfClass(class_id, student_id); // some of these will have marks
    let totalWeight = 0;
    let totalWeightedGrade = 0;
    for(const deliverable of deliverables) {
		let grade = deliverable.grade;
		if(!(grade >= 0)) grade = 0; // not graded = -1, not submitted = undefined
        const weight = deliverable.weight;
        const weightedGrade = grade * weight;
        totalWeight += weight;
        totalWeightedGrade += weightedGrade;
    }
    if(totalWeight <= 0) return 0;
    else return Math.round(precision * totalWeightedGrade / totalWeight) / precision;
}

/**
 * @description This function updates the final grade of a student enrolled in a class
 * @param {string} class_id - The id of the student.
 * @param {string} student_id - The id of the student.
 * @param {number=-1} finalGrade - The new final grade
 */
module.exports.trySubmitFinalGrade = async function (class_id, student_id, finalGrade) {
	try {
		finalGrade = parseFloat(finalGrade);
	} catch(e) {
		return { success: false, error: "Grade must be number" };
	}

	const enrollments = await ClassEnrollment.find({student: student_id, class: class_id});
	if(!enrollments.length) return { success: false, error: `Tried to update non-existing enrollment` };
	if(enrollments.length != 1) console.warn(`Warning: multiple enrollments for student: ${student_id}, class: ${class_id}`);
	const enrollment = enrollments[0];

	if(enrollment.finalGrade == "WDN") return { success: false, error: "Can't update final grade of withdrawn (WDN) enrollment" }

	if(typeof finalGrade == "number" && !isNaN(finalGrade)) {
        if(finalGrade >= 0 && finalGrade <= 100) {
            await ClassEnrollment.updateMany({ _id: enrollment._id }, { $set: { finalGrade }});
            return { success: true };
        } else return { success: false, error: "Grade must be in range [0, 100]" };
	} else return { success: false, error: "Grade must be of type number" };
}