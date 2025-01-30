import { User } from '../src/models/User';
import connectDB from '../src/lib/mongodb';

async function createTestUser() {
  try {
    await connectDB();

    const testUser = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Check if user already exists
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('Test user already exists');
      process.exit(0);
    }

    // Create new user
    const user = await User.create(testUser);
    console.log('Created test user:', user);
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();
