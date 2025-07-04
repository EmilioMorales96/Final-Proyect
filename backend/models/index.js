import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
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

const db = {};
db.sequelize = sequelize;
db.User = UserModel(sequelize, DataTypes);
db.Form = FormModel(sequelize, DataTypes);
db.Template = TemplateModel(sequelize, DataTypes);
db.Tag = TagModel(sequelize, DataTypes);
db.TemplateTag = TemplateTagModel(sequelize, DataTypes);
db.Favorite = FavoriteModel(sequelize, DataTypes);

// Relations
db.Form.belongsTo(db.User, { foreignKey: "userId" });
db.Form.belongsTo(db.Template, { foreignKey: "templateId" });

db.User.hasMany(db.Form, { foreignKey: "userId" });
db.Template.hasMany(db.Form, { foreignKey: "templateId" });

db.Template.belongsToMany(db.Tag, { through: db.TemplateTag, foreignKey: 'templateId' });
db.Tag.belongsToMany(db.Template, { through: db.TemplateTag, foreignKey: 'tagId' });

db.User.belongsToMany(db.Template, { through: db.Favorite, as: "Favorites", foreignKey: "userId" });
db.Template.belongsToMany(db.User, { through: db.Favorite, as: "FavoredBy", foreignKey: "templateId" });

export default db;