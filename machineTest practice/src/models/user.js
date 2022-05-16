const { user } = require("pg/lib/defaults")

module.exports = (sequelize,Datatypes) => {
    const User = sequelize.define('user',{
        name : {
            type : Datatypes.STRING,
            allowNull : false
        },
        email : {
            type : Datatypes.STRING,
            allowNull : false
        },
        phoneNo : {
            type : Datatypes.STRING,
            allowNull : false,
            unique: true
        },
        password : {
            type : Datatypes.STRING,
            allowNull : false
        }
    },{
        freezeTableName : true
    })
    User.associate = (models) => {
        User.hasMany(models.post,{
            foreignKey : 'userId'
        })
        User.hasMany(models.comment,{
            foreignKey:'userId'
        })
    }
    return User;
} 