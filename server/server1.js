const express = require("express");
const app = express();
const { graphqlHTTP } = require("express-graphql");
const bodyParser = require("body-parser");
const { buildSchema } = require("graphql");
const expressPlayground = require("graphql-playground-middleware-express")
  .default;
const mongoose = require("mongoose");
const config = require("./config/keys");
const User=require("./models/user")
const cors=require('cors')

app.use(cors())
app.use(bodyParser.json());

app.get("/playground", expressPlayground({ endpoint: "/graphql" }));
console.log("here")
app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
            type RootQuery{
                user(id:ID!):User!
            }
            type RootMutation{
                addUser(userInput:UserInput!):User!
            }
            type User{
                _id:ID!,
                email:String!,
                password:String!
            }
            input UserInput{
                email:String!,
                password:String!
            }
            schema{
                query: RootQuery
                mutation:RootMutation
            }
        `),
    rootValue: {
      user: async(args) => {
        try{
            const user=await User.findOne({_id:args.id})
            return{
                ...user._doc
            }
        }
        catch(err){
            throw err
        }
      },
      addUser:async (args)=>{
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
    },
    graphiql: true,
  })
);

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
