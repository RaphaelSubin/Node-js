module.exports = (sequelize,Datatypes) => {
    const Product = sequelize.define('product',{
        Name : {
            type : Datatypes.STRING,
            allowNull:false
        },
        Description : {
            type : Datatypes.STRING,
            allowNull:false
        },
        Unit_price : {
            type : Datatypes.INTEGER,
            allowNull:false
        }
    },{
        freezeTableName : true
    })

    // Product.sync().then(() => {
    //     Product.create({
    //         Name:'Maggi',
    //         Description:'Maggi',
    //         Unit_price : 25
    //     })
    // })

    Product.associate = (models) => {
        Product.hasMany(models.order_item,{
            foreignKey : 'product_id'
        })
    }

    return Product;
}