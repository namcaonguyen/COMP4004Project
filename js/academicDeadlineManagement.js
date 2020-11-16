const AcademicDeadline = require("../db/academicDeadline.js");

// Function to get the Academic Deadline from the database.
// Return the Academic Deadline object, which includes a Date.
module.exports.getAcademicDeadline = async function() {
	var findAcademicDeadline = await AcademicDeadline.find({});

	return findAcademicDeadline;
}

// Function to validate the date inputs.
// Param:	yearParam	The input year
// Param:	monthParam	The input month
// Param:	dayParam	The input day
// Return an array of error messages.
function validateDateInputs(yearParam, monthParam, dayParam) {
	// Declaration of array varible to hold error messages.
    var errorArray = [];

	// If any of the parameters are less than 1, then it is invalid.
	if ( yearParam < 1 || monthParam < 1 || dayParam < 1 ) {
		errorArray.push("All date inputs must be greater than 0.");
	}
	// If the year parameter is less than 2020, then it is invalid.
	if ( yearParam < 2020 ) {
		errorArray.push("The year can't be before 2020!");
	}
	// If the month parameter is greater than 12, then it is invalid.
	if ( monthParam > 12 ) {
		errorArray.push("The month must be in the range of 1-12.");
	}
	// If the day is greater than 31, then it is invalid.
	if ( dayParam > 31 ) {
		errorArray.push("The day must be in the range of 1-31.");
	}

	return errorArray;
}

module.exports.tryToUpdateAcademicDeadline = async function(yearParam, monthParam, dayParam) {
	// Check the inputs for errors.
	var errorArray = validateDateInputs(yearParam, monthParam, dayParam);

	// If there are errors in the date inputs...
	if ( errorArray.length > 0 ) {
		return { errorArray: errorArray };
	} else {
		// Create a new Academic Deadline Date.
		// NOTE: We subtract the input month by 1 because the actual month range is 0-11.
		var newAcademicDeadlineDate = new Date(yearParam, monthParam - 1, dayParam, 23, 59, 59);

		// Update the Academic Deadline.
		var updateValues = { $set: { date: newAcademicDeadlineDate }};
		await AcademicDeadline.updateOne({}, updateValues);

		return { success: true };
	}
}