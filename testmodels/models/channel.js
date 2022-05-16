module.exports = (sequelize,Datatypes) => {
  const Channel = sequelize.define('Channel',{
      name : {
          type : Datatypes.STRING,
          allowNull : false
      },
      about : {
          type : Datatypes.STRING,
          allowNull : false
      }
  },{
      freezeTableName : true
  })
  Channel.associate = (models) => {
    Channel.belongsTo(models.Customer,{
          foreignKey : 'Customer_Id'
      })
  }
  return Channel;
} 