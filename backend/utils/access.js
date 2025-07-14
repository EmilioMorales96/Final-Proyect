/**
 * Check if a user has access to a template
 * @param {Object} template - The template object
 * @param {number} userId - The user ID to check access for
 * @param {string} userRole - The user's role
 * @returns {boolean} - True if user has access, false otherwise
 */
const userHasAccess = (template, userId, userRole) => {
  // Admin users have access to all templates
  if (userRole === 'admin') return true;
  
  // Public templates are accessible to everyone
  if (template.isPublic) return true;
  
  // Authors have access to their own templates
  if (template.authorId === userId) return true;
  
  // Check if user is in the allowed users list
  let allowedUsers = [];
  if (template.accessUsers) {
    try {
      allowedUsers = typeof template.accessUsers === 'string' 
        ? JSON.parse(template.accessUsers) 
        : template.accessUsers;
    } catch (error) {
      console.error('Error parsing accessUsers:', error);
    }
  }
  
  if (Array.isArray(allowedUsers) && allowedUsers.includes(userId)) return true;
  
  return false;
};

/**
 * Alternative access check function for templates
 * Can be extended for more complex access logic
 * @param {Object} template - The template object
 * @param {number} userId - The user ID to check access for
 * @param {string} userRole - The user's role
 * @returns {boolean} - True if user can access, false otherwise
 */
const canAccessTemplate = (template, userId, userRole) => {
  return userHasAccess(template, userId, userRole);
};

/**
 * Middleware to check if user has admin role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

export { userHasAccess, canAccessTemplate };