
![wall pearl](https://github.com/user-attachments/assets/0aaf3ac9-c0a9-4b38-b42c-d73622632f78)

# P. E. A. R. L.?
P. E. A. R. L. stands for <strong>Parallel Enhanced AI for Rapid-Ledger processing</strong>.
P. E. A. R. L. is a cross technology product leveraging efficiencies of both Artificial Intelligence & Blockchain to provide a Safe, Secure and the best User Experience while interacting with Decentralized Web.

## Problem Gravity:
Blockchain protocols are often complex, even for technically proficient users. The process of selecting and downloading a wallet, configuring it, and executing a blockchain transaction may seem straightforward but involves multiple steps, creating friction in user onboarding. User Onboarding is probably the most crucial thing for any industry to survive & thrive. Within Blockchain, everyone is trying to onboard user & create mass adoption but most of them are failing. Multiple reasons are there, but the complex user experience is one of the biggest obstacle in terms of user onboarding.
### Let's break down the problem a bit:
![problem statement](https://github.com/SiddharthManjul/pearl-monad/blob/main/public/problemStmt.png)
As you can see there are over 7 steps a user have to perform to execute a simple wallet-to-wallet transaction.

## Solution: P. E. A. R. L. AI:
P.E.A.R.L. harnesses AI to deliver a seamless user experience through a chat-based interface, enabling effortless interaction with blockchain protocols. Instead of navigating complex, multi-step processes, users can simply input a prompt to execute transactions instantly.
### Let's have a sneak peak how P. E. A. R. L. executes transactions
![pearl transactions](https://github.com/SiddharthManjul/pearl-monad/blob/main/public/pearlTransaction.png)
Using P. E. A. R. L., a user can execute the same transaction using just 1 prompt as you can see in the above Image.

## Features:
<strong>P. E. A. R. L. provides lot of features stated as following:</strong>
<p><strong>Indexing: </strong>Indexes all the transaction happened using the platform and also shows them through the Dashboard.</p>
<p><strong>Social Logins: </strong>Social Login/Signup for easy onboarding on the platform.</p>
<p><strong>Embedded Wallets: </strong>It generates Embedded Wallet as soon as a user signups for the platform.</p>
<p><strong>Multiple Tools: </strong>Multiple Tools such as Price Fetch, Send Transaction, Swap, Swap Quote, In-built Faucet and more.</p>

## Installation and Running:
1. Clone the Repository and install it locally.
2. Run the command "bun install" or "bun i" or your preferred Tool.
3. Create a new .env file and paste the content in it from .env.example.
4. Fill in all the fields in .env file. (Variables should remain exactly same).
5. Run the project using "bun run dev" or your preferred tool.

## Tools available:
### Read Tools:
1. get_balance.
2. get_wallet_address.
3. fetch_price.
4. fetch_quote.

### Write Tools:
1. send_transaction
2. execute_swap
3. request_funds

## Prompts Format:
1. <strong>get_balance:</strong> What is my wallet balance?
2. <strong>get_wallet_address:</strong> What is my wallet address?
3. <strong>fetch_price:</strong> fetch token price for sellToken: 0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37, buyToken: 0xf817257fed379853cDe0fa4F97AB987181B1E5Ea, sellAmount: 10000000000000000000000, chainId: 10143
4. <strong>fetch_quote:</strong> fetch quote price for sellToken: 0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701, buyToken: 0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D, sellAmount: 1000000000000000000
5. <strong>send_transaction:</strong> send 0.1 MON (quantity and token depends on the user) to address 0xdc8E072aD4dDae1b4F6ec02bdE8D9702147C1219 (address also depends on the user).
6. <strong>execute_swap:</strong> execute swap for sellToken: 0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701, buyToken: 0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D, sellAmount: 1000000000000000000.
7. <strong>request_funds:</strong> Send 0.5 MON to the address 0x123....

<strong>Note: execute_swap will only work after fetch_quote tool.</strong>.