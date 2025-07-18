'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('SalesforceTokens', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
    },
    accessToken: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    refreshToken: {
      type: Sequelize.TEXT
    },
    instanceUrl: {
      type: Sequelize.TEXT
    },
    tokenType: {
      type: Sequelize.STRING
    },
    scope: {
      type: Sequelize.STRING
    },
    expiresIn: {
      type: Sequelize.INTEGER
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('SalesforceTokens');
}
