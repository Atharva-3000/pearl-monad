/* eslint-disable prefer-const */
"use client";
import { useState, useRef, useEffect } from "react";
import { SyncLoader } from "react-spinners";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BrainCircuit, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { usePrivy } from "@privy-io/react-auth";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !user?.id) return;

        // Only add user message initially
        const userMessage: Message = { role: 'user', content: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        
        setInput('');
        setIsLoading(true); // This will show the loader

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    userId: user.id,
                    chatId: params?.chatId,
                    isFirstMessage: messages.length === 0
                })
            });

            if (!response.ok) throw new Error(await response.text());

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
            toast.error('Failed to send message');
        } finally {
            setIsLoading(false);
        }
    };

    // Keep the existing return statement as is
    return (
        <div className="h-[calc(100vh-6rem)] bg-zinc-950 border border-zinc-800 backdrop-blur-sm rounded-t-lg overflow-hidden flex flex-col">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
                {loadingChat ? (
                    <div className="flex justify-center py-4">
                        <SyncLoader color="#f97316" size={6} />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <BrainCircuit className="h-16 w-16 text-orange-500 mb-2" />
                        <h3 className="text-xl font-medium text-zinc-200">Start a new conversation</h3>
                        <p className="text-sm text-zinc-400 mt-1 max-w-sm">
                            Ask anything or use one of the examples below to get started.
                        </p>
                        {/* Add some example prompts here if needed */}
                    </div>
                ) : (
                    messages.map((message, i) => (
                        <div
                            key={i}
                            className={`flex items-start gap-3 mx-4 md:mx-6 lg:mx-8 ${message.sender === 'user' ? "justify-end" : ""
                                }`}
                        >
                            {message.sender === 'assistant' && (
                                <Avatar className="h-8 w-8 bg-gradient-to-r from-red-500 to-orange-500 border border-zinc-700">
                                    <AvatarFallback>
                                        <BrainCircuit className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                            )}

                            <div
                                className={`rounded-2xl p-4 max-w-[90%] md:max-w-[70%] border ${message.sender === 'user'
                                    ? "bg-zinc-800/80 border-blue-700"
                                    : "bg-zinc-600 border-orange-700"
                                    }`}
                            >
                                <div className="text-sm text-white prose-invert">
                                    <ReactMarkdown>
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                            </div>

                            {message.sender === 'user' && (
                                <Avatar className="h-8 w-8 border border-zinc-700">
                                    <AvatarImage src={'/placeholder.svg'} />
                                    <AvatarFallback>
                                        {user?.email?.address?.charAt(0).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex items-center space-x-2 mx-4 md:mx-6 lg:mx-8">
                        <Avatar className="h-8 w-8 bg-gradient-to-r from-red-500 to-orange-500 border border-zinc-700">
                            <AvatarFallback>
                                <BrainCircuit className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                        <SyncLoader
                            className="ml-2"
                            color="#f97316"
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
                            className="flex-grow p-3 bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white p-3 rounded aspect-square flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:opacity-50"
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