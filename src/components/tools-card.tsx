"use client";

import { useHeadlessDelegatedActions, usePrivy, WalletWithMetadata } from '@privy-io/react-auth';
import { AlignVerticalDistributeCenter, Anchor, Atom, AudioWaveform, BringToFrontIcon, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

type ToolsCardProps = {
    isMobile?: boolean;
};

export function ToolsCard({ isMobile = false }: ToolsCardProps) {
    const { user, authenticated } = usePrivy();
    const icons = [AlignVerticalDistributeCenter, Atom, AudioWaveform, Anchor, BringToFrontIcon];
    const { login, ready } = usePrivy();
    const disableLogin = !ready || (ready && authenticated);
    const { delegateWallet } = useHeadlessDelegatedActions();
    useEffect(() => {
        if (authenticated && user?.id) {
            // console.log()
            toast.success('Logged in Successfully!', {
                id: 'auth-success',
                duration: 2000
            });
            
        }
    }, [authenticated, user?.id])



    const handleStartChat = async () => {
        try {
            // Get embedded wallets
            const embeddedWallets = user?.linkedAccounts.filter((account): account is WalletWithMetadata => 
              (account.type === 'wallet' && account.walletClientType === 'privy'));
            console.log(embeddedWallets);
            // Delegate first embedded wallet if not already delegated
            if (embeddedWallets && embeddedWallets.length > 0) {
              const nonDelegated = embeddedWallets.filter(w => !w.delegated);
              
              for (const wallet of nonDelegated) {
                await delegateWallet({
                  address: wallet.address,
                  chainType: 'ethereum' // Use 'ethereum' for EVM chains like Monad
                });
                console.log('Delegated wallet:', wallet.address);
              }
            }
            
            // Proceed with chat
            toast.success('Joined the Chat!');
            console.log('Delegated wallets:', embeddedWallets?.filter(w => w.delegated));
          } catch (error) {
            console.error('Delegation failed:', error);
            toast.error('Wallet delegation failed');
          }
        // Add your chat logic here
        toast.success('Joined the Chat!', {
            id: 'chat-start',
            duration: 2000
        });
        console.log(user?.email?.address || user?.google?.email);   //logs the email address of the user if google
        console.log(user?.id);  //logs the did of the user
        const embeddedWallets = user?.linkedAccounts.filter((account): account is WalletWithMetadata => (account.type === 'wallet' && account.walletClientType === 'privy'));
        const delegatedWallets = embeddedWallets?.filter((wallet) => wallet.delegated);
        console.log(delegatedWallets);  //logs the delegated wallets of the user
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
                    >
                        <span>Chat</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                ) : (
                    <button
                        className={`btn-glass border border-black bg-monad-black text-white font-medium uppercase flex items-center gap-2 justify-center hover:text-monad-offwhite hover:bg-monad-purple transition-all duration-200 group py-2.5 ${isMobile ? 'px-4' : ''}`}
                        disabled={disableLogin}
                        onClick={() => login()}
                    >
                        <span>Begin</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                )}
            </div>
        </div>
    );
}