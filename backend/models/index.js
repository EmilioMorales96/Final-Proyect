import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DATABASE_URL, 
  {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

import UserModel from './user.model.js';
import FormModel from './form.model.js';
import TemplateModel from './template.model.js';
import TagModel from './Tag.js';
import TemplateTagModel from './TemplateTag.js';
import FavoriteModel from './Favorite.js';
import LikeModel from './Like.js';
import CommentModel from './Comment.js';

const db = {};
db.sequelize = sequelize;

// Definición de modelos
db.User = UserModel(sequelize, DataTypes);
db.Form = FormModel(sequelize, DataTypes);
db.Template = TemplateModel(sequelize, DataTypes);
db.Tag = TagModel(sequelize, DataTypes);
db.TemplateTag = TemplateTagModel(sequelize, DataTypes);
db.Favorite = FavoriteModel(sequelize, DataTypes);
db.Like = LikeModel(sequelize, DataTypes);
db.Comment = CommentModel(sequelize, DataTypes);

// Relación muchos a muchos para favoritos
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

// Relation for forms 
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

// Relación de autor
db.Template.belongsTo(db.User, { as: "author", foreignKey: "authorId" });
db.User.hasMany(db.Template, { as: "authoredTemplates", foreignKey: "authorId" });

db.Like.belongsTo(db.User, { foreignKey: "userId" });
db.Like.belongsTo(db.Template, { foreignKey: "templateId" });

db.Comment.belongsTo(db.User, { as: "User", foreignKey: "userId" });
db.Comment.belongsTo(db.Template, { foreignKey: "templateId" });

export default db;