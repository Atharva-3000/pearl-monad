"use client";

import { useState, useEffect, useMemo } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { privateKeyToAccount } from 'viem/accounts';
import { Copy, ExternalLink, Droplets, History, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

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
        status: number;
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
    const [addressData, setAddressData] = useState<AddressData | null>(null);
    const [fetchingTx, setFetchingTx] = useState(false);
    const [txFetchError, setTxFetchError] = useState<string | null>(null);
    const [filter, setFilter] = useState('all');

    // Copy wallet address to clipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(walletAddress);
            toast.success("Wallet address copied to clipboard!");
        } catch (error) {
            console.error("Failed to copy address:", error);
            toast.error("Failed to copy address");
        }
    };

    // Fetch transaction history
    const fetchTransactionHistory = async () => {
        if (!walletAddress || walletAddress === "Not available" || walletAddress === "Invalid key format") {
            toast.error("Valid wallet address not available");
            return;
        }

        try {
            setFetchingTx(true);
            setTxFetchError(null); // Clear any previous errors
            toast.loading("Fetching transaction history...", { id: "tx-fetch" });

            const response = await fetch('/api/blockchainData', { // Changed to match your actual API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ address: walletAddress })
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }

            const data = await response.json();
            setAddressData(data);
            toast.success("Transaction history loaded", { id: "tx-fetch" });
        } catch (error) {
            console.error("Error fetching transaction history:", error);
            toast.error("Failed to load transaction history", { id: "tx-fetch" });
            setTxFetchError(error instanceof Error ? error.message : "Unknown error occurred");
        } finally {
            setFetchingTx(false);
        }
    };

    // Fetch wallet address on component load
    useEffect(() => {
        async function fetchWalletAddress() {
            if (user) {
                try {
                    setIsLoading(true);

                    // Notice this is requesting wallet data, not blockchain data
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

    const filteredTransactions = useMemo(() => {
        if (!addressData?.transactions || addressData.transactions.length === 0) {
            return [];
        }

        // Create a copy of transactions to avoid mutating the original array
        let sortedTransactions = [...addressData.transactions];

        // Sort transactions by block number (higher numbers are more recent blocks)
        sortedTransactions.sort((a, b) => {
            // Primary sort by block number if timestamps are missing
            return (b.blockNumber || 0) - (a.blockNumber || 0);
        });

        // Log for debugging
        console.log("Sorted order by block:", sortedTransactions.map(tx =>
            `${tx.hash.slice(0, 6)} - Block ${tx.blockNumber}`
        ));

        // Apply filters after sorting
        if (filter === 'all') return sortedTransactions;
        if (filter === 'sent') {
            return sortedTransactions.filter(tx =>
                tx.from?.toLowerCase() === walletAddress.toLowerCase()
            );
        }
        if (filter === 'received') {
            return sortedTransactions.filter(tx =>
                tx.to?.toLowerCase() === walletAddress.toLowerCase()
            );
        }

        return sortedTransactions;
    }, [addressData, filter, walletAddress]);

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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

                    {/* Transaction History Card with Error Handling */}
                    <div className={`bg-white shadow-sm rounded-lg border ${txFetchError ? 'border-red-300' : 'border-monad-purple/10'} overflow-hidden`}>
                        <div className="p-5">
                            <div className="flex items-center mb-3">
                                <div className="mr-3">
                                    {txFetchError ?
                                        <AlertCircle className="text-red-500" size={24} /> :
                                        <History className="text-monad-purple" size={24} />
                                    }
                                </div>
                                <h3 className="text-lg font-medium text-monad-black">Transaction History</h3>
                            </div>

                            {txFetchError ? (
                                <div className="mb-4">
                                    <p className="text-sm text-red-600 mb-2">
                                        Failed to load transaction data: {txFetchError}
                                    </p>
                                    <button
                                        onClick={fetchTransactionHistory}
                                        className="text-sm flex items-center text-monad-purple hover:underline"
                                    >
                                        <RefreshCw size={14} className="mr-1" /> Try again
                                    </button>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600 mb-4">Retrieve your complete blockchain activity</p>
                            )}

                            <button
                                onClick={fetchTransactionHistory}
                                disabled={fetchingTx}
                                className={`inline-flex items-center px-4 py-2 rounded-md transition-colors ${fetchingTx
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : txFetchError
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                        : 'bg-monad-purple/10 text-monad-purple hover:bg-monad-purple hover:text-white'
                                    }`}
                            >
                                {fetchingTx ? 'Loading...' : 'Load Transactions'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Transaction Data Display - Only shown when data is available */}
            {addressData && (
                <div className="mt-8 space-y-6">
                    <Section title="Account Summary">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard title="Total Transactions" value={addressData.summary.totalTransactions.toString()} />
                            <StatCard title="MON Transfers" value={addressData.summary.totalETHTransfers.toString()} />
                            <StatCard title="Gas Paid" value={`${addressData.summary.totalGasPaidFormatted || '0'} MON`} />
                            <StatCard
                                title="Total MON Volume"
                                value={`${(
                                    parseFloat(addressData.summary.totalEthVolumeIn || '0') +
                                    parseFloat(addressData.summary.totalEthVolumeOut || '0')
                                ).toFixed(6)} MON`}
                            />
                        </div>
                    </Section>

                    <Section title="Transaction History">
                        {addressData.transactions && addressData.transactions.length > 0 ? (
                            <>
                                <div className="flex flex-wrap items-center space-x-2 mb-4">
                                    <div className="text-sm text-gray-600 mr-2">Filter:</div>
                                    <button
                                        className={`px-2 py-1 text-xs rounded-full border transition-colors ${filter === 'all'
                                                ? 'bg-monad-purple text-white border-monad-purple'
                                                : 'bg-white text-gray-800 border-gray-200 hover:bg-monad-purple/10'
                                            }`}
                                        onClick={() => setFilter('all')}
                                    >
                                        All
                                    </button>
                                    <button
                                        className={`px-2 py-1 text-xs rounded-full border transition-colors ${filter === 'sent'
                                                ? 'bg-monad-purple text-white border-monad-purple'
                                                : 'bg-white text-gray-800 border-gray-200 hover:bg-monad-purple/10'
                                            }`}
                                        onClick={() => setFilter('sent')}
                                    >
                                        Sent
                                    </button>
                                    <button
                                        className={`px-2 py-1 text-xs rounded-full border transition-colors ${filter === 'received'
                                                ? 'bg-monad-purple text-white border-monad-purple'
                                                : 'bg-white text-gray-800 border-gray-200 hover:bg-monad-purple/10'
                                            }`}
                                        onClick={() => setFilter('received')}
                                    >
                                        Received
                                    </button>
                                </div>

                                {/* Add transaction count info */}
                                <div className="text-sm text-gray-500 mb-3">
                                    Found {filteredTransactions.length} transaction(s) to display
                                </div>

                                <div className="space-y-4">
                                    {filteredTransactions.length > 0 ? (
                                        // Use first 10 transactions from the already sorted array
                                        filteredTransactions.slice(0, 10).map((tx, index) => (
                                            <TransactionItem key={tx.hash || index} tx={tx} walletAddress={walletAddress} />
                                        ))
                                    ) : (
                                        <p className="text-gray-500 italic">No transactions found matching filter</p>
                                    )}
                                    {addressData.transactions.length > 10 && (
                                        <div className="text-center mt-4">
                                            <p className="text-sm text-gray-500">
                                                Showing 10 of {addressData.transactions.length} transactions
                                            </p>
                                            <button className="mt-2 px-4 py-2 bg-monad-purple/10 text-monad-purple hover:bg-monad-purple hover:text-white rounded-md transition-colors duration-200">
                                                Load More
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500 italic">No transactions found for this address. If you just received funds, try clicking &quot;Load Transactions&quot;.</p>
                        )}
                    </Section>
                </div>
            )}
        </div>
    );
}

// Helper components (same as before)
const StatCard = ({ title, value }: { title: string; value: string }) => (
    <div className="bg-white rounded-lg border border-monad-purple/15 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-monad-purple/10 bg-gradient-to-r from-monad-purple/5 to-transparent">
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
        <div className="px-4 py-3 flex justify-center">
            <p className="text-xl font-semibold text-monad-purple">{value}</p>
        </div>
    </div>
);

const ActionCard = ({ title, description, icon, linkText, linkUrl }: {
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
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
        <div className="space-y-3">{children}</div>
    </div>
);

const TransactionItem = ({ tx, walletAddress }: { tx: AddressData['transactions'][number]; walletAddress: string }) => {
    // Determine if this is an outgoing or incoming transaction relative to the wallet address
    const isOutgoing = walletAddress.toLowerCase() === tx.from.toLowerCase();

    // Determine transaction status and get appropriate styling
    const getStatusDisplay = () => {
        if (tx.status === 1) {
            return <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">Success</span>;
        } else if (tx.status === 0) {
            return <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded-full text-xs font-medium">Failed</span>;
        } else {
            return <span className="px-2 py-0.5 bg-gray-50 text-gray-700 rounded-full text-xs font-medium">Pending</span>;
        }
    };

    // Format the date and time correctly
    const formatDateTime = (timestamp: number, blockNumber: number) => {
        // If we have a valid timestamp
        if (timestamp && timestamp > 0) {
            const millisecTimestamp = timestamp * 1000;
            const date = new Date(millisecTimestamp);
            return {
                date: date.toLocaleDateString(),
                time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
        }

        // Fallback to showing the block number
        return {
            date: `Block #${blockNumber || 'Unknown'}`,
            time: ''
        };
    };

    const dateTime = formatDateTime(tx.timestamp, tx.blockNumber);

    // Get relative time with proper timestamp handling
    const getRelativeTime = (timestamp: number) => {
        if (!timestamp || timestamp === 0) return 'Unknown';

        const now = Math.floor(Date.now() / 1000);
        const diff = now - timestamp;

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString();
    };

    const relativeTime = getRelativeTime(tx.timestamp);

    return (
        <a
            href={`https://testnet.monadexplorer.com/tx/${tx.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-to-r from-white to-monad-purple/[0.03] p-4 rounded-lg border border-monad-purple/15 hover:border-monad-purple/30 hover:shadow-lg hover:translate-y-[-1px] transition-all duration-200 cursor-pointer"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 
                          ${isOutgoing ? 'bg-pink-50 text-pink-600' : 'bg-indigo-50 text-indigo-600'}`}>
                        {isOutgoing ?
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg> :
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 12H5M5 12L12 5M5 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        }
                    </div>
                    <div>
                        <div className="flex items-center">
                            <span className={`text-sm font-medium ${isOutgoing ? 'text-pink-700' : 'text-indigo-700'}`}>
                                {isOutgoing ? 'Sent' : 'Received'}
                            </span>
                            <span className="mx-1.5 text-gray-400">•</span>
                            {getStatusDisplay()}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-0.5">
                            <span className="font-mono">{tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}</span>
                            <span className="mx-1.5">•</span>
                            <span title={`${dateTime.date} ${dateTime.time}`}>{relativeTime}</span>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <p className={`text-sm font-medium ${isOutgoing ? 'text-pink-700' : 'text-indigo-700'}`}>
                        {isOutgoing ? '-' : '+'}{tx.valueFormatted} MON
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Gas: {tx.gasFeeFormatted}</p>
                </div>
            </div>

            <div className="flex items-center mt-3 bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                <div className="grid grid-cols-2 gap-3 w-full">
                    <div>
                        <p className="text-xs text-gray-500 mb-1 font-medium">From</p>
                        <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-1.5 ${isOutgoing ? 'bg-pink-200' : 'bg-gray-200'
                                }`}></div>
                            <p className="font-mono text-xs text-gray-700 truncate">
                                {tx.from}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 mb-1 font-medium">To</p>
                        <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-1.5 ${!isOutgoing ? 'bg-indigo-200' : 'bg-gray-200'
                                }`}></div>
                            <p className="font-mono text-xs text-gray-700 truncate">
                                {tx.to || 'Contract Creation'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-600 mr-2">Block</span>
                    <span className="bg-monad-purple/5 text-monad-purple px-1.5 py-0.5 rounded text-xs font-mono">
                        #{tx.blockNumber}
                    </span>
                </div>

                <div className="flex items-center text-monad-purple text-xs font-medium">
                    <span>View on Explorer</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </a>
    );
};