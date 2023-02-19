// Import mongoose package
const mongoose = require('mongoose')

//Email Regex validator
const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Creates a schema in mongoDB
const EmployeeSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'Please enter a valid first name'],
        trim: true,
    },
    last_name: {
        type: String,
        required: [true, 'Please enter a valid last name'],
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: validEmail
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    },
    salary: {
        type: Number,
        required: true
    }

})

const Employees = mongoose.model('employees', EmployeeSchema)
module.exports = Employees