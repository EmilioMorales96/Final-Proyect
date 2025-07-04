export default (sequelize, DataTypes) => {
  return sequelize.define("Favorite", {}, { timestamps: false });
};