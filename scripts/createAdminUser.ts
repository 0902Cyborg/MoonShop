
import { setupAdmin } from '../src/utils/setupAdmin';
import { updateAdminRoles } from './updateAdminRoles';

const createAdminUser = async () => {
  console.log('Creating admin user...');
  try {
    const success = await setupAdmin();
    
    if (success) {
      console.log('Admin user setup completed successfully.');
      console.log('To login as admin, use:');
      console.log('Email: admin@mondocartonking.com');
      console.log('Password: password123');
      console.log('\nIMPORTANT: Make sure to disable email confirmation in Supabase for testing.');
      
      // Also update all existing users to admin
      console.log('\nUpdating all existing users to admin role...');
      await updateAdminRoles();
    } else {
      console.error('Admin user setup failed.');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
};

createAdminUser();
