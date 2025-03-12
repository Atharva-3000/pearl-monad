import { getBalanceTool } from "./getBalance";
import { getWalletAddressTool } from "./getWalletAddress";
import { sendTransactionTool } from "./sendTransaction";
import { fetchPriceTool } from "./fetchToken0x";
import { fetchQuoteTool } from "./swapQuote0x";
import { executeSwapTool } from "./swap0x";
import { faucetTool } from "./faucetTool";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ToolConfig<T = any> {
    definition: {
        type: 'function';
        function: {
            name: string;
            description: string;
            parameters: {
                type: 'object';
                properties: Record<string, unknown>;
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
    execute_swap: executeSwapTool,
    request_funds: faucetTool,
};