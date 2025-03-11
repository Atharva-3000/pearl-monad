import { ToolConfig } from "./allTools";
import { createServerWalletClient, getServerWalletAddress } from "../viem/serverWalletUtils";
import { parseEther } from "viem";
import * as dotenv from "dotenv";
import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { format, subHours } from 'date-fns';

dotenv.config();

// Initialize Prisma client
const prisma = new PrismaClient();

// Constants
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MONAD_TESTNET_CHAIN_ID = "10143";
const MAX_FAUCET_AMOUNT = "0.2"; // 0.2 MONAD per request
const RATE_LIMIT_HOURS = 24; // Rate limit in hours

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
            description: "Request test MONAD tokens from the faucet (limited to 0.2 MONAD per request, once per 24 hours)",
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
            console.log("[1/6] Validating inputs and determining recipient address...");
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

            // Check rate limit
            console.log("[2/6] Checking rate limit...");
            const rateLimitDate = subHours(new Date(), RATE_LIMIT_HOURS);
            const recentRequest = await prisma.faucetRequest.findFirst({
                where: {
                    walletAddress: recipient.toLowerCase(),
                    timestamp: {
                        gte: rateLimitDate
                    }
                },
                orderBy: {
                    timestamp: 'desc'
                }
            });

            if (recentRequest) {
                const lastRequestTime = recentRequest.timestamp;
                const now = new Date();
                const hoursElapsed = (now.getTime() - lastRequestTime.getTime()) / (1000 * 60 * 60);
                const hoursRemaining = RATE_LIMIT_HOURS - hoursElapsed;
                const timeRemaining = hoursRemaining > 1
                    ? `${Math.ceil(hoursRemaining)} hours`
                    : `${Math.ceil(hoursRemaining * 60)} minutes`;

                console.log(`❌ Rate limited: User ${recipient.slice(0, 6)}...${recipient.slice(-4)} requested funds too recently`);
                return {
                    status: "RATE_LIMITED",
                    message: `You can only request funds once every ${RATE_LIMIT_HOURS} hours. Please try again in ${timeRemaining}.`,
                    toString: function () {
                        return `⏳ Rate limit reached: You can only request funds once every ${RATE_LIMIT_HOURS} hours.\n\nPlease try again in ${timeRemaining}.`;
                    }
                };
            }
            console.log("✓ Rate limit check passed");

            console.log("[3/6] Checking faucet configuration...");
            if (!FAUCET_PRIVATE_KEY) {
                console.log("❌ Faucet private key not found in environment variables");
                throw new Error("Faucet private key not configured");
            }

            console.log("[4/6] Initializing faucet wallet...");
            // Create wallet client using the faucet private key
            const faucetWallet = createServerWalletClient(FAUCET_PRIVATE_KEY);
            const faucetAddress = getServerWalletAddress(FAUCET_PRIVATE_KEY);
            console.log(`Faucet wallet initialized: ${faucetAddress.slice(0, 6)}...${faucetAddress.slice(-4)}`);

            console.log(`[5/6] Preparing transaction: ${MAX_FAUCET_AMOUNT} MONAD to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`);
            // Send the transaction
            const txHash = await faucetWallet.sendTransaction({
                to: recipient as `0x${string}`,
                value: parseEther(MAX_FAUCET_AMOUNT),
            });

            // Record the request in the database
            console.log("[6/6] Recording request in database...");
            await prisma.faucetRequest.create({
                data: {
                    walletAddress: recipient.toLowerCase(),
                    timestamp: new Date()
                }
            });

            console.log(`✅ Transaction submitted successfully!`);
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
                    return `✅ Success! ${MAX_FAUCET_AMOUNT} MONAD has been sent to your wallet.\n\nTransaction Hash: ${txHash}\n\nView on Explorer: https://testnet.monadexplorer.com/tx/${txHash}\n\nNote: You can request funds again in ${RATE_LIMIT_HOURS} hours.`;
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