export default (sequelize, DataTypes) => {
  // This is the join table for the many-to-many relation between Template and Tag
  const TemplateTag = sequelize.define("TemplateTag", {}, { timestamps: false });
  return TemplateTag;
};