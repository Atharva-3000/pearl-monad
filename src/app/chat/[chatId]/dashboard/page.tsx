/* eslint-disable @typescript-eslint/no-unused-vars */
// components/Dashboard.tsx

"use client";

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { privateKeyToAccount } from 'viem/accounts';
import { Copy, ExternalLink, Droplets } from 'lucide-react';
import { toast } from 'react-hot-toast'; // Assuming you're using react-hot-toast

interface AddressData {
  address: string;
  summary: {
    totalTransactions: number;
    totalETHTransfers: number;
    totalERC20Transfers: number;
    totalERC20Approvals: number;
    totalERC20Tokens: number;
    totalGasPaidFormatted: string;
    totalEthVolumeIn: string;
    totalEthVolumeOut: string;
  };
  transactions: Array<{
    hash: string;
    blockNumber: number;
    timestamp: number;
    from: string;
    to?: string;
    valueFormatted: string;
    gasFeeFormatted: string;
  }>;
  ethTransfers: Array<{
    txHash: string;
    valueFormatted: string;
    from: string;
    to: string;
  }>;
  erc20Transfers: Array<{
    tokenAddress: string;
    valueFormatted: string;
    from: string;
    to: string;
  }>;
  erc20Approvals: Array<{
    tokenAddress: string;
    spender: string;
    valueFormatted: string;
  }>;
}

export default function Dashboard() {
    const { user } = usePrivy();
    const [walletAddress, setWalletAddress] = useState("Not available");
    const [isLoading, setIsLoading] = useState(true);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(walletAddress);
            toast.success("Wallet address copied to clipboard!");
        } catch (error) {
            console.error("Failed to copy address:", error);
            toast.error("Failed to copy address");
        }
    };

    useEffect(() => {
        async function fetchWalletAddress() {
            if (user) {
                try {
                    setIsLoading(true);

                    const response = await fetch('/api/wallet', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ did: user.id })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.privateKey) {
                            let formattedKey = data.privateKey;
                            
                            if (!formattedKey.startsWith('0x')) {
                                formattedKey = `0x${formattedKey}`;
                            }
                            
                            formattedKey = formattedKey.trim();
                            
                            try {
                                const account = privateKeyToAccount(formattedKey);
                                setWalletAddress(account.address);
                            } catch (keyError) {
                                console.error("Error processing private key:", keyError);
                                setWalletAddress("Invalid key format");
                            }
                        }
                    } else {
                        const errorData = await response.json();
                        console.error('Failed to fetch wallet data:', errorData.error);
                    }
                } catch (error) {
                    console.error("Error getting wallet address:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        }

        fetchWalletAddress();
    }, [user]);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-monad-black border-b border-monad-purple/20 pb-2">
                Wallet Dashboard
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2 bg-white shadow-sm rounded-lg border border-monad-purple/10 overflow-hidden">
                    <div className="p-5 bg-gradient-to-r from-monad-purple/5 to-transparent">
                      <h2 className="text-lg font-medium text-monad-black mb-1">Your Wallet Address</h2>
                      <p className="text-sm text-gray-500 mb-4">Manage and monitor your Monad wallet</p>
                      
                      <div className="bg-monad-offwhite p-4 rounded-md border border-monad-purple/10 relative">
                        <div className="font-mono text-sm pr-8 truncate">
                          {isLoading ? 
                            <div className="h-5 w-full bg-gray-200 animate-pulse rounded"></div> : 
                            walletAddress
                          }
                        </div>
                        
                        {!isLoading && walletAddress !== "Not available" && walletAddress !== "Invalid key format" && (
                          <button 
                            onClick={copyToClipboard}
                            className="p-1.5 absolute right-4 top-1/2 transform -translate-y-1/2 bg-monad-purple/10 hover:bg-monad-purple text-monad-purple hover:text-white rounded-md flex items-center transition-colors"
                            aria-label="Copy wallet address"
                            title="Copy address to clipboard"
                          >
                            <Copy size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                </div>
            </div>
            
            {walletAddress !== "Not available" && walletAddress !== "Invalid key format" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ActionCard 
                        title="Explorer"
                        description="View your wallet details and transaction history"
                        icon={<ExternalLink className="text-monad-purple" size={24} />}
                        linkText="View on Monad Explorer"
                        linkUrl={`https://testnet.monadexplorer.com/address/${walletAddress}`}
                    />
                    
                    <ActionCard 
                        title="Faucet"
                        description="Get test tokens to use on Monad Testnet"
                        icon={<Droplets className="text-monad-berry" size={24} />}
                        linkText="Get Funds from Faucet"
                        linkUrl={`https://faucet.trade/monad-testnet-mon-faucet`}
                    />
                </div>
            )}
        </div>
    );
}

// Helper components
const StatCard = ({ title, value }: { title: string; value: string }) => (
    <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <p className="text-lg font-semibold text-monad-black">{value}</p>
    </div>
);

const ActionCard = ({ 
    title, 
    description, 
    icon, 
    linkText, 
    linkUrl 
}: { 
    title: string; 
    description: string; 
    icon: React.ReactNode; 
    linkText: string; 
    linkUrl: string;
}) => (
    <div className="bg-white shadow-sm rounded-lg border border-monad-purple/10 overflow-hidden">
        <div className="p-5">
            <div className="flex items-center mb-3">
                <div className="mr-3">{icon}</div>
                <h3 className="text-lg font-medium text-monad-black">{title}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">{description}</p>
            <a 
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-monad-purple/10 text-monad-purple hover:bg-monad-purple hover:text-white rounded-md transition-colors"
            >
                {linkText}
                <ExternalLink size={16} className="ml-2" />
            </a>
        </div>
    </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
    <div className="space-y-3">{children}</div>
  </div>
);

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const TransactionItem = ({ tx }: { tx: AddressData['transactions'][number] }) => (
  <div className="bg-white p-3 rounded border">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-mono text-gray-600">
          TX: {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
        </p>
        <p className="text-xs text-gray-500">Block #{tx.blockNumber}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">{tx.valueFormatted} ETH</p>
        <p className="text-xs text-gray-500">{tx.gasFeeFormatted} fee</p>
      </div>
    </div>
  </div>
);

const TokenTransfer = ({ transfer }: { transfer: AddressData['erc20Transfers'][number] }) => (
  <div className="bg-white p-3 rounded border">
    <div className="flex justify-between">
      <div>
        <p className="text-sm">
          {transfer.from.slice(0, 6)}... → {transfer.to.slice(0, 6)}...
        </p>
        <p className="text-xs text-gray-500">
          {transfer.tokenAddress.slice(0, 8)}...
        </p>
      </div>
      <p className="text-sm font-medium">{transfer.valueFormatted}</p>
    </div>
  </div>
);

const ApprovalItem = ({ approval }: { approval: AddressData['erc20Approvals'][number] }) => (
  <div className="bg-white p-3 rounded border">
    <div className="flex justify-between">
      <div>
        <p className="text-sm">
          To: {approval.spender.slice(0, 8)}...
        </p>
        <p className="text-xs text-gray-500">
          Token: {approval.tokenAddress.slice(0, 8)}...
        </p>
      </div>
      <p className="text-sm font-medium">{approval.valueFormatted}</p>
    </div>
  </div>
);