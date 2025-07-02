const userHasAccess = (template, userId, userRole) => {
  // Onlt admins and the template author can access it
  return (
    userRole === 'admin' ||
    template.authorId === userId
  );
};

const canAccessTemplate = (template, userId, userRole) => {
  // similar to userHasAccess, but can be extended for more complex logic
  return userHasAccess(template, userId, userRole);
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de admin.' });
  }
  next();
};

export { userHasAccess, canAccessTemplate };