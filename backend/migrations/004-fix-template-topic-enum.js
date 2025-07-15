/**
 * Migration to fix Templates topic enum values
 * This migration updates existing "General" values to "Other" and ensures enum compatibility
 */
export default {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log('Starting Templates topic enum migration...');
      
      // Step 1: Update all "General" values to "Other" in existing data
      await queryInterface.sequelize.query(`
        UPDATE "Templates" 
        SET "topic" = 'Other' 
        WHERE "topic" = 'General';
      `);
      console.log('Updated General topics to Other');
      
      // Step 2: Update any other non-conforming values to "Other"
      await queryInterface.sequelize.query(`
        UPDATE "Templates" 
        SET "topic" = 'Other' 
        WHERE "topic" NOT IN ('Education', 'Quiz', 'Other');
      `);
      console.log('Updated non-conforming topics to Other');
      
      // Step 3: Drop existing enum type if it exists
      try {
        await queryInterface.sequelize.query(`
          DROP TYPE IF EXISTS "public"."enum_Templates_topic";
        `);
        console.log('Dropped existing enum type');
      } catch (err) {
        console.log('No existing enum type to drop');
      }
      
      // Step 4: Create new enum type
      await queryInterface.sequelize.query(`
        CREATE TYPE "public"."enum_Templates_topic" AS ENUM('Education', 'Quiz', 'Other');
      `);
      console.log('Created new enum type');
      
      // Step 5: Update column to use new enum (with USING clause to handle conversion)
      await queryInterface.sequelize.query(`
        ALTER TABLE "Templates" 
        ALTER COLUMN "topic" TYPE "public"."enum_Templates_topic" 
        USING "topic"::"public"."enum_Templates_topic";
      `);
      console.log('Updated column to use new enum type');
      
      console.log('Templates topic enum migration completed successfully');
      
    } catch (error) {
      console.error('Error in Templates topic enum migration:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Revert the enum change
      await queryInterface.sequelize.query(`
        ALTER TABLE "Templates" ALTER COLUMN "topic" TYPE VARCHAR(50);
      `);
      
      await queryInterface.sequelize.query(`
        DROP TYPE IF EXISTS "public"."enum_Templates_topic";
      `);
      
      console.log('Reverted Templates topic enum migration');
    } catch (error) {
      console.error('Error reverting Templates topic enum migration:', error);
      throw error;
    }
  }
};
