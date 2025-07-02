import sequelize from '../config/db.js';

import UserModel from './user.model.js';
import FormModel from './form.model.js';
import TemplateModel from './template.model.js';

const db = {};
db.sequelize = sequelize;
db.User = UserModel(sequelize);
db.Form = FormModel(sequelize);
db.Template = TemplateModel(sequelize);


db.Form.belongsTo(db.User, { foreignKey: "userId" });
db.Form.belongsTo(db.Template, { foreignKey: "templateId" });

db.User.hasMany(db.Form, { foreignKey: "userId" });
db.Template.hasMany(db.Form, { foreignKey: "templateId" });

export default db;