const express = require("express");
const app = express();
const { graphqlHTTP } = require("express-graphql");
const bodyParser = require("body-parser");
const { buildSchema } = require("graphql");
const expressPlayground = require("graphql-playground-middleware-express")
  .default;
const mongoose = require("mongoose");
const config = require("./config/keys");

app.use(bodyParser.json());

app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
            type RootQuery{
                hello:String!
            }
            type RootMutation{
                somemutation:String!
            }
            schema{
                query: RootQuery
                mutation:RootMutation
            }
        `),
    rootValue: {
      hello: () => {
        return "Hello back";
      },
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
