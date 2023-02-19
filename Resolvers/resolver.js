// Imports model files to be used in various CRUD operation
const Employee = require('../Models/Employee')
const Users = require('../Models/Users')

exports.resolver = {
    Query: {
        // Displays all employees in the database
        getEmployees: async (parent, args) => {
            return Employee.find({})
        },

        // Searches for specific employee with id as parameter
        searchEmployeeID: async (parent, args) => {
            return Employee.findById(args.id)
        },

        // Logs in user using username and password as parameter
        userLogin: async (parent, args) => {
            const username = args.username
            const password = args.password
            const user = await Users.findOne({ username })

            // Returns an error message if no user exists
            if (!user) {
                throw new Error('No user found')
            }

            // Compares the password parameter to the hashed value of password in MongoDB
            // Returns an error message if it's a wrong password
            !user.comparePassword(password, (error, match) => {
                if (!match) {
                    throw new Error('Invalid password')
                }
            })

            // Returns a JSON format message if criterias are met
            return `User '${args.username}' verified. Login successful.`
        }
    },

    Mutation: {
        // Adds a new record of employee
        addEmployee: async (parent, args) => {
            let newEmp = new Employee({
                first_name: args.first_name,
                last_name: args.last_name,
                email: args.email,
                gender: args.gender,
                salary: args.salary,
            })
            try {
                const result = await newEmp.save()
                return result
            } catch (error) {
                // Checks the database if email is in record using error code 11000, then returns an error message
                if (error.code === 11000) {
                    throw new Error('Email already exists. Please use a different email.')

                // If it does not exist, and does not match the regex, it will return an error message as well
                } else if (error && error.errors && error.errors.email) {
                    throw new Error('Invalid email. Please check the entry and try again.');
                }
                else {throw error}
            }
        },

        // Adds a new record of User
        addUser: async (parent, args) => {
            let newUser = new Users({
                username: args.username,
                email: args.email,
                password: args.password
            })

            try {
                const result = await newUser.save()
                return result
            } catch (error) {
                if (error.code === 11000) {
                    throw new Error('Email already exists. Please use a different email.')
                } else if (error && error.errors && error.errors.email) {
                    throw new Error('Invalid email. Please check the entry and try again.');
                }
                else {throw error}
            }
        },

        // Updates an existing record of an employee using the id
        updateEmployee: async (parent, args) => {
            if (!args.id) {
                return null;
            }
            try {
                // Finds a record and sets the new value based on the parameter/variable given
                const employee = await Employee.findOneAndUpdate(
                    { _id: args.id },
                    { $set: args },
                    { new: true }
                );

                // Returns a JSON object of updated details of employee
                return employee;
            } catch (err) {
                throw new Error('No user found. Verify the id and try again.')
            }
        },

        // Deletes a record of employee using ID
        deleteEmployee: async (parent, args) => {
            if (!args.id) {
                return null;
            }
            try {
                const employee = await Employee.findByIdAndDelete(args.id)
                // Returns a JSON object of the deleted employee
                return employee

            } catch (err) {
                throw new Error('No user found. Verify the id and try again.')
            }
        }
    }
}