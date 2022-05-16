module.exports = (sequelize,Datatypes) => {
    const Order_item = sequelize.define('order_item',{
        qty : {
            type : Datatypes.INTEGER,
            allowNull : false
        },
        price : {
            type : Datatypes.INTEGER,
            allowNull : false
        },
        row_total : {
            type : Datatypes.INTEGER,
            allowNull:false
        }
    },{
        freezeTableName : true
    })
    Order_item.associate = (models) => {
        Order_item.belongsTo(models.order,{
            foreignKey : 'order_id'
        })
        Order_item.belongsTo(models.product,{
            foreignKey : 'product_id'
        })
    }

    return Order_item;
}