import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    console.log('Auth request received:', { action, data });

    if (action === 'signup') {
      try {
        // Hash the password before creating the user
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create the user with the hashed password
        const user = await prisma.user.create({
          data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
          },
        });

        console.log('User created:', user);
        return NextResponse.json({ user });
      } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
          { error: 'Signup failed', details: error instanceof Error ? error.message : 'Unknown error' },
          { status: 500 }
        );
      }
    }

    if (action === 'signin') {
      try {
        // Find the user by email
        const user = await prisma.user.findUnique({
          where: { email: data.email },
        });

        if (!user) {
          return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
          );
        }

        // Verify the password
        const isValidPassword = await bcrypt.compare(data.password, user.password);
        if (!isValidPassword) {
          return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
          );
        }

        // Create a session
        const session = await prisma.session.create({
          data: {
            userId: user.id,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            sessionToken: Math.random().toString(36).substring(2),
          },
        });

        // Create the response
        const response = NextResponse.json({
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        });

        // Set the session cookie
        response.cookies.set('session_token', session.sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
        });

        console.log('Signin successful:', { user, session });
        return response;
      } catch (error) {
        console.error('Signin error:', error);
        return NextResponse.json(
          { error: 'Signin failed', details: error instanceof Error ? error.message : 'Unknown error' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('General auth error:', error);
    return NextResponse.json(
      {
        error: 'Authentication failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 