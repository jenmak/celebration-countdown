import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true }
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Check if session is expired
    if (session.expires < new Date()) {
      // Delete expired session
      await prisma.session.delete({
        where: { sessionToken }
      });

      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      );
    }

    // Don't send sensitive information
    const { user } = session;
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 