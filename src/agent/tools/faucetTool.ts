import { ToolConfig } from "./allTools";
import { createServerWalletClient, getServerWalletAddress } from "../viem/serverWalletUtils";
import { parseEther } from "viem";
import * as dotenv from "dotenv";

dotenv.config();

// Constants
const MONAD_TESTNET_CHAIN_ID = "10143";
const MAX_FAUCET_AMOUNT = "0.001"; // 0.2 MONAD per request

// This should be set in your environment variables for security
const FAUCET_PRIVATE_KEY = process.env.FAUCET_PRIVATE_KEY || "";

interface FaucetArgs {
    recipientAddress?: string; // Optional - if not provided, will use the user's address
    privateKey?: string; // Current user's private key (for getting their address if no recipient specified)
}

export const faucetTool: ToolConfig<FaucetArgs> = {
    definition: {
        type: "function",
        function: {
            name: "request_funds",
            description: "Request test MONAD tokens from the faucet (limited to 0.2 MONAD per request)",
            parameters: {
                type: "object",
                properties: {
                    recipientAddress: {
                        type: "string",
                        description: "The wallet address to receive tokens (optional, defaults to current user's wallet)"
                    }
                },
                required: []
            }
        }
    },
    handler: async (args) => {
        console.time("faucet_tool");
        console.log("------------------------------");
        console.log("🚰 EXECUTING FAUCET TOOL");
        console.log("------------------------------");

        try {
            console.log("[1/5] Validating inputs and determining recipient address...");
            const { recipientAddress, privateKey } = args;
            let recipient: string;

            // Determine the recipient address
            if (recipientAddress) {
                recipient = recipientAddress;
                console.log(`Using provided recipient address: ${recipient.slice(0, 6)}...${recipient.slice(-4)}`);
            } else if (privateKey) {
                // Use the current user's wallet address if no recipient specified
                recipient = getServerWalletAddress(privateKey);
                console.log(`Derived recipient address from private key: ${recipient.slice(0, 6)}...${recipient.slice(-4)}`);
            } else {
                console.log("❌ No recipient address or private key provided");
                throw new Error("No recipient address provided and no private key available");
            }

            console.log("[2/5] Checking faucet configuration...");
            if (!FAUCET_PRIVATE_KEY) {
                console.log("❌ Faucet private key not found in environment variables");
                throw new Error("Faucet private key not configured");
            }

            console.log("[3/5] Initializing faucet wallet...");
            // Create wallet client using the faucet private key
            const faucetWallet = createServerWalletClient(FAUCET_PRIVATE_KEY);
            const faucetAddress = getServerWalletAddress(FAUCET_PRIVATE_KEY);
            console.log(`Faucet wallet initialized: ${faucetAddress.slice(0, 6)}...${faucetAddress.slice(-4)}`);

            console.log(`[4/5] Preparing transaction: ${MAX_FAUCET_AMOUNT} MONAD to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`);
            // Send the transaction
            const txHash = await faucetWallet.sendTransaction({
                to: recipient as `0x${string}`,
                value: parseEther(MAX_FAUCET_AMOUNT),
            });

            console.log(`[5/5] ✅ Transaction submitted successfully!`);
            console.log(`Amount: ${MAX_FAUCET_AMOUNT} MONAD`);
            console.log(`Recipient: ${recipient}`);
            console.log(`Transaction Hash: ${txHash}`);
            console.log(`Explorer URL: https://testnet.monadexplorer.com/tx/${txHash}`);

            // Return a formatted success message with transaction details
            return {
                status: "SUCCESS",
                amount: MAX_FAUCET_AMOUNT,
                recipient: recipient,
                transactionHash: txHash,
                message: `You received ${MAX_FAUCET_AMOUNT} MONAD from the faucet!`,
                explorerUrl: `https://testnet.monadexplorer.com/tx/${txHash}`,
                toString: function () {
                    return `✅ Success! ${MAX_FAUCET_AMOUNT} MONAD has been sent to your wallet.\n\nTransaction Hash: ${txHash}\n\nView on Explorer: https://testnet.monadexplorer.com/tx/${txHash}`;
                }
            };

        } catch (error) {
            console.error("❌ Faucet transaction failed:");
            console.error(error instanceof Error ? `Error: ${error.message}` : "Unknown error type");

            if (error instanceof Error && error.stack) {
                console.error("Stack trace:", error.stack.split('\n').slice(0, 3).join('\n'));
            }

            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            return {
                status: "ERROR",
                message: `Failed to get funds from faucet: ${errorMessage}`,
                toString: function () {
                    return `❌ Faucet request failed: ${errorMessage}\n\nPlease try again later.`;
                }
            };
        } finally {
            console.log("------------------------------");
            console.log("🚰 FAUCET TOOL COMPLETED");
            console.timeEnd("faucet_tool");
            console.log("------------------------------");
        }
    }
};