module.exports = (sequelize,Datatypes) => {
    const Customer = sequelize.define('customer',{
       Name : {
           type : Datatypes.STRING,
           allowNull:false
       },
       Phone : {
            type : Datatypes.STRING,
            allowNull:false
       },
       Email : {
            type : Datatypes.STRING,
            allowNull:false
       }
    },{
        freezeTableName:true
    })
    Customer.associate = (models) => {
        Customer.hasMany(models.order,{
            forignKey : 'Customer_id'
        })
    }

    // Customer.sync().then(() => {
    //     Customer.create({
    //         Name:'jose',
    //         Phone:'321654987',
    //         Email:'jose@abc.com'
    //     })
    // })
    return Customer;
}