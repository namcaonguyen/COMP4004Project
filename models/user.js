module.exports = function User(name, age, courses=[]) {
    this.name = name;
    this.age = age;
    this.courses = courses;
    that = this;
    
    this.UpdateCourses = function(courses) {
        that.courses = courses;
    }

    this.toString = function() {
        let output = "Hi my name is " + that.name + " and I am " + that.age + ". The courses that I am taking this year are " + that.courses;
        console.log(output);
        return output;
    }
}