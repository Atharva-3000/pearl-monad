import { ToolConfig } from "./allTools";
import * as dotenv from "dotenv";
import { formatUnits, getContract, maxUint256 } from "viem";
import {
  createServerWalletClient,
  getServerWalletAddress,
} from "../viem/serverWalletUtils";
import { erc20_ABI } from "../abi/erc20-abi";
import { permit2_ABI } from "../abi/permit2-abi";

dotenv.config();

// Constants
const MONAD_TESTNET_CHAIN_ID = "10143";
const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3";

interface FetchQuoteArgs {
  sellToken: string;
  buyToken: string;
  sellAmount: string;
  chainId?: string; // Made optional since we'll default to Monad
  privateKey?: string;
}

export const fetchQuoteTool: ToolConfig<FetchQuoteArgs> = {
  definition: {
    type: "function",
    function: {
      name: "fetch_quote",
      description:
        "Fetch a quote for a token swap using the 0x Swap API on Monad Testnet.",
      parameters: {
        type: "object",
        properties: {
          sellToken: {
            type: "string",
            description: "The token to sell (symbol or contract address)",
          },
          buyToken: {
            type: "string",
            description: "The token to buy (symbol or contract address)",
          },
          sellAmount: {
            type: "string",
            description:
              "The amount of sellToken to sell (in the smallest unit, e.g., wei)",
          },
          chainId: {
            type: "string",
            description:
              "The chain ID of the blockchain network (defaults to 10143 for Monad Testnet if not specified)",
          },
        },
        required: ["sellToken", "buyToken", "sellAmount"],
      },
    },
  },
  handler: async (args) => {
    console.time("fetch_quote_tool");
    try {
      const { sellToken, buyToken, sellAmount, privateKey } = args;
      // Default to Monad Testnet chain ID if not specified
      const chainId = args.chainId || MONAD_TESTNET_CHAIN_ID;

      // Get the current user's wallet address from the private key
      if (!privateKey) {
        throw new Error("Authentication required. No private key available.");
      }

      const takerAddress = getServerWalletAddress(privateKey);

      // Log which chain we're using
      console.log(
        `Fetching quote on chain ID: ${chainId} (${
          chainId === MONAD_TESTNET_CHAIN_ID ? "Monad Testnet" : "Custom Chain"
        })`
      );

      // Set up headers for the 0x API request
      const headers = new Headers({
        "Content-Type": "application/json",
        "0x-api-key": process.env.PEARL_0X_API_KEY!,
        "0x-version": "v2",
      });

      // Construct the API request URL
      const url = new URL("https://api.0x.org/swap/permit2/quote");
      url.searchParams.append("sellToken", sellToken);
      url.searchParams.append("buyToken", buyToken);
      url.searchParams.append("sellAmount", sellAmount);
      url.searchParams.append("taker", takerAddress); // Using the user's wallet address
      url.searchParams.append("chainId", chainId);

      console.log("API Request URL:", url.toString());

      // Fetch the quote from the 0x API
      const response = await fetch(url.toString(), { headers });

      const rawText = await response.text();
      console.log("---------Raw Response Text:", rawText);

      let data;
      try {
        data = JSON.parse(rawText);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        throw new Error(`Failed to parse response as JSON: ${rawText}`);
      }

      // Check and set allowance for sellToken
      const sellTokenContract = getContract({
        address: sellToken as `0x${string}`,
        abi: erc20_ABI,
        client: createServerWalletClient(privateKey),
      });

      const currentAllowance = (await sellTokenContract.read.allowance([
        takerAddress,
        PERMIT2_ADDRESS,
      ])) as bigint;

      if (BigInt(sellAmount) > currentAllowance) {
        console.log(
          `Current allowance for ${sellToken} is insufficient. Approving Permit2 to spend ${sellToken}...`
        );

        try {
          const { request } = await sellTokenContract.simulate.approve([
            PERMIT2_ADDRESS,
            maxUint256,
          ]);
          console.log("Approving Permit2 to spend sellToken...", request);

          const hash = await sellTokenContract.write.approve([
            PERMIT2_ADDRESS,
            maxUint256,
          ]);
          console.log("Approved Permit2 to spend sellToken.", hash);
        } catch (error) {
          console.error("Error approving Permit2:", error);
          throw new Error(
            `Failed to approve Permit2 to spend ${sellToken}: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      } else {
        console.log(
          `Allowance for ${sellToken} is already sufficient for Permit2.`
        );
      }

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch quote");
      }

      try {
        // Log the structure of the response for debugging
        console.log("Response structure:", Object.keys(data));

        // Extract token symbols from route
        const sellTokenSymbol =
          data.route?.tokens?.find(
            (t) => t.address.toLowerCase() === sellToken.toLowerCase()
          )?.symbol || "Unknown";
        const buyTokenSymbol =
          data.route?.tokens?.find(
            (t) => t.address.toLowerCase() === buyToken.toLowerCase()
          )?.symbol || "Unknown";

        // Calculate exchange rate
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

        // Check for issues
        let issuesText = "None";
        if (data.issues) {
          const issues: string[] = [];
          if (data.issues.allowance) {
            issues.push(
              `Allowance Issue: You have an allowance of ${data.issues.allowance.actual} for the spender ${data.issues.allowance.spender}.`
            );
          }
          if (data.issues.balance) {
            issues.push(
              `Balance Issue: Your balance of ${sellTokenSymbol} is ${formatUnits(
                BigInt(data.issues.balance.actual || "0"),
                18
              )}, while the expected amount for the swap is ${formatUnits(
                BigInt(data.issues.balance.expected || "0"),
                18
              )} ${sellTokenSymbol}.`
            );
          }
          if (issues.length > 0) {
            issuesText = issues.join("\n");
          }
        }

        // Format the output
        const output = `
**Quote Details**:
- Sell Token: ${sellTokenSymbol} (${data.sellToken})
- Buy Token: ${buyTokenSymbol} (${data.buyToken})
- Sell Amount: ${formatUnits(BigInt(data.sellAmount), 18)} ${sellTokenSymbol}
- Buy Amount: ${formatUnits(BigInt(data.buyAmount), 18)} ${buyTokenSymbol}
- Exchange Rate: 1 ${sellTokenSymbol} = ${exchangeRate} ${buyTokenSymbol}
- Estimated Gas: ${data.transaction?.gas?.toLocaleString() || "Unknown"}
- Gas Price: ${data.transaction?.gasPrice || "Unknown"} wei
- Sources: ${
          data.route?.fills
            ?.map(
              (fill) =>
                `${fill.source} (${(fill.proportionBps / 100).toFixed(1)}%)`
            )
            .join(", ") || "Unknown"
        }
- Issues Found: ${issuesText}`;

        return output;
      } catch (error) {
        console.error("Error extracting quote information:", error);

        return `
**Error Processing Quote**:
- Status: PROCESSING_ERROR
- Message: Retrieved quote data but couldn't process it properly.
- Raw Data: ${JSON.stringify(data).substring(0, 500)}...`;
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
      throw new Error(
        `Failed to fetch quote: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      console.timeEnd("fetch_quote_tool");
    }
  },
};
