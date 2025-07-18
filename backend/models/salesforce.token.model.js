import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const SalesforceToken = sequelize.define('SalesforceToken', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    accessToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instanceUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tokenType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scope: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expiresIn: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  return SalesforceToken;
};
