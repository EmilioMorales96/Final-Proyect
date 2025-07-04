export default (sequelize, DataTypes) => {
  const Favorite = sequelize.define("Favorite", {}, { timestamps: false });
  Favorite.associate = (models) => {
    Favorite.belongsToMany(models.User, {
      through: "UserFavorites",
      as: "FavoredBy",
      foreignKey: "favoriteId",
      otherKey: "userId",
    });
  };
  return Favorite;
};