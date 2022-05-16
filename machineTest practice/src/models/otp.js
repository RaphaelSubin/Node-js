module.exports = (sequelize,Datatypes) => {
    const authCode = sequelize.define('authCode',{
        forgotpwdCode : {
            type : Datatypes.INTEGER
        }
    },{
        freezeTableName : true
    })

    return authCode;
}

