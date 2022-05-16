module.exports = (sequelize, Sequelize) => {
    const followers = sequelize.define('followers', {
        status: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
        },
    });
    
    followers.associate = (models) => {
        followers.belongsTo(models.travellers, {
            foreignKey: 'followersId',
            as: 'follower',
        });

        followers.belongsTo(models.travellers, {
            foreignKey: 'travellersId',
            as: 'travellers',
        });
        
    };
    
    
    return followers;
};
