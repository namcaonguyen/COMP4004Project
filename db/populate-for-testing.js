const User = require('./user.js');
const Course = require('./user.js');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cmsApp');

// The purpose of this script is to generate temporary data for testing purposes. (Maybe should be moved to ../features/steps/)