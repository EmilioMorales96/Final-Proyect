// Migración deshabilitada para evitar errores con valores ENUM inválidos
// import { DataTypes } from 'sequelize';

// /**
//  * Migration to clean up invalid topic values before ENUM conversion
//  */
// export const up = async (queryInterface, Sequelize) => {
//   // Cambia todos los valores 'General' a 'Other' en la columna topic
//   await queryInterface.sequelize.query(`
//     UPDATE "Templates" SET "topic" = 'Other' WHERE "topic" = 'General';
//   `);
// };

// export const down = async (queryInterface, Sequelize) => {
//   // Opcional: revertir los valores 'Other' a 'General' si lo necesitas
//   // await queryInterface.sequelize.query(`
//   //   UPDATE "Templates" SET "topic" = 'General' WHERE "topic" = 'Other';
//   // `);
// };
