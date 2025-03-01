/* eslint-disable @typescript-eslint/no-unused-vars */
import { Address } from "viem";
import { createViemWalletClient } from "../viem/createViemWalletClient";
import { ToolConfig } from "./allTools";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface GetWalletAddressArgs { }

export const getWalletAddressTool: ToolConfig = {
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
    handler: async () => {
        // Your implementation here
        return "wallet_address";
    }
};

async function getWalletAddress(): Promise<Address> {
    const walletClient = createViemWalletClient();
    const [address] = await walletClient.getAddresses();
    return address;
}