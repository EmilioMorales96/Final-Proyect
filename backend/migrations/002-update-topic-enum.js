import { DataTypes } from 'sequelize';

/**
 * Migration to update template topic field from STRING to ENUM
 * This ensures data consistency and limits topic values to predefined categories
 */
export const up = async (queryInterface, Sequelize) => {
  // 1. Cambia la columna a ENUM (esto crea el tipo)
  await queryInterface.changeColumn('Templates', 'topic', {
    type: DataTypes.ENUM('Education', 'Quiz', 'Other'),
    allowNull: false,
  });

  // 2. Actualiza los datos existentes usando el cast a ENUM
  await queryInterface.sequelize.query(`
    UPDATE "Templates" 
    SET topic = CASE 
      WHEN LOWER(topic::text) LIKE '%education%' OR LOWER(topic::text) LIKE '%learn%' OR LOWER(topic::text) LIKE '%study%' THEN 'Education'::enum_Templates_topic
      WHEN LOWER(topic::text) LIKE '%quiz%' OR LOWER(topic::text) LIKE '%test%' OR LOWER(topic::text) LIKE '%exam%' THEN 'Quiz'::enum_Templates_topic
      ELSE 'Other'::enum_Templates_topic
    END;
  `);
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
