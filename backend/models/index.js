import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Import model definitions
import UserModel from './user.model.js';
import FormModel from './form.model.js';
import TemplateModel from './template.model.js';
import TagModel from './Tag.js';
import TemplateTagModel from './TemplateTag.js';
import FavoriteModel from './Favorite.js';
import LikeModel from './Like.js';
import CommentModel from './Comment.js';

// Database object to hold sequelize instance and models
const db = {};
db.sequelize = sequelize;

// Initialize models
db.User = UserModel(sequelize, DataTypes);
db.Form = FormModel(sequelize, DataTypes);
db.Template = TemplateModel(sequelize, DataTypes);
db.Tag = TagModel(sequelize, DataTypes);
db.TemplateTag = TemplateTagModel(sequelize, DataTypes);
db.Favorite = FavoriteModel(sequelize, DataTypes);
db.Like = LikeModel(sequelize, DataTypes);
db.Comment = CommentModel(sequelize, DataTypes);

// Define model associations

// Many-to-many relationship for favorites
db.User.belongsToMany(db.Template, {
  through: db.Favorite,
  as: "Favorites",
  foreignKey: "userId",
  otherKey: "templateId"
});
db.Template.belongsToMany(db.User, {
  through: db.Favorite,
  as: "FavoredBy",
  foreignKey: "templateId",
  otherKey: "userId"
});

// Many-to-many relationship for template tags
db.Template.belongsToMany(db.Tag, {
  through: db.TemplateTag,
  as: "Tags",
  foreignKey: "templateId",
  otherKey: "tagId"
});
db.Tag.belongsToMany(db.Template, {
  through: db.TemplateTag,
  as: "Templates",
  foreignKey: "tagId",
  otherKey: "templateId"
});

// Template author relationship
db.Template.belongsTo(db.User, { as: "author", foreignKey: "authorId" });
db.User.hasMany(db.Template, { as: "authoredTemplates", foreignKey: "authorId" });

// Like relationships
db.Like.belongsTo(db.User, { foreignKey: "userId" });
db.Like.belongsTo(db.Template, { foreignKey: "templateId" });

// Comment relationships
db.Comment.belongsTo(db.User, { as: "User", foreignKey: "userId" });
db.Comment.belongsTo(db.Template, { foreignKey: "templateId" });

// Form relationships
db.Form.belongsTo(db.User, { foreignKey: "userId" });
db.Form.belongsTo(db.Template, { foreignKey: "templateId" });
db.User.hasMany(db.Form, { foreignKey: "userId" });
db.Template.hasMany(db.Form, { foreignKey: "templateId" });

export default db;