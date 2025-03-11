import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, date } = body;

        if (!userId || !date) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Find or create the daily usage record
        let usage = await prisma.dailyPromptUsage.findUnique({
            where: {
                userId_date: {
                    userId,
                    date
                }
            }
        });

        if (!usage) {
            // First prompt of the day - create record with count 1
            usage = await prisma.dailyPromptUsage.create({
                data: {
                    userId,
                    date,
                    count: 1
                }
            });
        } else {
            // Increment existing count
            usage = await prisma.dailyPromptUsage.update({
                where: {
                    id: usage.id
                },
                data: {
                    count: {
                        increment: 1
                    }
                }
            });
        }

        return NextResponse.json({ count: usage.count });
    } catch (error) {
        console.error('Error tracking prompt usage:', error);
        return NextResponse.json({ error: 'Failed to track prompt usage' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');
        const date = url.searchParams.get('date');

        if (!userId || !date) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const usage = await prisma.dailyPromptUsage.findUnique({
            where: {
                userId_date: {
                    userId,
                    date
                }
            }
        });

        return NextResponse.json({ count: usage?.count || 0 });
    } catch (error) {
        console.error('Error getting prompt usage:', error);
        return NextResponse.json({ error: 'Failed to get prompt usage' }, { status: 500 });
    }
}