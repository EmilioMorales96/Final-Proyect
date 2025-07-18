import { DataTypes } from 'sequelize';

/**
 * Migration to drop and recreate the 'topic' column in Templates as ENUM
 */
export const up = async (queryInterface, Sequelize) => {
  // 1. Elimina la columna 'topic'
  await queryInterface.removeColumn('Templates', 'topic');

  // 2. Crea la columna 'topic' como ENUM
  await queryInterface.addColumn('Templates', 'topic', {
    type: DataTypes.ENUM('Education', 'Quiz', 'Other'),
    allowNull: false,
    defaultValue: 'Other',
  });
};

/**
 * Rollback migration - revert ENUM back to STRING
 */
export const down = async (queryInterface, Sequelize) => {
  // 1. Elimina la columna 'topic' ENUM
  await queryInterface.removeColumn('Templates', 'topic');

  // 2. Crea la columna 'topic' como STRING
  await queryInterface.addColumn('Templates', 'topic', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Other',
  });
};
