import { ToolConfig } from "./allTools.js";
import { createViemPublicClient } from "../viem/createViemPublicClient";
import { erc20_ABI, erc20_bytecode } from "../abi/erc20-abi";
import { createServerWalletClient } from "../viem/serverWalletUtils";

export const deployErc20Tool: ToolConfig<{
  name: string;
  symbol: string;
  initialSupply?: string;
  privateKey?: string;
}> = {
  definition: {
    type: "function",
    function: {
      name: "deploy_erc20",
      description: "Deploy a new ERC20 token contract",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The name of the token",
          },
          symbol: {
            type: "string",
            description: "The symbol of the token",
          },
          initialSupply: {
            type: "string",
            description:
              'Initial supply in natural language (e.g., "one million", "half a billion", "10k", "1.5M tokens"). Interpret the amount and format it into a number amount and then convert it into wei. Defaults to 1 billion tokens if not specified.',
          },
        },
        required: ["name", "symbol"],
      },
    },
  },
  handler: async (args) => {
    // Extract the privateKey from args
    const { privateKey, ...deployArgs } = args;

    if (!privateKey) {
      throw new Error("Authentication required. No private key available.");
    }

    const baseNumber = parseFloat(deployArgs.initialSupply || "1000000000"); // 1 billion default

    const publicClient = createViemPublicClient();
    const walletClient = createServerWalletClient(privateKey);

    const hash = await walletClient.deployContract({
      account: walletClient.account,
      abi: erc20_ABI,
      bytecode: erc20_bytecode,
      args: [deployArgs.name, deployArgs.symbol, baseNumber],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    console.log(`Contract deployed at address: ${receipt.contractAddress}`);

    return `${deployArgs.name} (${deployArgs.symbol}) token deployed successfully at: ${receipt.contractAddress}`;
  },
};
