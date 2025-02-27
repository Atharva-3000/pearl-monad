/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/chat/route.ts
export const dynamic = 'force-dynamic';


import { NextRequest } from 'next/server';
import { HumanMessage } from '@langchain/core/messages';
import { initializeAgent } from '@/providers/agentProvider';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add enum for message sender
enum MessageSender {
  USER = 'user',
  ASSISTANT = 'assistant'
}

export async function POST(req: NextRequest) {
  try {
    const { message, userId, chatId, isFirstMessage } = await req.json();
    
    if (!message || !userId || !chatId) {
      return new Response(
        JSON.stringify({ error: "Message, userId, and chatId are required" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create chat if it's first message
    if (isFirstMessage) {
      try {
        await prisma.chat.create({
          data: {
            id: chatId,
            userId,
            title: message.slice(0, 50)
          }
        });
      } catch (error: any) {
        // Ignore unique constraint error since chat might already exist
        if (error.code !== 'P2002') throw error;
      }
    }

    // Save user message
    await prisma.message.create({
      data: {
        content: message,
        chatId,
        sender: MessageSender.USER
      }
    });

    // Get or initialize agent
    const agent = await initializeAgent();

    const agentStream = await agent(
      { messages: [new HumanMessage(message)] },
      { configurable: { thread_id: chatId } }
    );

    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    let accumulatedContent = '';
    
    (async () => {
      try {
        for await (const chunk of agentStream) {
          if ("agent" in chunk) {
            const content = chunk.agent.messages[0].content;
            
            if (content && content !== accumulatedContent) {
              const delta = content.slice(accumulatedContent.length);
              if (delta) {
                await writer.write(
                  encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`)
                );
                accumulatedContent = content;
              }
            }
          }
        }

        // Save the complete response to database
        if (accumulatedContent) {
          await prisma.message.create({
            data: {
              content: accumulatedContent,
              chatId,
              sender: 'assistant'
            }
          });
        }

        // Send DONE event only after saving
        await writer.write(encoder.encode('data: [DONE]\n\n'));
      } catch (error) {
        console.error('Stream error:', error);
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({ error: 'Error processing response' })}\n\n`
          )
        );
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Add GET endpoint for loading chat messages
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');

    if (!chatId) {
      return new Response(
        JSON.stringify({ error: "chatId is required" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { timestamp: 'asc' },
      select: {
        id: true,
        content: true,
        sender: true,
        timestamp: true
      }
    });

    // Transform messages to match the UI format
    const formattedMessages = messages.map(msg => ({
      role: msg.sender === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
      sender: msg.sender,
      timestamp: msg.timestamp
    }));

    return new Response(
      JSON.stringify(formattedMessages),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch messages' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}