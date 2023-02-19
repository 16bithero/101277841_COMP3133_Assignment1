const Employee = require('../Models/Employee')
const Users = require('../Models/Users')

exports.empResolver = {
    Query: {
        getEmployees: async (parent, args) => {
            return Employee.find({})
        },
        getEmployeeByID: async (parent, args) => {
            return Employee.findById(args.id)
        },
        userLogin: async (parent, args) => {
          
            // Perform a query to find a user with the provided username and password
            const user = Users.findOne({ username: args.username, password: args.password });
      
            // If a user was found, return a successful authentication result
            if (user) {
              return {
                token: 'myauthtoken',
                user: {
                  id: user._id.toString(),
                  username: user.username,
                  email: user.email,
                  // Other user fields
                },
              };
            } else {
              // If a user was not found, return an unsuccessful authentication result
              return null;
            }
          },
    },

    Mutation: {
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
                if (error.code === 11000) {
                    throw new Error('Email already exists. Please use a different email.')
                } else if (error && error.errors && error.errors.email) {
                    throw new Error('Invalid email. Please check the entry and try again.');
                }

                else {
                    throw error
                }
            }

        },

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

                else {
                    throw error
                }
            }
        },



        updateEmployee: async (parent, args) => {
            if (!args.id) {
                return;
            }

            return await Employee.findOneAndUpdate(
                {
                    _id: args.id
                },
                {
                    $set: {
                        first_name: args.first_name,
                        last_name: args.last_name,
                        email: args.email,
                        gender: args.gender,
                        salary: args.salary
                    }
                }, { new: true }, (err, employee) => {
                    if (err) {
                        console.log('Update failed. Please check input and try again.');
                    } else {
                        return employee
                    }
                }
            );
        },
        deleteEmployee: async (parent, args) => {
            console.log(args)
            if (!args.id) {
                return JSON.stringify({ status: false, "message": "Employee not found" });
            }
            return await Employee.findByIdAndDelete(args.id)
        }
    }
}