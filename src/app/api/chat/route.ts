
// src/app/api/chat/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
// import { HumanMessage } from '@langchain/core/messages';
import { initializeAgent } from '@/providers/agentProvider';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { createThread } from '@/agent/openai/createThread';
import { createRun } from '@/agent/openai/createRun';
import { performRun } from '@/agent/openai/performRun';
import { getPrivateKeyForUser } from '@/lib/auth/session';


const prisma = new PrismaClient();

// Add enum for message sender
enum MessageSender {
  USER = 'user',
  ASSISTANT = 'assistant'
}

// Add a Message type at the top of the file
interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
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
    const privateKey = await getPrivateKeyForUser(userId);
    // Create chat if first message
    if (isFirstMessage) {
      try {
        await prisma.chat.create({
          data: {
            id: chatId,
            userId,
            title: message.slice(0, 50)
          }
        });
      } catch (error) {
        if (error instanceof Error && 'code' in error && error.code !== 'P2002') throw error;
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

    // Initialize OpenAI client
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    try {
      // Get or initialize the agent
      const agent = await initializeAgent();
      
      // Set up streaming
      const encoder = new TextEncoder();
      const stream = new TransformStream();
      const writer = stream.writable.getWriter();
      
      let accumulatedContent = '';
      
      (async () => {
        try {
          // Create a new thread or get existing one
          const thread = await createThread(client, message);
          
          // Create run using the agent and thread
          const run = await createRun(client, thread, agent.id);
          
          // Process the run stream
          const runStream = performRun(run, client, thread, privateKey);
          
          for await (const chunk of runStream) {
            // Extract content from chunk
            let content = '';
            
            // Use proper type guards to check the shape of the chunk
            if ('agent' in chunk && chunk.agent?.messages?.[0]?.content) {
              // Extract content from agent format
              content = chunk.agent.messages[0].content;
            } else if ('text' in chunk && chunk.text?.value) {
              // Extract content from text format
              content = chunk.text.value;
            }
            
            // Very important: Only send the NEW content (delta)
            if (content && content !== accumulatedContent) {
              const delta = content.slice(accumulatedContent.length);
              
              if (delta) {
                await writer.write(
                  encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`)
                );
                accumulatedContent = content; // Update the accumulated content after sending
              }
            }
          }
          
          // Save complete response
          if (accumulatedContent) {
            await prisma.message.create({
              data: {
                content: accumulatedContent,
                chatId,
                sender: MessageSender.ASSISTANT
              }
            });
          }
          
          await writer.write(encoder.encode('data: [DONE]\n\n'));
        } catch (error) {
          console.error('Streaming error:', error);
          
          // Send error as part of the stream
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
      console.error('AI initialization error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to initialize AI' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
  } catch (error) {
    console.error('Request error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Fix the GET endpoint for loading chat messages
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

    const formattedMessages = messages.map((msg: Message) => ({
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
    ); // Fixed: removed the extra curly brace here
  }
}