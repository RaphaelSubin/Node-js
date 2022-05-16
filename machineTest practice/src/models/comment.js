module.exports = (sequelize,Datatypes) =>{
    const Comment = sequelize.define('comment',{
        comment : {
            type : Datatypes.STRING,
            allowNull : false
        }
    },{
        freezeTableName : true
    })
    Comment.associate = (models) => {
        Comment.belongsTo(models.user,{
            foreignKey:'userId',
        })
        Comment.belongsTo(models.post,{
            foreignKey : 'postId',
            as : 'post'
        })
    }

    return Comment
}