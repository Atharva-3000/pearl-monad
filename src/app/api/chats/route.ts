/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/chats/route.ts
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return new Response(JSON.stringify({ error: "userId is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        updatedAt: true
      }
    });

    return new Response(JSON.stringify(chats), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch chats" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { chatId, userId, title } = await req.json();

    if (!chatId || !userId) {
      return new Response(JSON.stringify({ error: "chatId and userId are required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const chat = await prisma.chat.create({
      data: {
        id: chatId,
        userId,
        title: title || chatId
      }
    });

    return new Response(JSON.stringify(chat), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create chat" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}