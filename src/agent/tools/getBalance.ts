import { Address } from "viem";
import { createViemPublicClient } from "../viem/createViemPublicClient";
import { ToolConfig } from "./allTools";
import { formatEther } from "viem";
import { getWalletAddress } from "../viem/createViemWalletClient";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface GetBalanceArgs {
  wallet: Address;
}

export const getBalanceTool: ToolConfig = {
  definition: {
    type: 'function',
    function: {
      name: 'get_balance',
      description: 'Get the wallet balance',
      parameters: {
        type: 'object',
        properties: {
          address: {
            type: 'string',
            description: 'The wallet address (optional, will use current wallet if not provided)'
          }
        },
        required: []
      }
    }
  },
  handler: async (args?: { address?: string }) => {
    const address = args?.address 
      ? args.address as Address 
      : getWalletAddress();
    
    if (!address) {
      throw new Error('No wallet address available');
    }
    
    const publicClient = createViemPublicClient();
    const balance = await publicClient.getBalance({ address });
    return formatEther(balance);
  }
};