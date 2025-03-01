"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Fetches a user's private key from the database by their DID
 * 
 * @param did The decentralized identifier from Privy
 * @returns The user's private key as a string
 * @throws Error if user or private key not found
 */
export async function fetchPrivateKey(did: string): Promise<string> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: did },
      select: { privateKey: true }
    });

    if (!user || !user.privateKey) {
      throw new Error(`No private key found for user with DID: ${did}`);
    }

    return user.privateKey;
  } catch (error) {
    console.error("Error fetching private key:", error);
    throw error;
  }
}

export function useWalletData() {
  const { user } = usePrivy();
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrivateKey() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const privateKey = await fetchPrivateKey(user.id);
        setPrivateKey(privateKey);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to load wallet data');
      } finally {
        setLoading(false);
      }
    }

    fetchPrivateKey();
  }, [user?.id]);

  return { privateKey, loading, error };
}

// Export a helper function to get just the private key in a component
export function usePrivateKey(): string | null {
  const { privateKey } = useWalletData();
  return privateKey;
}