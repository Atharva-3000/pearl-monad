/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { fetchBlockchainData } from '@/lib/hypersync';

// Add this helper function at the top of your file
function serializeBigInt(data: any): any {
  return JSON.parse(JSON.stringify(data, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}

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

    console.log(`Fetching blockchain data for address: ${address}`);
    const data = await fetchBlockchainData(address);

    // Log to help debug
    console.log(`Found ${data.transactions.length} transactions`);
    if (data.transactions.length > 0) {
      console.log(`First transaction hash: ${data.transactions[0].hash}`);
    }

    // And then change your return statement
    return NextResponse.json(serializeBigInt(data));

  } catch (error) {
    console.error("Error processing blockchain data:", error);
    return NextResponse.json(
      { error: 'Failed to fetch blockchain data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}