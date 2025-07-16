import { DataTypes } from 'sequelize';

export const up = async (queryInterface) => {
  await queryInterface.addColumn('Users', 'googleId', {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  });

  await queryInterface.addColumn('Users', 'emailVerified', {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  });

  await queryInterface.addColumn('Users', 'firstName', {
    type: DataTypes.STRING,
    allowNull: true
  });

  await queryInterface.addColumn('Users', 'lastName', {
    type: DataTypes.STRING,
    allowNull: true
  });

  // Make password nullable for OAuth users
  await queryInterface.changeColumn('Users', 'password', {
    type: DataTypes.STRING,
    allowNull: true
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('Users', 'googleId');
  await queryInterface.removeColumn('Users', 'emailVerified');
  await queryInterface.removeColumn('Users', 'firstName');
  await queryInterface.removeColumn('Users', 'lastName');
  
  // Revert password to not nullable
  await queryInterface.changeColumn('Users', 'password', {
    type: DataTypes.STRING,
    allowNull: false
  });
};
