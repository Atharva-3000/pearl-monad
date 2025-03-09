import { privateKeyToAccount } from "viem/accounts";
import { Address, createWalletClient, http } from "viem";
import { monadTestnet } from "viem/chains";
import { eip712WalletActions } from "viem/zksync";

// Global variable to store the wallet client
let globalWalletClient: ReturnType<typeof createWalletClient> | null = null;

// New function to fetch private key without hooks
async function fetchPrivateKey(did: string): Promise<string | null> {
  try {
    const response = await fetch("/api/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ did }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch private key");
    }

    const data = await response.json();
    return data.privateKey;
  } catch (error) {
    console.error("Error fetching private key:", error);
    return null;
  }
}

export async function initializeWalletClient(
  did: string
): Promise<ReturnType<typeof createWalletClient> | null> {
  // If client already exists, return it
  if (globalWalletClient) {
    return globalWalletClient;
  }

  const privateKey = await fetchPrivateKey(did);
  if (!privateKey) {
    console.log("⚠️ No private key available, wallet client creation skipped");
    return null;
  }

  console.log("🔐 Creating wallet client with valid private key");
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  console.log("📱 Wallet address:", account.address);

  globalWalletClient = createWalletClient({
    account,
    chain: monadTestnet,
    transport: http(),
  }).extend(eip712WalletActions());

  console.log(
    "✨ Wallet client created successfully for chain:",
    monadTestnet.name
  );
  return globalWalletClient;
}

export function useViemWalletClient() {
  return globalWalletClient;
}

export function getWalletAddress(): Address {
  if (!globalWalletClient) {
    throw new Error(
      "No wallet client available. Please initialize the wallet client first by calling `initializeWalletClient`."
    );
  }
  if (!globalWalletClient.account?.address) {
    throw new Error("No wallet address found in the wallet client.");
  }
  return globalWalletClient.account.address;
}
