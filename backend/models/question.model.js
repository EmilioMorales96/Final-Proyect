export default (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    templateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('text', 'textarea', 'integer', 'checkbox', 'radio', 'select'),
      allowNull: false,
      defaultValue: 'text'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    questionText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    showInTable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    options: {
      type: DataTypes.JSON,
      allowNull: true,
    }
  }, { 
    timestamps: true,
    tableName: 'Questions'
  });

  return Question;
};