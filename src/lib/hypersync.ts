import { HypersyncClient, JoinMode, BlockField, TransactionField, TraceField, Query } from '@envio-dev/hypersync-client';
import { formatGwei, formatEther } from 'viem';

export async function fetchBlockchainData(address: string) {
  const targetAddress = address.toLowerCase();
  const hyperSyncEndpoint = "https://monad-testnet.hypersync.xyz";

  const client = HypersyncClient.new({
    url: hyperSyncEndpoint,
    maxNumRetries: 5,
    httpReqTimeoutMillis: 60000
  });

  const query: Query = {
    fromBlock: 0,
    traces: [{ to: [targetAddress] }, { from: [targetAddress] }],
    transactions: [{ from: [targetAddress] }, { to: [targetAddress] }],
    fieldSelection: {
      block: [BlockField.Number, BlockField.Timestamp, BlockField.Hash],
      transaction: [
        TransactionField.Hash, TransactionField.Nonce, TransactionField.BlockHash,
        TransactionField.BlockNumber, TransactionField.TransactionIndex,
        TransactionField.From, TransactionField.To, TransactionField.Value,
        TransactionField.GasPrice, TransactionField.Gas, TransactionField.Input,
        TransactionField.Status, TransactionField.EffectiveGasPrice,
        TransactionField.GasUsed, TransactionField.MaxFeePerGas,
        TransactionField.MaxPriorityFeePerGas, TransactionField.Kind
      ],
      trace: [TraceField.Value, TraceField.From, TraceField.To, TraceField.TransactionHash],
    },
    joinMode: JoinMode.JoinNothing
  };

  // ...
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
          gasFeeFormatted: '0 MON',
          valueFormatted: '0'
        };

        // Find block timestamp from block data and assign to transaction
        if (res.data.blocks && res.data.blocks.length > 0) {
          // First try to find by block hash
          const txBlock = res.data.blocks.find(block => block.hash === tx.blockHash);

          if (txBlock && txBlock.timestamp) {
            enhancedTx.timestamp = Number(txBlock.timestamp);
            console.log(`Found timestamp ${txBlock.timestamp} for tx ${tx.hash.slice(0, 6)}`);
          } else {
            // Try to find by block number
            const blockByNumber = res.data.blocks.find(block => block.number === tx.blockNumber);

            if (blockByNumber && blockByNumber.timestamp) {
              enhancedTx.timestamp = Number(blockByNumber.timestamp);
              console.log(`Found timestamp by block number for tx ${tx.hash.slice(0, 6)}`);
            } else {
              // If no timestamp found, use block number * 100000 as a proxy timestamp
              // This ensures that higher block numbers (more recent) appear first
              const proxyTimestamp = tx.blockNumber ? Number(tx.blockNumber) * 100000 : 0;
              enhancedTx.timestamp = proxyTimestamp;
              console.log(`Using block number ${tx.blockNumber} as timestamp proxy for tx ${tx.hash.slice(0, 6)}`);
            }
          }
        }

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

          // Count transactions with value as transfers
          const valueInWei = BigInt(tx.value);
          if (valueInWei > 0) {
            if (tx.from && tx.from.toLowerCase() === targetAddress) {
              // Outgoing transaction with value
              wei_count_out++;
              total_wei_volume_out += valueInWei;
            }

            if (tx.to && tx.to.toLowerCase() === targetAddress) {
              // Incoming transaction with value
              wei_count_in++;
              total_wei_volume_in += valueInWei;
            }
          }
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
    transactions: transactions
      .map(tx => ({
        hash: tx.hash,
        blockNumber: tx.blockNumber || 0,
        timestamp: tx.timestamp || 0,
        from: tx.from,
        to: tx.to,
        valueFormatted: tx.valueFormatted,
        gasFeeFormatted: tx.gasFeeFormatted,
        status: tx.status
      }))
      // Add this sorting to ensure newest transactions are returned first
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)),
    ethTransfers: [] as EthTransfer[], // Could be populated from traces if needed
    erc20Transfers: [],
    erc20Approvals: []
  };

  // Log what timestamps we have before returning
  console.log("Transaction timestamps before return:", transactions.map(tx => ({
    hash: tx.hash ? tx.hash.slice(0, 6) : 'unknown',
    blockNumber: tx.blockNumber,
    timestamp: tx.timestamp,
    date: tx.timestamp ? new Date(tx.timestamp * 1000).toLocaleString() : 'None'
  })));

  // Sort transactions by timestamp (newest first) or block number as fallback
  transactions.sort((a, b) => {
    // Primary sort by timestamp if available
    if (a.timestamp && b.timestamp) return b.timestamp - a.timestamp;
    // Fallback to block number
    if (a.blockNumber && b.blockNumber) return Number(b.blockNumber) - Number(a.blockNumber);
    return 0;
  });

  // Return the sorted transactions
  return {
    address: targetAddress,
    summary: {
      totalTransactions: transactions.length,
      totalETHTransfers: wei_count_in + wei_count_out,
      totalERC20Transfers: 0,
      totalERC20Approvals: 0,
      totalERC20Tokens: 0,
      totalGasPaidFormatted: formatEther(total_gas_paid),
      totalEthVolumeIn: formatEther(total_wei_volume_in),
      totalEthVolumeOut: formatEther(total_wei_volume_out)
    },
    transactions,
    ethTransfers: [],  // Fill these if you have them
    erc20Transfers: [],
    erc20Approvals: []
  };
}