import { NextRequest } from 'next/server';
// import { PrismaClient } from '@prisma/client';
import { getPrivateKeyForUser } from '@/lib/auth/session';

// Create Prisma client instance
// const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { did } = body;

        if (!did) {
            return new Response(
                JSON.stringify({ error: "DID is required" }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Add timeout for database operations
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Database operation timed out')), 5000);
        });

        try {
            const privateKeyResult = await Promise.race([
                getPrivateKeyForUser(did),
                timeoutPromise
            ]);

            if (!privateKeyResult) {
                return new Response(
                    JSON.stringify({ error: "Private key not found" }),
                    { status: 404, headers: { 'Content-Type': 'application/json' } }
                );
            }

            return new Response(
                JSON.stringify({ privateKey: privateKeyResult }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );

        } catch (dbError) {
            console.error('Database error:', dbError);
            return new Response(
                JSON.stringify({ 
                    error: dbError instanceof Error ? dbError.message : 'Database operation failed' 
                }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

    } catch (error) {
        console.error('Request error:', error);
        return new Response(
            JSON.stringify({ 
                error: error instanceof Error ? error.message : 'Invalid request' 
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }
}