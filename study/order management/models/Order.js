module.exports = (sequelize,Datatypes) => {
    const Order = sequelize.define('order',{
        Total_Qty : {
            type : Datatypes.INTEGER,
            allowNull:false
        },
        Total_Price : {
            type : Datatypes.STRING,
            allowNull:false
        }
    },{
        freezeTableName : true
    })
    Order.associate = (models) => {
        Order.belongsTo(models.customer,{
            foreignKey : 'Customer_id'
        })
        Order.hasMany(models.order_item,{
            foreignKey : 'order_id'
        })
    }

    return Order;
}