"use client";

import { generateChatId } from '@/lib/utils';
import { usePrivy } from '@privy-io/react-auth';
import { AlignVerticalDistributeCenter, Anchor, Atom, AudioWaveform, BringToFrontIcon, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { SyncLoader } from "react-spinners";

type ToolsCardProps = {
  isMobile?: boolean;
};

export function ToolsCard({ isMobile = false }: ToolsCardProps) {
  const { user, authenticated, login, ready } = usePrivy();
  const icons = [AlignVerticalDistributeCenter, Atom, AudioWaveform, Anchor, BringToFrontIcon];
  const disableLogin = !ready || (ready && authenticated);
  const router = useRouter();
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const userCreatedRef = useRef(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const handleStartChat = async () => {
    if (!user?.id) {
      toast.error('You must be logged in to start a chat.');
      return;
    }

    try {
      // Create a unique toast ID for this navigation
      const toastId = "chat-loading";

      // Show loading toast
      toast.loading("Creating new chat...", { id: toastId });

      setLoadingChat(true);
      const chatId = generateChatId();

      // Create chat in database first
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId,
          userId: user.id,
          title: chatId
        })
      });

      if (!response.ok) throw new Error('Failed to create chat');

      // Navigate to new chat after successful creation
      router.push(`/chat/${chatId}`);

      // Update toast to success message
      // The slight delay helps ensure the toast is visible during navigation
      setTimeout(() => {
        toast.success("New chat started!", { id: toastId });
      }, 300);

    } catch (error) {
      toast.error('Failed to create new chat');
      console.error('Error creating chat:', error);
      setLoadingChat(false); // Reset loading state on error
    }
    // Note: We don't set loadingChat to false on success because we're navigating away
  };

  useEffect(() => {
    if (authenticated && user?.id && !userCreatedRef.current) {
      toast.success('Logged in Successfully!', {
        id: 'auth-success',
        duration: 2000
      });

      // Mark that we've started the user creation process
      userCreatedRef.current = true;

      // Create or upsert the user record in your database
      fetch('/api/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          did: user.id // Only sending the DID as requested
        }),
      })
        .then(response => {
          if (!response.ok) throw new Error('Failed to initialize user data');
          return response.json();
        })
        .then(data => {
          console.log('User record created or updated:', data);
        })
        .catch(err => {
          console.error('Error creating user:', err);
          toast.error('Failed to initialize user data');
          // Reset the ref if there's an error so we can try again
          userCreatedRef.current = false;
        });

      // If it's the first successful login and we want to redirect to chat
      if (justLoggedIn) {
        setJustLoggedIn(false);
        setLoadingChat(true); // Set loading state before navigation
        const chatId = generateChatId();
        router.push(`/chat/${chatId}`);
      }
    }
  }, [authenticated, user?.id, justLoggedIn, router]);

  const handleLogin = () => {
    setJustLoggedIn(true);
    login();
  };

  return (
    <div className={`glass-card-premium ${isMobile ? 'px-6' : 'px-8'} py-6 rounded-lg bg-clip-padding border border-gray-200`}
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}>
      <div className={`flex ${isMobile ? 'flex-col md:flex-row' : 'flex-row'} items-center gap-4 md:gap-6`}>
        <div className="flex -space-x-3">
          {icons.map((Icon, i) => (
            <div key={i} className={`${isMobile ? 'w-8 md:w-10 h-8 md:h-10' : 'w-10 h-10'} rounded-full border-2 border-black bg-neutral-200 flex items-center justify-center`}>
              <Icon className={`${isMobile ? 'w-4 md:w-6 h-4 md:h-6' : 'w-6 h-6'} text-black`} />
            </div>
          ))}
        </div>
        <div className={`flex flex-col ${isMobile ? 'text-center md:text-left' : ''}`}>
          <span className={`font-semibold ${isMobile ? 'text-monad-offwhite' : 'text-monad-berry'}`}>10+ Tools</span>
          {authenticated ? (
            <span className="text-sm text-black truncate max-w-[200px]">
              {user?.email?.address || user?.wallet?.address}
            </span>
          ) : (
            <span className="text-sm text-black">
              Start using it now<br />
              Let us take care of it.
            </span>
          )}
        </div>
        {authenticated ? (
          <button
            className={`btn-glass border border-black bg-monad-black text-white font-medium uppercase flex items-center gap-2 justify-center hover:text-monad-offwhite hover:bg-monad-purple transition-all duration-200 group py-2.5 ${isMobile ? 'px-4' : ''}`}
            onClick={handleStartChat}
            disabled={loadingChat}
          >
            {loadingChat ? (
              <SyncLoader color="#ffffff" size={5} speedMultiplier={0.7} margin={3} />
            ) : (
              <>
                <span>Chat</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </>
            )}
          </button>
        ) : (
          <button
            className={`btn-glass border border-black bg-monad-black text-white font-medium uppercase flex items-center gap-2 justify-center hover:text-monad-offwhite hover:bg-monad-purple transition-all duration-200 group py-2.5 ${isMobile ? 'px-4' : ''}`}
            disabled={disableLogin}
            onClick={handleLogin}
          >
            <span>Login</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        )}
      </div>
    </div>
  );
}