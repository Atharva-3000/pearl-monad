import { Address, getContract } from "viem";
import { createViemPublicClient } from "../viem/createViemPublicClient";
import { ToolConfig } from "./allTools";
import { formatEther } from "viem";
import { getWalletAddress, initializeWalletClient } from "../viem/createViemWalletClient";
import { TOKENS } from "../constants/token";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface GetBalanceArgs {
  wallet: Address;
}

export const getBalanceTool: ToolConfig = {
  definition: {
    type: 'function',
    function: {
      name: 'get_balance',
      description: 'Get the wallet balance for native currency and all supported tokens',
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
    try {
      let address: Address;
  
      // If no address is provided, try to use the default wallet client
      if (!args?.address) {
        try {
          const did = "user-did-here"; // Replace with the actual DID
          await initializeWalletClient(did);
          address = getWalletAddress();
        } catch (error) {
          throw new Error(
            "No wallet address provided and no default wallet client available. " +
            "Please provide a wallet address or ensure the wallet client is initialized."
          );
        }
      } else {
        address = args.address as Address;
      }
  
      console.log(`Fetching balance for address: ${address}`);
  
      const publicClient = createViemPublicClient();
  
      // Get native balance
      const nativeBalance = await publicClient.getBalance({ address });
      const balances: Record<string, string> = {
        NATIVE: formatEther(nativeBalance),
      };
  
      console.log(`Native balance: ${balances.NATIVE}`);
  
      // Fetch token balances
      for (const [tokenName, tokenInfo] of Object.entries(TOKENS)) {
        try {
          console.log(`Fetching balance for token: ${tokenName} at address: ${tokenInfo.address}`);
  
          const balance = await publicClient.readContract({
            address: tokenInfo.address,
            abi: tokenInfo.abi,
            functionName: 'balanceOf',
            args: [address],
          });
  
          balances[tokenName] = formatEther(balance as bigint);
          console.log(`Balance of ${tokenName}: ${balances[tokenName]}`);
        } catch (error) {
          console.error(`Error fetching balance for token ${tokenName}:`, error);
          balances[tokenName] = '0';
        }
      }
  
      console.log('All balances:', balances);
      
      // NEW CODE: Format the response in a more descriptive way for the AI
      const formattedResponse = `
Wallet Address: ${address}

Available Balances:
- MON: ${balances.NATIVE} MON (Native token)
- WMON: ${balances.wMON} WMON (Wrapped Monad)
- USDC: ${balances.usdc} USDC (USD Coin)
      `.trim();
      
      return formattedResponse;
    } catch (error) {
      console.error('Error in getBalanceTool:', error);
      throw new Error(`Failed to get wallet balances: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};