const cmsData = (sequelize, DataTypes) => {
  const CmsData = sequelize.define('cmsData', {
    identifierCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    identifierName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 1,
      comment: '1- Active, 0- Inactive, 2- Deleted',
    },
  });

  CmsData.findByLogin = async (id) => {
    let fineOne = await CmsData.findOne({
      where: { id },
    });
    // eslint-disable-next-line no-undef
    if (!userOne) {
      fineOne = await CmsData.findOne({
        where: { id },
      });
    }
    return fineOne;
  };

  return CmsData;
};
export default cmsData;
