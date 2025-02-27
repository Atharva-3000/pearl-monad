/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/ChatSidebar.tsx

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, PenSquare, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { generateChatId } from "@/lib/utils";

import { toast } from "react-hot-toast";
import { usePrivy } from "@privy-io/react-auth";
import { SyncLoader, FadeLoader } from "react-spinners";

interface Chat {
  id: string;
  title: string;
  updatedAt: Date;
}

export function ChatSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [savingTitle, setSavingTitle] = useState(false);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const [prevChats, setPrevChats] = useState<Chat[]>([]);
  const router = useRouter();
  const { user } = usePrivy();
  const params = useParams();

  useEffect(() => {
    const fetchChats = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/chats?userId=${user.id}`);

        if (!response.ok) throw new Error('Failed to fetch chats');

        const data = await response.json();

        // If we have an active chat ID but it's not in the returned chats,
        // this might be a newly created chat that hasn't been saved yet
        if (params?.chatId && data.findIndex((c: { id: string | string[]; }) => c.id === params.chatId) === -1) {
          // Add a temporary entry for the current chat
          const currentChat = {
            id: params.chatId,
            title: 'New Chat',
            updatedAt: new Date()
          };
          data.unshift(currentChat);
        }

        setChats(data);

      } catch (error) {
        console.error('Error fetching chats:', error);
        toast.error('Failed to load chat history');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user?.id, params?.chatId]);

  const handleNewChat = async () => {
    const chatId = generateChatId();

    // Add new chat to the list immediately
    const newChat: Chat = {
      id: chatId,
      title: chatId, // Initial title is the chatId
      updatedAt: new Date()
    };

    setChats(prev => [newChat, ...prev]); // Add to beginning of list

    try {
      // Create chat in database
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId,
          userId: user?.id,
          title: chatId
        })
      });

      if (!response.ok) throw new Error('Failed to create chat');

      // Navigate to new chat
      router.push(`/chat/${chatId}`);
    } catch (error) {
      // Remove chat from list if creation failed
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      toast.error('Failed to create new chat');
    }
  };

  const handleEditTitle = async (chatId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setSavingTitle(true);
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
      });

      if (!response.ok) throw new Error("Failed to update title");

      setChats(prev => prev.map(chat =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      ));
      setEditingChatId(null);
      toast.success("Chat title updated");
    } catch (error) {
      toast.error("Failed to update chat title");
    } finally {
      setSavingTitle(false);
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setDeletingChatId(chatId);

    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete chat');

      // Check if this is the last chat before removing it
      const isLastChat = chats.length === 1;

      // Remove the chat from the list
      setChats(prev => prev.filter(chat => chat.id !== chatId));

      // If this was the active chat
      if (params?.chatId === chatId) {
        // Generate a new chat ID
        const newChatId = generateChatId();

        // If this was the last chat, create a new one immediately
        if (isLastChat) {
          // Create a new placeholder chat in the UI first
          const newChat = {
            id: newChatId,
            title: 'New Chat',
            updatedAt: new Date()
          };

          // Add the new chat to the list
          setChats([newChat]);

          // Create the chat in the database
          await fetch('/api/chats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              chatId: newChatId,
              userId: user?.id,
              title: 'New Chat'
            })
          });
        }

        // Navigate to the new chat
        router.push(`/chat/${newChatId}`);
      }

      toast.success('Chat deleted');
    } catch (error) {
      toast.error('Failed to delete chat');
    } finally {
      setDeletingChatId(null);
    }
  };

  // Highlight effect styles
  const getChatStyles = (chatId: string) => {
    const isActive = params?.chatId === chatId;
    const isNew = chatId === params?.chatId && chats.findIndex(c => c.id === chatId) === 0;

    return `group relative rounded-lg p-3 hover:bg-zinc-900 transition-all cursor-pointer
      ${isActive ? 'bg-zinc-900 border-l-2 border-orange-500' : ''}
      ${isNew ? 'animate-pulse' : ''}`;
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={false}
        animate={{
          x: isOpen ? 0 : 12,
          right: isOpen ? 280 : 0
        }}
        transition={{ duration: 0.2 }}
        className="fixed top-24 z-30 p-2 bg-zinc-900 border border-zinc-800 !rounded-l hover:bg-zinc-800 transition-all duration-200"
      >
        {isOpen ?
          <ChevronRight className="h-4 w-4 text-zinc-400 hover:text-white transition-colors duration-200" /> :
          <ChevronLeft className="h-4 w-4 text-zinc-400 hover:text-white transition-colors duration-200" />
        }
      </motion.button>

      {/* Sidebar */}
      <motion.div
        initial={{ width: 280, x: 0 }}
        animate={{
          width: isOpen ? 280 : 0,
          x: isOpen ? 0 : 280
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="h-full border-l border-zinc-800 bg-black overflow-hidden"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col"
            >
              <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-none">

                {loading ? (
                  <div className="flex justify-center py-4">
                    <FadeLoader color="#f97316" height={4} width={4} />
                  </div>
                ) : chats.length === 0 ? (
                  <div className="text-zinc-500 text-center py-4">
                    No chat history
                  </div>
                ) : (
                  chats.map((chat) => (
                    <motion.div
                      key={chat.id}
                      className={`group relative rounded-lg p-3 hover:bg-zinc-900 transition-all duration-200 cursor-pointer ${params?.chatId === chat.id ? 'bg-zinc-900 border-l-2 border-orange-500' : ''
                        }`}
                      onClick={() => router.push(`/chat/${chat.id}`)}
                      initial={chat.id === params?.chatId ? { opacity: 0, x: -20 } : false}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {editingChatId === chat.id ? (
                        <div className="flex items-center justify-center w-full">
                          <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onBlur={() => handleEditTitle(chat.id, newTitle)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleEditTitle(chat.id, newTitle);
                              }
                            }}
                            className="w-full bg-transparent text-white border-b border-orange-500 outline-none text-center"
                            autoFocus
                          />
                          {savingTitle && (
                            <div className="absolute right-3">
                              <SyncLoader color="#f97316" size={4} />
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <span className="text-zinc-300 text-sm block text-center truncate">
                            {chat.title || chat.id}
                          </span>
                          <div className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 transition-opacity duration-200 ${params?.chatId === chat.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingChatId(chat.id);
                                setNewTitle(chat.title || chat.id);
                              }}
                              className="p-1 rounded-md transition-colors duration-200"
                              disabled={deletingChatId === chat.id}
                            >
                              <PenSquare className="h-4 w-4 text-zinc-500 hover:text-orange-500 transition-colors" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteChat(e, chat.id)}
                              className="p-1 rounded-md transition-all duration-200  group/delete"
                              disabled={deletingChatId === chat.id}
                            >
                              {deletingChatId === chat.id ? (
                                <SyncLoader color="#ef4444" size={4} />
                              ) : (
                                <Trash2 className="h-4 w-4 text-zinc-500 group-hover/delete:text-red-500" />
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))
                )}
              </div>

              <div className="p-3 border-t border-zinc-800 bg-black">
                <button
                  onClick={handleNewChat}
                  className="w-full flex items-center justify-center gap-2 p-2 bg-gradient-to-r from-red-500 to-orange-500 hover:opacity-90 rounded-full text-white text-sm transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Chat</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}