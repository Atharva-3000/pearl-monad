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

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: did }
    });

    if (existingUser) {
      // Update email if provided and different
      if (email && email !== existingUser.email) {
        await prisma.user.update({
          where: { id: did },
          data: { email }
        });
      }
      return new Response(JSON.stringify(existingUser), { status: 200 });
    }

    // Generate new private key for new users
    const privateKey = generatePrivateKey();
    
    const newUser = await prisma.user.create({
      data: {
        id: did,
        privateKey,
        email
      }
    });

    return new Response(JSON.stringify(newUser), { status: 201 });

  } catch (error) {
    console.error('User creation error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}