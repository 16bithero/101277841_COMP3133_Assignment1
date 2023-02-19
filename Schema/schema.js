const { gql } = require('apollo-server-express')

exports.typeDef = gql `
    type Employee{
        id: ID!
        first_name: String!
        last_name: String!
        email: String!
        gender: String!
        salary: Float!
    }

    type Users{
        id: ID!
        username: String!
        email: String!
        password: String!
    }


    type Query {
        userLogin(username: String!, password: String!): String!
        getEmployees: [Employee]
        searchEmployeeID(id: ID!): Employee
    }

    type Mutation{
        addEmployee(
        first_name: String!
        last_name: String!
        email: String!
        gender: String!
        salary: Float!
        ): Employee

        addUser(
            username: String!
            email: String!
            password: String!
        ): Users

        updateEmployee(
            id: String!
            first_name: String!
            last_name: String!
            email: String!
            gender: String!
            salary: Float!
        ): Employee

        deleteEmployee(id: String!): Employee
    }
`