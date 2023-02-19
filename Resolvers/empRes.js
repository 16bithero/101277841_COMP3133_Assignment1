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
            return Users.find({})
        }
    },

    Mutation: {
        addEmployee: async (parent, args) => {
            try {
              const newEmp = new Employee({
                first_name: args.first_name,
                last_name: args.last_name,
                email: args.email,
                gender: args.gender,
                salary: args.salary,
              })
      
              const error = newEmp.validateSync();
              if (error && error.errors && error.errors.email) {
                throw new Error('Invalid email. Please check the entry and try again.');
              }
              
              return newEmp.save()
            } catch (err) {
              throw err
            }
          },
      
        addUser: async (parent, args) => {
            let newUser = new Users({
                username: args.username,
                email: args.email,
                password: args.password
            })
            return newUser.save()
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