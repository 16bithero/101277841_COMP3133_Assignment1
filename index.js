// Importing required modules and packages
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

// Import schema and resolvers
const TypeDef = require('./Schema/schema')
const Resolver = require('./Resolvers/resolver')

// Import Apollo Server
const { ApolloServer } = require('apollo-server-express')

// Store MongoDB key and port in .env file
const dotenv = require('dotenv');
dotenv.config();

// MongoDB Atlas Connection String
const mongodb_atlas_url = process.env.MONGODB_URL;

// Connect to MongoDB
mongoose.connect(mongodb_atlas_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(success => {
    console.log('Success Mongodb connection')
}).catch(err => {
    console.log('Error Mongodb connection')
});

// Define Apollo Server
const server = new ApolloServer({
    typeDefs: TypeDef.typeDef,
    resolvers: Resolver.resolver,

    // Added a formatting so stacktrace is hidden in error message
    formatError: (error) => {
        const message = error.message;
        return { message };
    },
})

// Define Express Server
const app = express();
app.use(bodyParser.json());
app.use('*', cors());

// Express as middleware to our Apollo Server
server.applyMiddleware({ app })


//Listen to designated port
app.listen({ port: process.env.PORT }, () =>
console.log(`Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`));