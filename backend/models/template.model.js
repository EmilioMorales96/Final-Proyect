import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Template = sequelize.define('Template', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    topic: {
      type: DataTypes.ENUM('Education', 'Quiz', 'Other'),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tags: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    accessUsers: {
      type: DataTypes.STRING, // Cambiado a STRING
      allowNull: true,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    questions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    questionText: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    showInTable: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    required: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  });

  return Template;
};