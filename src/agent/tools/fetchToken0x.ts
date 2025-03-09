import { ToolConfig } from './allTools';
import * as dotenv from 'dotenv';
import { formatUnits } from 'viem'; // For converting wei to human-readable units

dotenv.config();

interface FetchPriceArgs {
  sellToken: string;
  buyToken: string;
  sellAmount: string;
  chainId: string;
}

export const fetchPriceTool: ToolConfig<FetchPriceArgs> = {
  definition: {
    type: 'function',
    function: {
      name: 'fetch_price',
      description: 'Fetch the price of a token in terms of another token using the 0x Swap API.',
      parameters: {
        type: 'object',
        properties: {
          sellToken: {
            type: 'string',
            description: 'The token to sell (symbol or contract address)',
          },
          buyToken: {
            type: 'string',
            description: 'The token to buy (symbol or contract address)',
          },
          sellAmount: {
            type: 'string',
            description: 'The amount of sellToken to sell',
          },
          chainId: {
            type: 'string',
            description: 'The chain ID of the blockchain network (e.g., 1 for Ethereum Mainnet, 8453 for Base)',
          },
        },
        required: ['sellToken', 'buyToken', 'sellAmount', 'chainId'],
      },
    },
  },
  handler: async (args) => {
    const { sellToken, buyToken, sellAmount, chainId } = args;
    const priceParams = new URLSearchParams({
      sellToken,
      buyToken,
      sellAmount,
      chainId,
    });

    const url = `https://api.0x.org/swap/permit2/price?${priceParams.toString()}`;
    console.log("API Request URL:", url); // Log the URL for debugging

    try {
      const response = await fetch(url, {
        headers: {
          '0x-api-key': process.env.PEARL_0X_API_KEY!,
          '0x-version': 'v2', // Required version header
        },
      });

      console.log("Response Status:", response.status);
      const rawText = await response.text();
      console.log("Raw Response Text:", rawText);

      let data;
      try {
        data = JSON.parse(rawText);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        throw new Error(`Failed to parse response as JSON: ${rawText}`);
      }

      if (!response.ok) throw new Error(data.message || 'Failed to fetch price');

      // Log the full response data for debugging
      console.log("API Response Data:", data);

      // Check if required fields exist in the response
      if (!data.sellAmount || !data.buyAmount) {
        throw new Error("Invalid API response: Missing sellAmount or buyAmount");
      }

      // Convert amounts from wei to human-readable units
      const sellAmountWei = data.sellAmount;
      const buyAmountWei = data.buyAmount;

      const sellAmountHuman = formatUnits(BigInt(sellAmountWei), 18); // Assuming 18 decimals for WETH
      const buyAmountHuman = formatUnits(BigInt(buyAmountWei), 18); // Assuming 18 decimals for DAI

      // Format the output
      const output = `
        **Price Details**:
        - Sell Amount: ${sellAmountHuman} WETH
        - Buy Amount: ${buyAmountHuman} USDC
        - Price: 1 WETH = ${data.price} USDC
        - Guaranteed Price: ${data.guaranteedPrice} USDC
        - Gas Price: ${data.gasPrice} wei
        - Gas Limit: ${data.gas}
      `;

      return output;
    } catch (error) {
      console.error("Failed to fetch price:", error);
      throw new Error(`Failed to fetch price: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
};