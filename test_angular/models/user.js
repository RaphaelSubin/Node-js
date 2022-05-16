module.exports = (sequelize,Datatypes) => {
    const User = sequelize.define('user',{
        firstName : {
            type : Datatypes.STRING,
        },
        lastName : {
            type : Datatypes.STRING,
        },
        email : {
            type : Datatypes.STRING,
        },
        phoneNo : {
            type : Datatypes.STRING,
        },
        password : {
            type : Datatypes.STRING,
        },
    },{
        freezeTableName : true
    })

    return User;
}