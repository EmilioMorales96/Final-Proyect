const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Like = sequelize.define('Like', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    templateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'user_template_unique'
    }
  });

  return Like;
};

const CommentModel = require('./comment.model');
db.Comment = CommentModel(sequelize);

const LikeModel = require('./like.model');
db.Like = LikeModel(sequelize);