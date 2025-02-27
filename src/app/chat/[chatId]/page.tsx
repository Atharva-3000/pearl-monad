"use client";
// src/app/chat/[chatid]/page.tsx
import ChatInterface from "@/components/ChatInterface";
import { ChatSidebar } from "@/components/ChatSidebar";
import { motion } from "framer-motion";
import { LogOut, BrainCircuit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useParams } from 'next/navigation';
import { usePrivy } from "@privy-io/react-auth";

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const { authenticated, user } = usePrivy();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authenticated) {
      router.push('/');
      toast.error('Please login to access the chat');
    }
  }, [mounted, authenticated, router]);

  if (!mounted || !authenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="backdrop-blur-md bg-black/30 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <BrainCircuit color="white" size={24} />
                <span className="text-white/60 font-mono text-sm">
                  Chat ID: {params?.chatId}
                </span>
              </div>
              <button
                onClick={() => {
                  router.push('/');
                  toast.success('Left chat room');
                }}
                className="bg-red-900/80 hover:bg-red-900 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Exit Chat</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content area */}
      <div className="pt-20 pb-4 flex h-screen">
        <div className="flex-1">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <ChatInterface />
          </div>
        </div>
        <div className="h-[calc(100vh-6rem)] mt-0">
          <ChatSidebar />
        </div>
      </div>
    </div>
  );
}