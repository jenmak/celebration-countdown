import { betterAuth } from 'better-auth';
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Debug: Check if DATABASE_URL is set
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "sqlite", etc.
    userModel: {
      fields: {
        password: 'password',
      },
    },
  }),
  emailAndPassword: {
    enabled: true,
    passwordHashing: {
      algorithm: 'bcrypt',
      saltRounds: 10,
    },
  },
  // Configure email settings for password reset and verification
  email: {
    from: process.env.EMAIL_FROM || 'hello@celebrationcountdown.app',
    transport: {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    },
  },
  // Configure session settings
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    modelName: 'Session',
    fields: {
      userId: 'userId',
      expiresAt: 'expiresAt',
      token: 'token',
    },
  },
  // Configure pages
  pages: {
    signIn: '/login',
    signUp: '/signup',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    verifyEmail: '/verify-email',
  },
}); 