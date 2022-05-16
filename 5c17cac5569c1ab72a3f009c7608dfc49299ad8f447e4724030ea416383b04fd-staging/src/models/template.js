const templates = (sequelize, DataTypes) => {
  const Templates = sequelize.define('templates', {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sourceType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
  });

  templates.findByLogin = async (id) => {
    let templateOne = await templates.findOne({
      where: { id },
    });
    if (!templateOne) {
      templateOne = await templates.findOne({
        where: { id },
      });
    }
    return templateOne;
  };

  return Templates;
};
export default templates;
