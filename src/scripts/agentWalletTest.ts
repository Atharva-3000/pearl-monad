// scripts/agentWalletTest.ts
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { createWalletClient, http, parseEther, publicActions } from 'viem'
import { monadTestnet } from 'viem/chains'


const monadConfig = {
  chain: {
    ...monadTestnet,
    rpcUrls: {
      default: {
        http: ['https://testnet-rpc.monad.xyz']
      }
    }
    
  },
  transport: http()
}

// 2. Core Test Function
async function testLocalAgentWallet() {
  console.log('[1] Starting AI agent wallet test...')
  
  try {
    // 3. Generate and Validate Private Key
    console.log('[2] Generating secure private key...')
    const privateKey = generatePrivateKey()
    console.log(`    Generated Key: ${privateKey.slice(0, 12)}...${privateKey.slice(-6)}`)

    // 4. Create Account Instance
    console.log('[3] Initializing local account...')
    const account = privateKeyToAccount(privateKey)

    console.log(`    Agent Address: ${account.address}`)

    // 5. Initialize Wallet Client
    console.log('[4] Connecting to Monad testnet...')
    const client = createWalletClient({
      ...monadConfig,
      account // Hoist account for AI operations
    }).extend(publicActions)

    // 6. Verify Network Connection
    console.log('[5] Checking network status...')
    const chainId = await client.getChainId()
    console.log(`    Connected to Chain ID: ${chainId}`)

    // 7. Check Initial Balance
    console.log('[6] Checking agent balance...')
    const balance = await client.getBalance({ address: account.address })
    console.log(`    Balance: ${parseEther(balance.toString())} MONAD`)

    // 8. Prepare Test Transaction
    console.log('[7] Preparing test transaction...')
    const txParams = {
      to: '0x000000000000000000000000000000000000dEaD' as `0x${string}`, // Burn address
      value: parseEther('0.001'), // 0.001 MONAD
      gas: 21000n // Fixed gas for simple transfer
    }

    // 9. Simulate Transaction
    console.log('[8] Simulating transaction...')
    const gasEstimate = await client.estimateGas(txParams)
    const gasPrice = await client.getGasPrice()
    const gasLimit = gasEstimate
    console.log(`    Estimated Gas: Price=${gasPrice} Limit=${gasLimit}`)

    // 10. Execute Transaction
    console.log('[9] Sending transaction...')
    const txHash = await client.sendTransaction(txParams)
    console.log(`    Transaction Hash: ${txHash}`)

    // 11. Wait for Confirmation
    console.log('[10] Waiting for confirmation...')
    const receipt = await client.waitForTransactionReceipt({ hash: txHash })
    console.log(`    Block Number: ${receipt.blockNumber}`)
    console.log(`    Status: ${receipt.status}`)

    // 12. Final Balance Check
    console.log('[11] Verifying updated balance...')
    const finalBalance = await client.getBalance({ address: account.address })
    console.log(`    Final Balance: ${parseEther(finalBalance.toString())} MONAD`)

    console.log('[12] Test completed successfully!')
    process.exit(0)

  } catch (error) {
    console.error('[ERROR] Critical failure in AI wallet test:')
    console.error(error)
    process.exit(1)
  }
}

// Run the test
testLocalAgentWallet()