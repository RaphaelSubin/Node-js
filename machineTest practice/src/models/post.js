module.exports = (sequelize,Datatypes) =>{
    const Post = sequelize.define('post',{
        subject : {
            type : Datatypes.STRING,
            allowNull : false
        },
        description : {
            type : Datatypes.STRING,
            allowNull : false
        },
        post_type : {
            type : Datatypes.STRING,
            allowNull : false
        }
    },{
        freezeTableName : true
    })
    Post.associate = (models) => {
        Post.belongsTo(models.user,{
            foreignKey:'userId',
            as:'user',
        }),
        Post.hasMany(models.comment,{
            foreignKey : 'postId'
        }),
        Post.hasOne(models.status,{
            foreignKey:'postId'
        })
    }
    return Post;
}