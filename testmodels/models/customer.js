module.exports = (sequelize,Datatypes) => {
  const Customer = sequelize.define('Customer',{
      name : {
          type : Datatypes.STRING,
          allowNull : false
      },
      email : {
          type : Datatypes.STRING,
          allowNull : false
      },
      password : {
          type : Datatypes.STRING,
          allowNull : false
      }
  },{
      freezeTableName : true
  })
  Customer.associate = (models) => {
    Customer.hasOne(models.Channel,{
          foreignKey : 'Customer_Id'
      })
  }
  return Customer;
} 