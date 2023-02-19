const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
var { graphqlHTTP }  = require('express-graphql');

//Import schema and resolvers
const empTypeDef = require('./Schema/employee')
const empRes = require('./Resolvers/empRes')

//import ApolloServer
const { ApolloServer } = require('apollo-server-express')

//Store MongoDB key and port
const dotenv = require('dotenv');
dotenv.config();

//mongoDB Atlas Connection String
const mongodb_atlas_url = process.env.MONGODB_URL;

//Connect to MongoDB
mongoose.connect(mongodb_atlas_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(success => {
    console.log('Success Mongodb connection')
  }).catch(err => {
    console.log('Error Mongodb connection')
  });

//Define Apollo Server
const server = new ApolloServer({
    typeDefs: empTypeDef.employeeTypeDef,
    resolvers: empRes.empResolver,
    formatError: (error) => {
        const message = error.message;
        return { message };
      },
  })
  
// // Start the Apollo Server
// async function startServer() {
//     await server.start();
//   }
  
//   startServer();

//Define Express Server
const app = express();
app.use(bodyParser.json());
app.use('*', cors());

//Add Express app as middleware to Apollo Server
server.applyMiddleware({app})

//console.log(server)

//Start listen 
app.listen({ port: process.env.PORT }, () =>
console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`));