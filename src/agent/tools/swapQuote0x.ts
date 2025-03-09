import { ToolConfig } from './allTools';
import * as dotenv from 'dotenv';
import { parseUnits } from 'viem'; // For parsing token amounts

dotenv.config();

interface FetchQuoteArgs {
  sellToken: string;
  buyToken: string;
  sellAmount: string;
  takerAddress: string; // Taker address is required
  chainId: string; // Chain ID is required
}

export const fetchQuoteTool: ToolConfig<FetchQuoteArgs> = {
  definition: {
    type: 'function',
    function: {
      name: 'fetch_quote',
      description: 'Fetch a quote for a token swap using the 0x Swap API.',
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
            description: 'The amount of sellToken to sell (in the smallest unit, e.g., wei)',
          },
          takerAddress: {
            type: 'string',
            description: 'The address of the taker (required)',
          },
          chainId: {
            type: 'string',
            description: 'The chain ID of the blockchain network (e.g., 1 for Ethereum Mainnet, 8453 for Base)',
          },
        },
        required: ['sellToken', 'buyToken', 'sellAmount', 'takerAddress', 'chainId'],
      },
    },
  },
  handler: async (args) => {
    const { sellToken, buyToken, sellAmount, takerAddress, chainId } = args;

    // Set up headers for the 0x API request
    const headers = new Headers({
      'Content-Type': 'application/json',
      '0x-api-key': process.env.PEARL_0X_API_KEY!, // Use the API key from environment variables
      '0x-version': 'v2', // Specify the API version
    });

    // Construct the API request URL
    const url = new URL('https://api.0x.org/swap/permit2/quote'); // Use the correct endpoint
    url.searchParams.append('sellToken', sellToken);
    url.searchParams.append('buyToken', buyToken);
    url.searchParams.append('sellAmount', sellAmount);
    url.searchParams.append('taker', takerAddress); // Use 'taker' instead of 'takerAddress'
    url.searchParams.append('chainId', chainId); // Add chain ID

    console.log("API Request URL:", url.toString()); // Log the request URL for debugging

    try {
      // Fetch the quote from the 0x API
      const response = await fetch(url.toString(), { headers });

      const rawText = await response.text();
      console.log("---------Raw Response Text:", rawText); // Log the raw response for debugging

      let data;
      try {
        data = JSON.parse(rawText); // Parse the response as JSON
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        throw new Error(`Failed to parse response as JSON: ${rawText}`);
      }

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch quote');
      }

      // Extract and summarize essential quote information
      try {
        // Log the structure of the response for debugging
        console.log("Response structure:", Object.keys(data));

        // Extract token symbols from route
        const sellTokenSymbol = data.route?.tokens?.find(t => 
          t.address.toLowerCase() === sellToken.toLowerCase())?.symbol || "Unknown";
        const buyTokenSymbol = data.route?.tokens?.find(t => 
          t.address.toLowerCase() === buyToken.toLowerCase())?.symbol || "Unknown";

        // Calculate exchange rate - handle potential numeric conversion issues
        let exchangeRate = "Unknown";
        try {
          if (data.buyAmount && data.sellAmount) {
            const sellAmountNumber = parseFloat(data.sellAmount);
            const buyAmountNumber = parseFloat(data.buyAmount);
            if (sellAmountNumber > 0) {
              exchangeRate = (buyAmountNumber / sellAmountNumber).toFixed(6);
            }
          }
        } catch (err) {
          console.error("Error calculating exchange rate:", err);
        }

        // Create a simplified quote summary
        const quoteDetails = {
          sellToken: {
            address: data.sellToken,
            symbol: sellTokenSymbol,
            amount: data.sellAmount
          },
          buyToken: {
            address: data.buyToken,
            symbol: buyTokenSymbol,
            amount: data.buyAmount
          },
          exchangeRate: `1 ${sellTokenSymbol} = ${exchangeRate} ${buyTokenSymbol}`,
          estimatedGas: data.transaction?.gas || "Unknown",
          sources: data.route?.fills?.map(fill => 
            `${fill.source} (${(fill.proportionBps / 100).toFixed(1)}%)`
          ) || ["Unknown"],
          issues: [] as string[]
        };
        
        // Check for issues and add them if present
        if (data.issues) {
          quoteDetails.issues = [];
          
          if (data.issues.balance && 
              BigInt(data.issues.balance.actual || '0') < BigInt(data.issues.balance.expected || '0')) {
            quoteDetails.issues.push(`Insufficient balance: Have ${data.issues.balance.actual} ${sellTokenSymbol}, need ${data.issues.balance.expected} ${sellTokenSymbol}`);
          }
          
          if (data.issues.allowance && 
              BigInt(data.issues.allowance.actual || '0') < BigInt(sellAmount)) {
            quoteDetails.issues.push(`Token allowance needed for Permit2 contract (${data.issues.allowance.spender})`);
          }

          if (data.issues.simulationIncomplete) {
            quoteDetails.issues.push("Transaction simulation incomplete - may fail when executed");
          }
        }
        
        // Return the simplified quote with status
        return {
          status: quoteDetails.issues?.length > 0 ? "ISSUES_DETECTED" : "READY_TO_EXECUTE",
          message: quoteDetails.issues?.length > 0 
            ? "Quote retrieved but action required before executing swap" 
            : "Quote retrieved successfully and ready to execute",
          quote: quoteDetails,
          // Include transaction data for later use
          transaction: data.transaction ? {
            to: data.transaction.to,
            data: data.transaction.data,
            value: data.transaction.value,
            gas: data.transaction.gas,
            gasPrice: data.transaction.gasPrice
          } : null
        };
      } catch (error) {
        // If something goes wrong processing the quote data
        console.error("Error extracting quote information:", error);
        
        // Return a simplified fallback with part of the raw data
        return {
          status: "PROCESSING_ERROR",
          message: "Retrieved quote data but couldn't process it properly. See rawData for details.",
          rawData: {
            sellToken: data.sellToken,
            buyToken: data.buyToken,
            sellAmount: data.sellAmount,
            buyAmount: data.buyAmount,
            issues: data.issues ? JSON.stringify(data.issues) : "None"
          },
          originalResponse: JSON.stringify(data).substring(0, 500) + "..." // Include beginning of raw data for debugging
        };
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      throw new Error(`Failed to fetch quote: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};