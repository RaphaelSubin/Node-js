const express = require('express')
const schema = require('./schema')
const {graphqlHTTP} = require('express-graphql')
const root = require('./resolver')


const app = express()


app.use('/graphql',graphqlHTTP({
    graphiql:true,
    schema:schema,
    rootValue:root
}))

app.listen(4000, () => {
    console.log('server listening on 4000');
})