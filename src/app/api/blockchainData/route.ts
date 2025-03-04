// src/app/api/blockchain-data/route.ts
import { NextResponse } from 'next/server';
import { formatEther } from 'viem';
import { HypersyncClient, JoinMode, BlockField, TransactionField, TraceField, Query } from '@envio-dev/hypersync-client';

// Format gas price to Gwei
function formatGwei(wei: bigint): string {
  return (Number(wei) / 1e9).toFixed(2) + " Gwei";
}

export async function POST(request: Request) {
  try {
    // Get the address from request body
    const body = await request.json();
    const { address } = body;

    if (!address || !/^0x[a-fA-F0-9]{40}$/i.test(address)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address provided' },
        { status: 400 }
      );
    }

    // Convert address to lowercase for consistent comparison
    const targetAddress = address.toLowerCase();
    const hyperSyncEndpoint = "https://monad-testnet.hypersync.xyz";

    console.log(`Fetching blockchain data for address: ${targetAddress}`);

    // Create hypersync client
    const client = HypersyncClient.new({
      url: hyperSyncEndpoint,
      maxNumRetries: 5,
      httpReqTimeoutMillis: 60000
    });

    // Build the query
    const query: Query = {
      fromBlock: 0,
      traces: [{ to: [targetAddress] }, { from: [targetAddress] }],
      transactions: [{ from: [targetAddress] }, { to: [targetAddress] }],
      fieldSelection: {
        block: [BlockField.Number, BlockField.Timestamp, BlockField.Hash],
        transaction: [
          TransactionField.Hash, TransactionField.Nonce, TransactionField.BlockHash, TransactionField.BlockNumber, TransactionField.TransactionIndex,
          TransactionField.From, TransactionField.To, TransactionField.Value, TransactionField.GasPrice, TransactionField.Gas, TransactionField.Input, TransactionField.Status,
          TransactionField.EffectiveGasPrice, TransactionField.GasUsed, TransactionField.MaxFeePerGas,
          TransactionField.MaxPriorityFeePerGas, TransactionField.Kind
        ],
        trace: [TraceField.Value, TraceField.From, TraceField.To, TraceField.TransactionHash],
      },
      joinMode: JoinMode.JoinNothing
    };

    console.log("Running the query...");
    const receiver = await client.stream(query, {});

    // Base transaction interface from HyperSync
    interface Transaction {
      hash?: string;
      nonce?: number | bigint;
      blockHash?: string;
      blockNumber?: number;
      transactionIndex?: number;
      from?: string;
      to?: string;
      value?: string | bigint;
      gasPrice?: string | bigint;
      gas?: number | bigint;
      input?: string;
      status?: number;
      effectiveGasPrice?: string | bigint;
      gasUsed?: string | bigint;
      maxFeePerGas?: string | bigint;
      maxPriorityFeePerGas?: string | bigint;
      type?: number;
      timestamp?: number;
      transactionHash?: string;
      gasUsedForL1?: bigint;
    }

    // Enhanced transaction with formatted values
    interface EnhancedTransaction extends Transaction {
      gasUsedFormatted: string;
      gasPriceFormatted: string;
      gasFeeFormatted: string;
      valueFormatted: string;
    }

    // Collection for transactions
    const transactions: EnhancedTransaction[] = [];

    // Tracking variables
    let total_gas_paid = BigInt(0);
    let total_wei_volume_out = BigInt(0);
    let total_wei_volume_in = BigInt(0);
    let wei_count_in = 0;
    let wei_count_out = 0;
    let total_eoa_tx_sent = 0;
    let batchCount = 0;
    let highestBlockScanned = 0;

    // Process the results
    while (true) {
      const res = await receiver.recv();
      if (res === null) break;

      batchCount++;
      highestBlockScanned = Math.max(highestBlockScanned, res.nextBlock);

      // Process transactions
      if (res.data.transactions && res.data.transactions.length > 0) {
        for (const tx of res.data.transactions) {
          if (!tx.hash) continue;

          // Initialize enhanced transaction with base properties
          const enhancedTx: EnhancedTransaction = {
            ...tx,
            gasUsedFormatted: '0',
            gasPriceFormatted: '0 Gwei',
            gasFeeFormatted: '0 ETH',
            valueFormatted: '0'
          };

          if (tx.gasUsed && tx.effectiveGasPrice) {
            const gasUsed = BigInt(tx.gasUsed);
            const gasPrice = BigInt(tx.effectiveGasPrice);
            const gasFee = gasPrice * gasUsed;

            enhancedTx.gasUsedFormatted = gasUsed.toString();
            enhancedTx.gasPriceFormatted = formatGwei(gasPrice);
            enhancedTx.gasFeeFormatted = formatEther(gasFee);

            if (tx.from && tx.from.toLowerCase() === targetAddress) {
              total_eoa_tx_sent += 1;
              total_gas_paid += gasFee;
            }
          }

          if (tx.value) {
            enhancedTx.valueFormatted = formatEther(BigInt(tx.value));
          }

          transactions.push(enhancedTx);
        }
      }

      // Process traces for ETH transfers
      if (res.data.traces) {
        for (const trace of res.data.traces) {
          if (!trace.from || !trace.to || !trace.value) continue;

          const fromAddress = trace.from.toLowerCase();
          const toAddress = trace.to.toLowerCase();
          const traceValue = BigInt(trace.value);

          if (fromAddress === targetAddress) {
            wei_count_out++;
            total_wei_volume_out += traceValue;
          } else if (toAddress === targetAddress) {
            wei_count_in++;
            total_wei_volume_in += traceValue;
          }
        }
      }
    }

    // Define interface for our ETH transfer type
    interface EthTransfer {
      txHash: string;
      valueFormatted: string;
      from: string;
      to: string;
    }

    // Prepare the response data
    const responseData = {
      address: targetAddress,
      summary: {
        totalTransactions: transactions.length,
        totalETHTransfers: wei_count_in + wei_count_out,
        totalERC20Transfers: 0,
        totalERC20Approvals: 0,
        totalERC20Tokens: 0,
        totalGasPaid: total_gas_paid.toString(),
        totalGasPaidFormatted: formatEther(total_gas_paid),
        totalEthVolumeIn: formatEther(total_wei_volume_in),
        totalEthVolumeOut: formatEther(total_wei_volume_out),
        scannedBlocks: highestBlockScanned
      },
      transactions: transactions.map(tx => ({
        hash: tx.hash,
        blockNumber: tx.blockNumber || 0,
        timestamp: tx.timestamp || 0,
        from: tx.from,
        to: tx.to,
        valueFormatted: tx.valueFormatted,
        gasFeeFormatted: tx.gasFeeFormatted,
        status: tx.status
      })),
      ethTransfers: [] as EthTransfer[], // Could be populated from traces if needed
      erc20Transfers: [],
      erc20Approvals: []
    };

    console.log(`Completed blockchain data query for ${targetAddress}`);
    console.log(`Found ${transactions.length} transactions`);

    // Return the formatted data
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error processing blockchain data:", error);
    return NextResponse.json(
      { error: 'Failed to fetch blockchain data' },
      { status: 500 }
    );
  }
}