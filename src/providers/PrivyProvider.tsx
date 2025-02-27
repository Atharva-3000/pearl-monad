"use client";
import {monadTestnet} from "viem/chains";
import { PrivyProvider } from "@privy-io/react-auth";

export function PrivyClientProvider({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId="cm7ks1diq04oivo1xiem767aj"
            config={{
                defaultChain: monadTestnet,
                supportedChains: [monadTestnet],
                appearance: {
                    theme: 'dark',
                    accentColor: '#676FFF',
                    logo: '/scan-heart.png',
                },
                embeddedWallets: {
                    ethereum: {
                        createOnLogin: 'users-without-wallets', 
                    },
                },
            }}
        >
            {children}
        </PrivyProvider>
    );
}