import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http } from "viem";
import { monadTestnet } from "viem/chains";
import { eip712WalletActions } from "viem/zksync";

// Global variable to store the wallet client
let globalWalletClient: ReturnType<typeof createWalletClient> | null = null;

// Add cache for private keys with expiration
const privateKeyCache = new Map<string, { key: string, timestamp: number }>();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// New function to fetch private key without hooks
async function fetchPrivateKey(did: string): Promise<string | null> {
    // Check cache first
    const cached = privateKeyCache.get(did);
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
        return cached.key;
    }

    try {
        const response = await fetch('/api/wallet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ did })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch private key');
        }

        const data = await response.json();
        // Cache the result
        privateKeyCache.set(did, {
            key: data.privateKey,
            timestamp: Date.now()
        });
        return data.privateKey;
    } catch (error) {
        console.error("Error fetching private key:", error);
        return null;
    }
}

export async function initializeWalletClient(did: string): Promise<ReturnType<typeof createWalletClient> | null> {
    // If client already exists, return it
    if (globalWalletClient) {
        return globalWalletClient;
    }

    const privateKey = await fetchPrivateKey(did);
    if (!privateKey) {
        console.log("⚠️ No private key available, wallet client creation skipped");
        return null;
    }

    console.log("🔐 Creating wallet client with valid private key");
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    console.log("📱 Wallet address:", account.address);

    globalWalletClient = createWalletClient({
        account,
        chain: monadTestnet,
        transport: http(),
    }).extend(eip712WalletActions());
    
    console.log("✨ Wallet client created successfully for chain:", monadTestnet.name);
    return globalWalletClient;
}

export function useViemWalletClient() {
    return globalWalletClient;
}

export function getWalletAddress() {
    if (!globalWalletClient) {
        throw new Error("No wallet client available");
    }
    return globalWalletClient.account?.address;
}