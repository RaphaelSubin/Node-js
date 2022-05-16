const { default: axios } = require('axios')

const root = {
    hello : () => {
        return 'Hello world'
    },
    welcomeMsg : (args) => {
        console.log(args);
        return `Hey ${args.name} how are you`
    },
    getUser : () => {
        Student = {
            name : "subin",
            age : 21,
            college : "siena"
        }

        return Student;
    },
    getUserfromExternal :async () => {
        const result = await axios.get('https://jsonplaceholder.typicode.com/posts');
        return result.data;
    },
    setMessage : ({newMsg}) => {
        message = newMsg;
        return message;
    }

}

module.exports = root;