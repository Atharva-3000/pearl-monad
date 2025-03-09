import { getBalanceTool } from "./getBalance";
import { getWalletAddressTool } from "./getWalletAddress";
import { sendTransactionTool } from "./sendTransaction";
import { fetchPriceTool } from "./fetchToken0x";
import { fetchQuoteTool } from "./swapQuote0x";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ToolConfig<T = any> {
    definition: {
        type: 'function';
        function: {
            name: string;
            description: string;  // Changed from 'desc' to 'description'
            parameters: {         // Changed from 'params' to 'parameters'
                type: 'object';
                properties: Record<string, unknown>;  // Changed from 'props' to 'properties'
                required: string[];
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: (args: T) => Promise<any>;
}

export const tools: Record<string, ToolConfig> = {
    // == READ Tools == \\
    get_balance: getBalanceTool,
    get_wallet_address: getWalletAddressTool,
    fetch_price: fetchPriceTool,
    fetch_quote: fetchQuoteTool,
    
    // == WRITE Tools == \\
    send_transaction: sendTransactionTool,
};