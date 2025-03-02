import { getServerWalletAddress } from "../viem/serverWalletUtils";
import { ToolConfig } from "./allTools";

export const getWalletAddressTool: ToolConfig<{ privateKey?: string }> = {
    definition: {
        type: 'function',
        function: {
            name: 'get_wallet_address',
            description: 'Get the wallet address',
            parameters: {
                type: 'object',
                properties: {},
                required: []
            }
        }
    },
    handler: async (args: { privateKey?: string }) => {
        const privateKey = args.privateKey;
        if (!privateKey) throw new Error("Authentication required");
        return getServerWalletAddress(privateKey);
    }
};