import { NextResponse } from 'next/server';
import { fetchBlockchainData } from '@/lib/hypersync';

export const runtime = 'nodejs'; // Force Node.js runtime

export async function POST(request: Request) {
  try {
    const { address } = await request.json();
    
    if (!address || !/^0x[a-fA-F0-9]{40}$/i.test(address)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address provided' }, 
        { status: 400 }
      );
    }

    const data = await fetchBlockchainData(address);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Error processing blockchain data:", error);
    return NextResponse.json(
      { error: 'Failed to fetch blockchain data' }, 
      { status: 500 }
    );
  }
}