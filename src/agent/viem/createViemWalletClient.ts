import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { monadTestnet } from "viem/chains";
import { eip712WalletActions } from "viem/zksync";
import { fetchPrivateKey } from "@/agent/wallet-helper/walletDataLoader";

/**
 * Creates a wallet client using a user's private key from the database
 * 
 * @param did The decentralized identifier of the user
 * @returns A wallet client instance configured for the Monad testnet
 */
export async function createViemWalletClient(did: string) {
    try {
        // Fetch the private key from the database
        const privateKey = await fetchPrivateKey(did);
        
        // Format the private key with 0x prefix if needed
        const formattedKey = privateKey.startsWith('0x') 
            ? privateKey as `0x${string}` 
            : `0x${privateKey}` as `0x${string}`;
        
        // Create an account from the private key
        const account = privateKeyToAccount(formattedKey);
        
        // Create and return the wallet client
        return createWalletClient({
            account,
            chain: monadTestnet,
            transport: http(),
        }).extend(eip712WalletActions());
    } catch (error) {
        console.error('Failed to create wallet client:', error);
        throw error;
    }
}