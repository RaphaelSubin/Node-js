module.exports = (sequelize,Datatypes) =>{
    const Status = sequelize.define('status',{
        status_type : {
            type : Datatypes.STRING,
            allowNull : false
        }
    },{
        freezeTableName : true
    })
    Status.associate =(models) => {
        Status.belongsTo(models.post,{
            foreignKey : 'postId'
        })
    }

    return Status
}