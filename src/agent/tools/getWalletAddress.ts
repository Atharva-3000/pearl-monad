import { getServerWalletAddress } from "../viem/serverWalletUtils";
import { ToolConfig } from "./allTools";

export const getWalletAddressTool: ToolConfig<{ privateKey?: string }> = {
    definition: {
        type: 'function',
        function: {
            name: 'get_wallet_address',
            description: 'Get the current user wallet address',
            parameters: {
                type: 'object',
                properties: {},
                required: []
            }
        }
    },
    handler: async (args: { privateKey?: string }) => {
        // Add timing logs
        console.time("wallet_address_tool");
        try {
            const privateKey = args.privateKey;
            if (!privateKey) throw new Error("Authentication required");
            const address = getServerWalletAddress(privateKey);
            return address;
        } finally {
            console.timeEnd("wallet_address_tool");
        }
    }
};