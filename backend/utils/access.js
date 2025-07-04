const userHasAccess = (template, userId, userRole) => {
  if (userRole === 'admin') return true;
  if (template.isPublic) return true;
  if (template.authorId === userId) return true;
  if (Array.isArray(template.allowedUsers) && template.allowedUsers.includes(userId)) return true;
  return false;
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

export function userHasAccess(template, userId, userRole) {
  if (userRole === 'admin') return true;
  if (template.isPublic) return true;
  if (template.authorId === userId) return true;
  if (Array.isArray(template.allowedUsers) && template.allowedUsers.includes(userId)) return true;
  return false;
}

export { userHasAccess, canAccessTemplate };