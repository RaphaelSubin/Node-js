module.exports = (sequelize,Datatypes) => {
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
        },
        status : {
            type : Datatypes.STRING,
            allowNull:false
        }
    },{
        freezeTableName : true
    })
    // Post.associate = function(models){
    //     Post.belongsTo(models.User);
    // }
    return Post
}