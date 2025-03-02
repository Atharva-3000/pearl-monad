
import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http } from "viem";
import { monadTestnet } from "viem/chains";
import { eip712WalletActions } from "viem/zksync";

export function createServerWalletClient(privateKey: string) {
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  
  return createWalletClient({
    account,
    chain: monadTestnet,
    transport: http(),
  }).extend(eip712WalletActions());
}

export function getServerWalletAddress(privateKey: string) {
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  return account.address;
}