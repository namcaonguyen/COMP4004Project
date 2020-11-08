// Function to check if the input fields are valid.
exports.checkInputFieldValidity = function checkInputFieldValidity(accountTypeParam, firstNameParam, lastNameParam, emailParam, passwordParam, confirmPasswordParam) {
    // Declaration of array varible to hold error messages.
    var errorArray = [];
    
    // If the Account Type is out of range, then it is invalid.
    if ( accountTypeParam > 3 ) {
        errorArray.push("Account Type is invalid.");
	}
    // If the First Name is empty, then it is invalid.
    if ( firstNameParam == "" ) {
        errorArray.push("You must enter a first name.");
	}
    // If the Last Name is empty, then it is invalid.
    if ( lastNameParam == "" ) {
        errorArray.push("You must enter a last name.");
	}
    // If the Email isn't formatted like an email, then it is invalid.
    if ( emailParam.search("@") == -1 ) {
        errorArray.push("You must enter a valid email.");
	}
    // If the Password isn't at least 8 characters long, then it is invalid.
    if ( passwordParam.length < 8 ) {
        errorArray.push("Your password must be at least 8 characters.");
	}
    // If the two input passwords are not the same, then it is invalid.
    if ( passwordParam != confirmPasswordParam ) {
        errorArray.push("Passwords do not match.");
	}
    
    return errorArray;
}