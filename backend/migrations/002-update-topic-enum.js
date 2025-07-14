import { DataTypes } from 'sequelize';

/**
 * Migration to update template topic field from STRING to ENUM
 * This ensures data consistency and limits topic values to predefined categories
 */
export const up = async (queryInterface, Sequelize) => {
  // First, update existing data to valid ENUM values
  await queryInterface.sequelize.query(`
    UPDATE "Templates" 
    SET topic = CASE 
      WHEN LOWER(topic) LIKE '%education%' OR LOWER(topic) LIKE '%learn%' OR LOWER(topic) LIKE '%study%' THEN 'Education'
      WHEN LOWER(topic) LIKE '%quiz%' OR LOWER(topic) LIKE '%test%' OR LOWER(topic) LIKE '%exam%' THEN 'Quiz'
      ELSE 'Other'
    END;
  `);

  // Change column type to ENUM with predefined values
  await queryInterface.changeColumn('Templates', 'topic', {
    type: DataTypes.ENUM('Education', 'Quiz', 'Other'),
    allowNull: false,
  });
};

/**
 * Rollback migration - revert ENUM back to STRING
 */
export const down = async (queryInterface, Sequelize) => {
  await queryInterface.changeColumn('Templates', 'topic', {
    type: DataTypes.STRING,
    allowNull: false,
  });
};
