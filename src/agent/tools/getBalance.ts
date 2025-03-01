/* eslint-disable @typescript-eslint/no-unused-vars */
import { Address } from "viem";
import { createViemPublicClient } from "../viem/createViemPublicClient";
import { ToolConfig } from "./allTools";
import { formatEther } from "viem";

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
            description: 'The wallet address'
          }
        },
        required: ['address']
      }
    }
  },
  handler: async (args: { address: string }) => {
    // Your implementation here
    return "balance";
  }
};

async function getBalance(wallet: Address) {
  const publicClient = createViemPublicClient();
  const balance = await publicClient.getBalance({ address: wallet });
  return formatEther(balance);
}
