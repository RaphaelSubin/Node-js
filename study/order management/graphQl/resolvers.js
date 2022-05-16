const resolvers = {
    Mutation : {
        createOrder : async(_,args,{models}) =>{
            const order_details = args.Orders;
            for(let i=0; i<order_details.length; i++){
                const orderObj = order_details[i];
                const {prod_id,qty} = orderObj;
                const totalQty = totalQty+qty;
                //const unitPrize = await models.product.findOne({where:{price : Unit_price}})
                
            }

            

        }
    }
}

module.exports = resolvers;