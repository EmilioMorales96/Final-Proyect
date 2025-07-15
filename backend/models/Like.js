export default (sequelize, DataTypes) => {
  return sequelize.define('Like', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    templateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, { 
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'templateId'],
        name: 'user_template_unique'
      }
    ]
  });
};