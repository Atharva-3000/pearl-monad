import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Create Prisma client instance
const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { did } = await req.json();

        if (!did) {
            return NextResponse.json(
                { error: 'DID is required' },
                { status: 400 }
            );
        }

        // Change 'did' to 'id' here to match your schema
        const user = await prisma.user.findUnique({
            where: {
                id: did  // This should match your database schema
            },
            select: {
                privateKey: true
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ privateKey: user.privateKey });

    } catch (error) {
        console.error('Error fetching private key:', error);
        return NextResponse.json(
            { error: 'Failed to fetch private key' },
            { status: 500 }
        );
    }
}