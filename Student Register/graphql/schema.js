const { buildSchema } = require("graphql");

let schema = buildSchema(`
type Student {
    name:String
    username:String
    password:String
    age:Int
}
type Query {
   userDetails : [Student]
}
`);

module.exports = schema;
