import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id')
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const where: any = {
      OR: [
        { ownerId: userId },
        { collaborators: { some: { userId } } },
        { sharedWith: { some: { friendId: userId } } }
      ]
    }

    if (month) {
      where.date = {
        gte: new Date(new Date().getFullYear(), parseInt(month), 1),
        lt: new Date(new Date().getFullYear(), parseInt(month) + 1, 1),
      }
    }

    const birthdays = await prisma.birthday.findMany({
      where,
      include: {
        sharedWith: {
          include: {
            friend: true,
          },
        },
        collaborators: true,
      },
      orderBy: {
        date: 'asc',
      },
    })

    return NextResponse.json(birthdays)
  } catch (error) {
    console.error('Error fetching birthdays:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id')
    const body = await request.json()
    const { name, date, notes } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!name || !date) {
      return NextResponse.json(
        { error: 'Name and date are required' },
        { status: 400 }
      )
    }

    const birthday = await prisma.birthday.create({
      data: {
        name,
        date: new Date(date),
        notes,
        ownerId: userId,
      },
    })

    return NextResponse.json(birthday)
  } catch (error) {
    console.error('Error creating birthday:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const userId = request.headers.get('x-user-id')
    const body = await request.json()
    const { id, name, date, notes } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Birthday ID is required' },
        { status: 400 }
      )
    }

    // Check if user has permission to update this birthday
    const birthday = await prisma.birthday.findFirst({
      where: {
        id,
        OR: [
          { ownerId: userId },
          { collaborators: { some: { userId } } }
        ]
      }
    })

    if (!birthday) {
      return NextResponse.json(
        { error: 'Not authorized to update this birthday' },
        { status: 403 }
      )
    }

    const updatedBirthday = await prisma.birthday.update({
      where: { id },
      data: {
        name,
        date: date ? new Date(date) : undefined,
        notes,
      },
    })

    return NextResponse.json(updatedBirthday)
  } catch (error) {
    console.error('Error updating birthday:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = request.headers.get('x-user-id')
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Birthday ID is required' },
        { status: 400 }
      )
    }

    // Check if user has permission to delete this birthday
    const birthday = await prisma.birthday.findFirst({
      where: {
        id,
        ownerId: userId // Only owner can delete
      }
    })

    if (!birthday) {
      return NextResponse.json(
        { error: 'Not authorized to delete this birthday' },
        { status: 403 }
      )
    }

    await prisma.birthday.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting birthday:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 