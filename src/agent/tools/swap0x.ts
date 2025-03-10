import { ToolConfig } from "./allTools";
import * as dotenv from "dotenv";
import {
  createServerWalletClient,
  getServerWalletAddress
} from "../viem/serverWalletUtils";
import { concat, numberToHex, size, createPublicClient, http } from "viem";
import type { Hex } from "viem";
import { fetchQuoteTool } from "./swapQuote0x";

dotenv.config();

// Constants
const MONAD_TESTNET_CHAIN_ID = "10143";
const MONAD_TESTNET_RPC_URL = "https://testnet-rpc.monad.xyz";

interface ExecuteSwapArgs {
  // Accept either a quote object or individual token parameters
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  quote?: any;
  sellToken?: string;
  buyToken?: string;
  sellAmount?: string;
  privateKey?: string; // Make privateKey optional so it can be injected
  chainId?: string;
}

export const executeSwapTool: ToolConfig<ExecuteSwapArgs> = {
  definition: {
    type: "function",
    function: {
      name: "execute_swap",
      description: "Execute a token swap on Monad Testnet using the 0x API.",
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
            description: "The amount of sellToken to sell (in the smallest unit, e.g., wei)",
          },
          chainId: {
            type: "string",
            description: "The chain ID for the transaction (defaults to 10143 for Monad Testnet)",
          }
        },
        required: ["sellToken", "buyToken", "sellAmount"]
      },
    },
  },
  handler: async (args) => {
    console.time("execute_swap_tool");

    try {
      const { privateKey, chainId = MONAD_TESTNET_CHAIN_ID } = args;

      // Validate privateKey is available
      if (!privateKey) {
        throw new Error("Authentication required. No private key available.");
      }

      let quoteObject;

      // If direct token parameters were provided, fetch the quote first
      if (args.sellToken && args.buyToken && args.sellAmount) {
        console.log("Fetching quote first using token parameters...");
        // Call the quote tool with the same arguments plus privateKey
        const quoteResult = await fetchQuoteTool.handler({
          sellToken: args.sellToken,
          buyToken: args.buyToken,
          sellAmount: args.sellAmount,
          chainId: args.chainId,
          privateKey
        });

        // The real issue: we need to access the raw quote object, not just the formatted string
        // This requires modifying fetchQuoteTool to expose the raw quote data
        if (!quoteResult._quoteObject) {
          console.log("Quote result:", quoteResult);
          throw new Error("Failed to get valid quote data. Make sure fetchQuoteTool returns the raw quote object.");
        }

        quoteObject = quoteResult._quoteObject;
      } else {
        // If a quote object was provided directly, use it
        quoteObject = args.quote;
      }

      // Validate quote object
      if (!quoteObject || !quoteObject.transaction) {
        throw new Error("Invalid quote object. Missing transaction details.");
      }

      // Continue with the existing execution logic
      const walletClient = createServerWalletClient(privateKey);
      const publicClient = createPublicClient({
        transport: http(MONAD_TESTNET_RPC_URL)
      });
      const walletAddress = getServerWalletAddress(privateKey);

      // Handle permit2 signature if needed
      let signature: Hex | undefined;
      if (quoteObject.permit2?.eip712) {
        try {
          signature = await walletClient.signTypedData(quoteObject.permit2.eip712);
          console.log("Signed permit2 message from quote response");
        } catch (error) {
          console.error("Error signing permit2 coupon:", error);
          throw new Error(`Failed to sign permit2 message: ${error instanceof Error ? error.message : "Unknown error"}`);
        }

        // Append signature length and data to transaction.data
        if (signature && quoteObject?.transaction?.data) {
          const signatureLengthInHex = numberToHex(size(signature), {
            signed: false,
            size: 32,
          });

          const transactionData = quoteObject.transaction.data as Hex;
          const sigLengthHex = signatureLengthInHex as Hex;
          const sig = signature as Hex;

          quoteObject.transaction.data = concat([transactionData, sigLengthHex, sig]);
        } else {
          throw new Error("Failed to obtain signature or transaction data");
        }
      }

      // Get nonce for the transaction
      const nonce = await publicClient.getTransactionCount({
        address: walletAddress
      });

      // Determine if we're dealing with a native token (check value field)
      const isNativeToken = quoteObject.transaction.value && parseInt(quoteObject.transaction.value) > 0;

      let transactionHash;

      // Prepare common transaction parameters
      const txParams = {
        to: quoteObject.transaction.to as `0x${string}`,
        data: quoteObject.transaction.data as `0x${string}`,
        value: BigInt(quoteObject.transaction.value || 0),
        gas: quoteObject.transaction.gas ? BigInt(quoteObject.transaction.gas) : undefined,
        gasPrice: quoteObject.transaction.gasPrice ? BigInt(quoteObject.transaction.gasPrice) : undefined,
        nonce,
      };

      if (isNativeToken || !signature) {
        // Direct transaction (native token or no permit needed)
        transactionHash = await walletClient.sendTransaction(txParams);
      } else {
        // ERC20 token transaction with permit2
        const signedTransaction = await walletClient.signTransaction(txParams);

        transactionHash = await walletClient.sendRawTransaction({
          serializedTransaction: signedTransaction,
        });
      }

      console.log(`Swap transaction submitted with hash: ${transactionHash}`);

      // Improve the response format (around line 172)
      // Format output with transaction details
      return {
        status: "SUCCESS",
        transactionHash: transactionHash,
        message: `Swap transaction submitted successfully. Transaction hash: ${transactionHash}`,
        explorerUrl: getExplorerUrl(chainId, transactionHash),
        // Add a toString method for better display
        toString: function () {
          return `✅ Swap transaction submitted successfully!\n\nTransaction Hash: ${transactionHash}\n\nView on Explorer: ${getExplorerUrl(chainId, transactionHash)}`;
        }
      };

    } catch (error) {
      console.error("Error executing swap:", error);

      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      const response = {
        status: "ERROR",
        message: `Failed to execute swap: ${errorMessage}`,
        error: errorMessage,
        // Add a toString method for better display
        toString: function () {
          return `❌ Swap transaction failed: ${errorMessage}\n\nPlease check your token balances and try again.`;
        }
      };

      return response;
    } finally {
      console.timeEnd("execute_swap_tool");
    }
  },
};

// Helper function to get explorer URL based on chain ID
function getExplorerUrl(chainId: string, txHash: string): string {
  switch (chainId) {
    case "10143": // Monad Testnet
      return `https://testnet.monadexplorer.com/tx/${txHash}`;
    case "8453": // Base
      return `https://basescan.org/tx/${txHash}`;
    case "1": // Ethereum
      return `https://etherscan.io/tx/${txHash}`;
    default:
      return `https://blockscan.com/tx/${txHash}`;
  }
}