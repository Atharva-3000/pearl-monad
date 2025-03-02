import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generatePrivateKey } from 'viem/accounts';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { did, email } = await req.json();

    if (!did) {
      return new Response(JSON.stringify({ error: "DID is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if user exists to know whether we need to generate a private key
    const existingUser = await prisma.user.findUnique({
      where: { id: did }
    });
    
    // Generate private key only for new users
    const privateKey = existingUser ? existingUser.privateKey : generatePrivateKey();

    // Use upsert to create or update the user
    const user = await prisma.user.upsert({
      where: { id: did },
    update: { 
        email: email || undefined // Only update email if provided
      },
      create: {
        id: did,
        privateKey,
        email
      }
    });

    return new Response(JSON.stringify(user), { 
      status: existingUser ? 200 : 201,
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error('User creation error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}