import { PrivyClient } from '@privy-io/server-auth';
import { ethers } from 'ethers';

export const initializePrivyClient = () => {
  if (!process.env.PRIVY_APP_ID || !process.env.PRIVY_APP_SECRET) {
    throw new Error('Missing Privy environment variables');
  }

  return new PrivyClient(
    process.env.PRIVY_APP_ID,
    process.env.PRIVY_APP_SECRET
  );
};

export const getProvider = () => {
  return new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL!);
};