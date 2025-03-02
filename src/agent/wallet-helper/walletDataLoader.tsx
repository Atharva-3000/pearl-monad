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
        console.log("🔑 No user ID found, skipping private key fetch");
        setLoading(false);
        return;
      }

      console.log("👤 Fetching private key for user:", user.id);
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
        console.log("✅ Private key fetched successfully");
        setPrivateKey(data.privateKey);
      } catch (err) {
        console.error("❌ Error fetching private key:", err);
        setError(err instanceof Error ? err.message : 'Failed to load wallet data');
      } finally {
        setLoading(false);
      }
    }

    fetchPrivateKey();
  }, [user?.id]);

  return { privateKey, loading, error };
}

export function usePrivateKey(): string | null {
  const { privateKey } = useWalletData();
  return privateKey;
}