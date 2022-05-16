module.exports = (sequelize,Datatypes) => {
    const User = sequelize.define('User',{
        username : {
            type : Datatypes.STRING,
            allowNull : false
        },
        email : {
            type : Datatypes.STRING,
            allowNull : false
        },
        phoneNo : {
            type : Datatypes.INTEGER,
            allowNull : false
        },
        password : {
            type : Datatypes.STRING,
            allowNull : false
        }
    },{
        freezeTableName: true
    })
    // User.associate = function(models){
    //     User.hasMany(models.Post);
    // }
    return User;
}

  