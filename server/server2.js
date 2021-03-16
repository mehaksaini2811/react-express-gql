const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { ApolloServer, gql } = require("apollo-server-express");
const config = require("./config/keys");
const User=require("./models/user")

const typeDefs = gql`
  type Query {
    user(id: ID!): User!
  }
  type Mutation {
    addUser(userInput: UserInput!): User!
  }
  type User {
    _id: ID!
    email: String!
    password: String!
  }
  input UserInput {
    email: String!
    password: String!
  }
`;
const resolvers = {
  Query: {
    user: async(parent,args,context,info) => {
        try{
            const user=await User.findOne({_id:args.id})
            return{
                ...user._doc
            }
        }
        catch(err){
            throw err
        }
      }
  },
  Mutation:{
    addUser:async (parent,args,context,info)=>{
        try{
            const user=new User({
                email:args.userInput.email,
                password:args.userInput.password
            })
            const result=await user.save()
            console.log("result:"+result)
            return{
                ...result._doc
            }
        }
        catch(err){
            console.log(err)
        }
      }
    }
  
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();
server.applyMiddleware({ app });

const PORT = process.env.PORT || 5000;

mongoose
  .connect(
    `mongodb+srv://${config.mongoDBUser}:${config.mongoDBPwd}@cluster0.xgyma.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
