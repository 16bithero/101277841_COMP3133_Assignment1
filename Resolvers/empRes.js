const Employee = require('../Models/Employee')
const Users = require('../Models/Users')

exports.empResolver = {
    Query: {
        getEmployees: async (parent, args) => {
            return Employee.find({})
        },
        searchEmployeeID: async (parent, args) => {
            return Employee.findById(args.id)
        },
        userLogin: async (parent, args) => {

              const username = args.username
              const password = args.password
              const user = await Users.findOne({username})
            
                if(!user) {
                    throw new Error('No user found')
                }
                !user.comparePassword(password, (error, match) => {
                    if(!match){
                        throw new Error('Invalid password')
                    }
                })
                const message = "Login succesfull."
                return message

                
          }

          
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
                return null;
              }
              try {
                const employee = await Employee.findOneAndUpdate(
                  { _id: args.id },
                  { $set: args },
                  { new: true }
                );
                return employee;
              } catch (err) {
                throw new Error('No user found')
              }
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