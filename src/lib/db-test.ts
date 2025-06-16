import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  try {
    // Test 1: Basic connection
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Test 2: Create a test user
    console.log('\nCreating a test user...');
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password_here', // In production, this would be properly hashed
      },
    });
    console.log('✅ Test user created:', testUser);

    // Test 3: Query the user
    console.log('\nQuerying test user...');
    const foundUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });
    console.log('✅ User found:', foundUser);

    // Test 4: Delete the test user
    console.log('\nCleaning up - deleting test user...');
    await prisma.user.delete({
      where: { email: 'test@example.com' },
    });
    console.log('✅ Test user deleted');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the tests
testDatabaseConnection(); 