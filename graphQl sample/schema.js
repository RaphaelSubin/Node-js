const {buildSchema} = require('graphql')

let message = 'hello how are you'

const schema = buildSchema(`
  type Post {
      userId : Int
      id : Int
      title : String
      body:String
  }
  type Student {
      name : String
      age :Int
      college: String
  }
  type Query {
      hello : String
      welcomeMsg(name : String): String
      getUser : Student
      getUserfromExternal : [Post]
  }

  type Mutation {
      setMessage(newMsg:String) : String
  }

`)

module.exports = schema;