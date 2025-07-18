// models/salesforceToken.js
export default (sequelize, DataTypes) => {
  const SalesforceToken = sequelize.define('SalesforceToken', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    accessToken: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    instanceUrl: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tokenType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    scope: {
      type: DataTypes.STRING,
      allowNull: true
    },
    expiresIn: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'SalesforceTokens',
    timestamps: true
  });

  return SalesforceToken;
};