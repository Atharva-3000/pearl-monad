/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/chats/[chatId]/route.ts
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
interface RouteContext {
    params: {
      chatId: string
    }
  }
// DELETE request handler
export async function DELETE(
    req: NextRequest,
    context: any
) {
    try {
        const { chatId } = await context.params;

        await prisma.message.deleteMany({ where: { chatId } });
        await prisma.chat.delete({ where: { id: chatId } });

        return new Response(null, { status: 204 });
    } catch (error) {
        console.error("Failed to delete chat:", error);
        return new Response(JSON.stringify({ error: "Failed to delete chat" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        }); // Fixed syntax error - removed extra curly brace
    }
}

// PATCH request handler
export async function PATCH(
    req: NextRequest,
    context: any
) {
    try {
        const { title } = await req.json();
        const { chatId } = context.params;

        const updatedChat = await prisma.chat.update({
            where: { id: chatId },
            data: { title }
        });

        return new Response(JSON.stringify(updatedChat), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Failed to update chat:", error);
        return new Response(JSON.stringify({ error: "Failed to update chat" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}