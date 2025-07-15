/**
 * Authorization middleware for role-based access control
 * This file defines clear permissions for admin and regular users
 */

/**
 * Middleware to check if user has admin role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Admin access required. This action is restricted to administrators only.' 
    });
  }
  
  next();
};

/**
 * Middleware to check if user can access a resource
 * Users can access their own resources, admins can access any resource
 * @param {string} userIdParam - The parameter name containing the user ID (default: 'id')
 */
export const requireOwnershipOrAdmin = (userIdParam = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const resourceUserId = req.params[userIdParam];
    
    // Admin has access to everything
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Regular users can only access their own resources
    if (parseInt(resourceUserId) === req.user.id) {
      return next();
    }
    
    return res.status(403).json({ 
      message: 'Access denied. You can only access your own resources.' 
    });
  };
};

/**
 * Middleware to check if user can access a template/form resource
 * Users can access their own resources, admins can access any resource
 * @param {string} resourceModel - The model to check (Template, Form, etc.)
 * @param {string} resourceIdParam - The parameter name containing the resource ID
 */
export const requireResourceOwnershipOrAdmin = (resourceModel, resourceIdParam = 'id') => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Admin has access to everything
    if (req.user.role === 'admin') {
      return next();
    }

    try {
      const resourceId = req.params[resourceIdParam];
      const db = await import('../models/index.js');
      const resource = await db.default[resourceModel].findByPk(resourceId);
      
      if (!resource) {
        return res.status(404).json({ message: `${resourceModel} not found` });
      }
      
      // Check if user owns the resource
      if (resource.authorId === req.user.id || resource.userId === req.user.id) {
        return next();
      }
      
      return res.status(403).json({ 
        message: `Access denied. You can only access your own ${resourceModel.toLowerCase()}s.` 
      });
      
    } catch (error) {
      console.error('Error checking resource ownership:', error);
      return res.status(500).json({ message: 'Error checking permissions' });
    }
  };
};

/**
 * Check if user is blocked
 */
export const checkBlocked = (req, res, next) => {
  if (req.user && req.user.isBlocked) {
    return res.status(403).json({ 
      message: 'Your account has been blocked. Please contact an administrator.' 
    });
  }
  next();
};

/**
 * Middleware for form access control
 * Forms can be accessed by: form owner, template owner, or admin
 */
export const requireFormAccessOrAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Admin has access to everything
  if (req.user.role === 'admin') {
    return next();
  }

  try {
    const formId = req.params.id;
    const db = await import('../models/index.js');
    const { Form, Template } = db.default;
    
    const form = await Form.findByPk(formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const template = await Template.findByPk(form.templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Check if user is form owner, template owner, or admin
    const isFormOwner = form.userId === req.user.id;
    const isTemplateOwner = template.authorId === req.user.id;

    if (isFormOwner || isTemplateOwner) {
      return next();
    }

    return res.status(403).json({ 
      message: 'Access denied. You can only access forms you own or forms from your templates.' 
    });
    
  } catch (error) {
    console.error('Error checking form access:', error);
    return res.status(500).json({ message: 'Error checking permissions' });
  }
};

export default {
  requireAdmin,
  requireOwnershipOrAdmin,
  requireResourceOwnershipOrAdmin,
  requireFormAccessOrAdmin,
  checkBlocked
};
