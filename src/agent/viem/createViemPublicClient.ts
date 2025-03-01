import { createPublicClient, http } from "viem";
import { monadTestnet } from "viem/chains";

export function createViemPublicClient() {
  return createPublicClient({
    chain: monadTestnet,
    transport: http(),
  });
}