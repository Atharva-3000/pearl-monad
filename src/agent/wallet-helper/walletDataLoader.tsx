"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";

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
        const response = await fetch('/api/wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ did: user.id })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch private key');
        }

        const data = await response.json();
        setPrivateKey(data.privateKey);
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