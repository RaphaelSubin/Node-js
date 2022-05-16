module.exports = (sequelize,Datatypes) => {
  const Video = sequelize.define('Video',{
      title : {
          type : Datatypes.STRING,
          allowNull : false
      },
      description : {
          type : Datatypes.STRING,
          allowNull : false
      }
  },{
      freezeTableName : true
  })
  Video.associate = (models) => {
    Video.belongsTo(models.Channel,{
          foreignKey : 'Channel_Id'
      })
  }
  return Video;
} 