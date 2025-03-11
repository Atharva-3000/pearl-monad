/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
"use client";
import { useState, useRef, useEffect } from "react";
import { SyncLoader } from "react-spinners";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ScanHeart, Send, UserCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { usePrivy } from "@privy-io/react-auth";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { initializeWalletClient } from "../agent/viem/createViemWalletClient";
import { format } from 'date-fns';

interface Message {
    role: "user" | "assistant";
    content: string;
    sender: "user" | "assistant";
}

export default function ChatInterface() {
    const { user } = usePrivy();
    const params = useParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [loadingChat, setLoadingChat] = useState(true);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const loadMessages = async () => {
            if (!params?.chatId) return;
            setLoadingChat(true);
            try {
                const response = await fetch(`/api/chat?chatId=${params.chatId}`);
                if (!response.ok) throw new Error('Failed to load messages');
                const data = await response.json();

                const transformedMessages = data.map((msg: { sender: string; content: string }) => ({
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                    content: msg.content,
                    sender: msg.sender
                }));

                setMessages(transformedMessages);
            } catch {
                toast.error('Failed to load chat history');
            } finally {
                setLoadingChat(false);
            }
        };
        loadMessages();
    }, [params?.chatId]);

    useEffect(() => {
        async function initWallet() {
            if (user?.id) {
                await initializeWalletClient(user.id);
            }
        }
        initWallet();
    }, [user?.id]);

    // Add this function to check (but not increment) usage
    const checkDailyPromptLimit = async (userId: string) => {
        const today = format(new Date(), 'yyyy-MM-dd');

        // Just check the current count
        const response = await fetch(`/api/prompt-usage?userId=${userId}&date=${today}`);
        const data = await response.json();

        if (data.count >= 6) {
            toast.error('You have reached your daily limit of 6 prompts. Please try again tomorrow.');
            return false;
        }

        return true;
    };

    // Add this function to increment the count after sending a message
    const incrementPromptUsage = async (userId: string) => {
        const today = format(new Date(), 'yyyy-MM-dd');
        await fetch('/api/prompt-usage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, date: today })
        });
    };

    const handleSendMessage = async () => {
        if (!user?.id || !await checkDailyPromptLimit(user.id)) {
            return;
        }

        // Continue with sending the message...
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !user?.id) return;

        // Check limit before sending
        if (!await checkDailyPromptLimit(user.id)) {
            return;
        }

        const userMessage: Message = { role: 'user', content: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 55000);

        try {
            // Increment the usage count when actually sending a message
            await incrementPromptUsage(user.id);

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    userId: user.id,
                    chatId: params?.chatId,
                    isFirstMessage: messages.length === 0
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Request failed');
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No reader available');

            let decoder = new TextDecoder();
            let buffer = '';
            let fullContent = '';
            let assistantMessageAdded = false;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                // Process complete events in buffer
                while (buffer.includes('\n\n')) {
                    const eventEnd = buffer.indexOf('\n\n');
                    const event = buffer.slice(0, eventEnd);
                    buffer = buffer.slice(eventEnd + 2);

                    if (event.startsWith('data: ')) {
                        const data = event.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.content) {
                                const newDelta = parsed.content;

                                if (!assistantMessageAdded) {
                                    // Add the assistant message only when we get the first content
                                    setMessages(prev => [
                                        ...prev,
                                        { role: 'assistant', content: newDelta, sender: 'assistant' }
                                    ]);
                                    assistantMessageAdded = true;
                                    fullContent = newDelta;
                                } else {
                                    // Update the assistant message with accumulated content
                                    fullContent = parsed.content;
                                    setMessages(prev => {
                                        const newMessages = [...prev];
                                        newMessages[newMessages.length - 1].content = fullContent;
                                        return newMessages;
                                    });
                                }
                            }
                        } catch (e) {
                            console.error("Error parsing SSE message:", e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Request timed out. Please try again with a shorter message.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Keep the existing return statement as is
    return (
        <div className="h-[calc(100vh-6rem)] bg-monad-offwhite border border-zinc-800 backdrop-blur-sm rounded-t-lg overflow-hidden flex flex-col">
            {/* Messages Container - Reduce padding from p-4 to p-2 or p-3 */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-3 scrollbar-none">
                {loadingChat ? (
                    <div className="flex justify-center py-4">
                        <SyncLoader color="#f97316" size={6} />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <ScanHeart className="h-16 w-16 text-monad-berry mb-2" />
                        <h3 className="text-xl font-medium text-zinc-600">Start a new conversation</h3>
                        <p className="text-sm text-zinc-400 mt-1 max-w-sm">
                            Ask thyself and you shall receive.<br /> The assistant is here to help you with your queries.
                        </p>
                        {/* Add some example prompts here if needed */}
                    </div>
                ) : (
                    messages.map((message, i) => (
                        <div
                            key={i}
                            className={`flex items-start gap-2 mx-2 sm:mx-3 md:mx-4 ${message.sender === 'user' ? "justify-end" : ""
                                }`}
                        >
                            {message.sender === 'assistant' && (
                                <Avatar className="h-8 w-8 bg-gradient-to-r from-red-500 to-orange-500 border border-zinc-700">
                                    <AvatarFallback>
                                        <ScanHeart className="h-4 w-4" color="purple" />
                                    </AvatarFallback>
                                </Avatar>
                            )}

                            <div
                                className={`rounded-2xl p-4 max-w-[85%] sm:max-w-[80%] md:max-w-[70%] border ${message.sender === 'user'
                                    ? "bg-white border-monad-berry"
                                    : "bg-monad-purple border-monad-black"
                                    }`}
                            >
                                {/* Update the text container with better word breaking and overflow handling */}
                                <div className="text-sm text-monad-black prose-invert break-words overflow-hidden">
                                    <ReactMarkdown
                                        components={{
                                            // Custom handling for code and pre elements
                                            code: ({ className, children, ...props }: any) => {
                                                const match = /language-(\w+)/.exec(className || '');
                                                const isInline = !match && props.inline;
                                                return (
                                                    <code
                                                        className={`${className} ${isInline ? 'break-all text-xs' : 'overflow-x-auto max-w-full block text-xs'}`}
                                                        {...props}
                                                    >
                                                        {children}
                                                    </code>
                                                );
                                            },
                                            // Handle links with proper truncation
                                            a: ({ node, className, children, ...props }) => {
                                                return (
                                                    <a
                                                        className={`${className} break-all text-blue-600 underline`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        {...props}
                                                    >
                                                        {children}
                                                    </a>
                                                );
                                            },
                                            // Add special styling for transaction hashes and other long strings
                                            p: ({ node, className, children, ...props }) => {
                                                return (
                                                    <p
                                                        className={`${className} whitespace-pre-wrap break-words`}
                                                        {...props}
                                                    >
                                                        {children}
                                                    </p>
                                                );
                                            }
                                        }}
                                    >
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                            </div>

                            {message.sender === 'user' && (
                                <Avatar className="h-8 w-8 border border-zinc-700 bg-monad-purple">
                                    <AvatarFallback>
                                        <UserCircle className="h-6 w-6" />
                                    </AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex items-center space-x-2 mx-2 sm:mx-3 md:mx-4 bg-black bg-opacity-10 rounded-lg p-2">
                        <Avatar className="h-8 w-8 bg-gradient-to-r from-red-500 to-orange-500 border border-zinc-700">
                            <AvatarFallback>
                                <ScanHeart fill="black" className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                        <SyncLoader
                            className="ml-2"
                            color="purple"
                            size={6}
                            speedMultiplier={0.6}
                        />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="p-4 border-t border-zinc-800">
                <form onSubmit={handleSubmit} className="relative">
                    <div className="flex items-center gap-2 w-full">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-grow p-3 bg-monad-offwhite border border-zinc-700 rounded text-monad-black focus:outline-none focus:ring-2 focus:ring-monad-berry transition-colors"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className=" bg-black text-white p-3 rounded aspect-square flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}