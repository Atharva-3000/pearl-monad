import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http } from "viem";
import { monadTestnet } from "viem/chains";
import { eip712WalletActions } from "viem/zksync";
import { usePrivateKey } from "../wallet-helper/walletDataLoader";

// Global variable to store the wallet client
let globalWalletClient: ReturnType<typeof createWalletClient> | null = null;

// eslint-disable-next-line react-hooks/rules-of-hooks
export function initializeWalletClient(): ReturnType<typeof createWalletClient> | null {
    const privateKey = usePrivateKey();
// eslint-disable-next-line react-hooks/rules-of-hooks
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
    // If global wallet client hasn't been initialized, try to initialize it
    if (!globalWalletClient) {
        initializeWalletClient();
    }
    return globalWalletClient;
}

export function getWalletAddress() {
    const walletClient = useViemWalletClient();
    if (!walletClient) {
        throw new Error("No wallet client available");
    }
    return walletClient.account?.address;
}