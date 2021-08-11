// Express for server side scripting
const express = require('express');

// jwt for auth token management
const jwt = require('jsonwebtoken');
// Helmet for http header management and security
const helmet = require('helmet');
// Cross origin resource sharing
const cors = require('cors');
// Environment variable
require('dotenv').config();

// Connecting to database 
const DB_HOST = process.env.DB_HOST
const db = require('./db');
db.connect(DB_HOST);
const models = require('./models')

// Setting up GraphQL server
// Apollo server for graph ql
const {ApolloServer} = require('apollo-server-express');
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

async function startServer(app) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:async ({req})=>{
      return {models};
    }
  })
  await server.start();
  server.applyMiddleware({app,path:'/api'});
}
//Express server setup
const port = process.env.PORT || 4000;
const app = express();
app.use(helmet());
app.use(cors());
startServer(app).then(()=>{
  app.listen({port},()=>{
    console.log(
      `GraphQL Server perfectly running successfully at port ${port}`
    )
  })
})
