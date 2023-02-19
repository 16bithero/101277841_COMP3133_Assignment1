const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")

const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        primaryKey: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: validEmail
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
})


//This function works as a checker, if its not a new user, or updating a user's information,
// hash function will be ignored, as it is already hashed
UserSchema.pre("save", function(next) {
    if(!this.isModified("password")) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
  });
  
  //This method compares input password to the password that has been hashed and returns a boolean response in callback
  UserSchema.methods.comparePassword = function(rawPassword, callback) {
    return callback(null, bcrypt.compareSync(rawPassword, this.password));
  };

const Users = mongoose.model('users', UserSchema)
module.exports = Users