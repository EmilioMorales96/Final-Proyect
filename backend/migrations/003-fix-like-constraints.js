/**
 * Migration to fix Like table constraints
 * This migration ensures the Like table has the correct unique constraint
 */
export default {
  up: async (queryInterface, Sequelize) => {
    try {
      // First, try to drop the old constraint if it exists
      try {
        await queryInterface.removeConstraint('Likes', 'user_template_unique');
        console.log('Removed old constraint');
      } catch (err) {
        console.log('Old constraint not found or already removed');
      }

      // Add the correct unique constraint for the combination of userId and templateId
      await queryInterface.addConstraint('Likes', {
        fields: ['userId', 'templateId'],
        type: 'unique',
        name: 'likes_user_template_unique'
      });

      console.log('Added new unique constraint for userId + templateId');
    } catch (error) {
      console.error('Error in migration:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the constraint we added
    await queryInterface.removeConstraint('Likes', 'likes_user_template_unique');
  }
};
