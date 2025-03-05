"use client";

import ChatInterface from "@/components/ChatInterface";
import { ChatSidebar } from "@/components/ChatSidebar";
import { motion } from "framer-motion";
import { ScanHeart, Menu } from "lucide-react"; // Added Menu icon
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
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar visibility

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authenticated) {
      router.push('/');
      toast.error('Please login to access the chat');
    }
  }, [mounted, authenticated, router]);

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

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
        <div className="backdrop-blur-md bg-monad-purple border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2 justify-center">
                <ScanHeart color="white" size={24} />
                <span className="text-monad-black font-mono text-md">
                  Chat ID: {params?.chatId}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/chat/${params?.chatId}/dashboard`)}
                  className="bg-black/80 hover:bg-white hover:text-black text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                >
                  Dashboard
                </button>
                {/* Hamburger menu button for mobile */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="bg-black/80 hover:bg-white hover:text-black text-white p-2 rounded-md md:hidden flex items-center justify-center"
                  aria-label="Toggle sidebar"
                >
                  <Menu size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content area */}
      <div className="pt-20 pb-4 flex h-screen bg-monad-offwhite relative">
        {/* Semi-transparent overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={handleOverlayClick}
            aria-hidden="true"
          />
        )}

        <div className="flex-1">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <ChatInterface />
          </div>
        </div>

        {/* Modified sidebar that's aware of open state */}
        <div className={`h-[calc(100vh-6rem)] mt-0 z-50 md:z-auto fixed md:static right-0 top-16 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
          <ChatSidebar />
        </div>
      </div>
    </div>
  );
}