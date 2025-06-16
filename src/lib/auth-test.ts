// import { PrismaClient } from '@prisma/client';
// import { scrypt, randomBytes } from 'crypto';
// import { createAuthClient } from 'better-auth';
// import { auth } from './auth.ts';

// const prisma = new PrismaClient();

// // Debug: Check if DATABASE_URL is set
// console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

// async function testAuth() {
//   console.log('🧪 Starting authentication tests...\n');

//   try {
//     // Test database connection
//     console.log('🔌 Testing database connection...');
//     await prisma.$connect();
//     console.log('✅ Database connection successful\n');

//     // Create a test user
//     console.log('1️⃣ Creating or updating test user...');
//     const hashedPassword = await hashPassword('test123');
//     console.log('hashedPassword', hashedPassword);
//     const user = await prisma.user.upsert({
//       where: { email: 'test@example.com' },
//       update: { password: hashedPassword },
//       create: {
//         email: 'test@example.com',
//         password: hashedPassword,
//       },
//     });
//     console.log('✅ Test user created or updated:', user);

//     // Test login
//     console.log('\n2️⃣ Testing login...');
//     const loginResult = await auth.api.signInEmail({
//       body: {
//         email: 'test@example.com',
//         password: hashedPassword,
//       }
//     });
//     console.log('✅ Login successful:', loginResult);

//     // Test session verification
//     console.log('\n3️⃣ Testing session verification...');
//     const session = await auth.api.getSession();
//     console.log('✅ Session verified:', session);

//   } catch (error) {
//     console.error('❌ Test failed:', error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// // Helper function to hash passwords
// async function hashPassword(password: string): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const salt = randomBytes(16).toString('hex');
//     scrypt(password, salt, 64, (err, derivedKey) => {
//       if (err) reject(err);
//       resolve(salt + ':' + derivedKey.toString('hex'));
//     });
//   });
// }

// // Run the tests
// testAuth(); 