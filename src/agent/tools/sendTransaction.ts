import { Address, parseEther } from 'viem';
import { createServerWalletClient } from '../viem/serverWalletUtils';
import { ToolConfig } from './allTools';

interface SendTransactionArgs {
    to: Address;
    value?: string;
    data?: `0x${string}`;
    nonce?: number;
    gasPrice?: string;
}

export const sendTransactionTool: ToolConfig<SendTransactionArgs & { privateKey?: string }> = {
    definition: {
        type: 'function',
        function: {
            name: 'send_transaction',
            description: 'Send a transaction on Monad testnet',
            parameters: {
                type: 'object',
                properties: {
                    to: {
                        type: 'string',
                        pattern: '^0x[a-fA-F0-9]{40}$',
                        description: 'The recipient address',
                    },
                    value: {
                        type: 'string',
                        description: 'The amount of MON to send (in MON, not Wei)',
                    },
                    data: {
                        type: 'string',
                        pattern: '^0x[a-fA-F0-9]*$',
                        description: 'Contract interaction data (hexadecimal)',
                    },
                    nonce: {
                        type: 'number',
                        description: 'Explicit nonce for the transaction',
                    },
                    gasPrice: {
                        type: 'string',
                        description: 'Gas price in Gwei',
                    }
                },
                required: ['to']
            }
        }
    },
    handler: async (args) => {
        console.time("send_transaction_tool");
        try {
            // Extract the privateKey from args
            const { privateKey, ...txArgs } = args;
            
            if (!privateKey) {
                throw new Error("Authentication required. No private key available.");
            }
            
            const result = await sendTransaction(privateKey, txArgs);
            if (!result.success || !result.hash) {
                throw new Error(result.message);
            }
            
            // Return a more structured response that clearly separates the transaction hash and the link
            return `Transaction sent successfully!\n\nTransaction Hash: \`${result.hash}\`\n\nView on Monad Explorer: [Open in Explorer](https://testnet.monadexplorer.com/tx/${result.hash})`;
            
        } finally {
            console.timeEnd("send_transaction_tool");
        }
    }
};

async function sendTransaction(
    privateKey: string,
    { to, value, data, nonce, gasPrice }: SendTransactionArgs
) {
    try {
        // Create wallet client using the server wallet utils
        const walletClient = createServerWalletClient(privateKey);
        
        // Prepare transaction parameters
        const txParams: {
            to: Address;
            data?: `0x${string}`;
            value?: bigint;
            nonce?: number;
            gasPrice?: bigint;
        } = {
            to,
            data
        };
        
        // Only add value if specified
        if (value) {
            txParams.value = parseEther(value);
        }
        
        // Add optional parameters if specified
        if (nonce !== undefined) {
            txParams.nonce = nonce;
        }
        
        if (gasPrice) {
            txParams.gasPrice = parseEther(gasPrice);
        }
        
        // Send transaction
        const hash = await walletClient.sendTransaction(txParams);
        
        return {
            success: true,
            hash,
            message: `Transaction sent successfully. Hash: ${hash}`
        };
    } catch (error) {
        console.error("Transaction error:", error);
        return {
            success: false,
            hash: null,
            message: `Failed to send transaction: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
}