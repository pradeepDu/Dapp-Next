
# Voting Dapp (Decentralized)

Build Blockchain Voting Dapp (Decentralized) using Nextjs, Solidity, MetaMask & Hardhat | Voting App


## Project Overview
###1. Frontend with Next.js and tailwind css
User Interface (UI): Next.js is used for the frontend, providing a responsive interface where users can register, view candidates, and vote. You’ll create pages for candidate registration, viewing voter lists, casting votes, and viewing results.
MetaMask Integration: Users connect their MetaMask wallet to the DApp for authentication and authorization. MetaMask acts as a gateway for users to interact with the Ethereum blockchain.
###2. Smart Contract Development with Solidity
Voting Contract: A Solidity smart contract is created to handle voting logic, candidate registration, and eligibility checks. The contract:
Registers Candidates: Allows authorized users to add candidates.
Records Votes: Stores votes on-chain to ensure transparency and immutability.
Ensures Eligibility: Checks voter eligibility to prevent double voting.
Data Storage: The smart contract securely stores the voting data on the blockchain, making it accessible and verifiable.
###3. Blockchain Interaction with Hardhat
Smart Contract Compilation and Deployment: Hardhat is used to compile, deploy, and test the Solidity contract locally on the Hardhat network or a testnet like Sepolia.
Testing and Debugging: Hardhat allows testing the voting contract functions, such as candidate registration, vote casting, and vote counting, before deployment.
###4. Voting and Data Flow
Candidate Registration: Admins register candidates, which get stored on the blockchain. This data is fetched by Next.js to display in the UI.
Casting Votes: Users connect their MetaMask wallet, select a candidate, and cast their vote, which triggers a transaction on the blockchain.
Viewing Results: The app fetches vote counts from the contract, providing real-time results directly from the blockchain.


## Instruction

Kindly follow the following Instructions to run the project in your system and install the necessary requirements


```https://code.visualstudio.com/download
  WATCH: Setup & Demo Of Project
```

#### Install Vs Code Editor

```https://code.visualstudio.com/download
  GET: VsCode Editor
```

#### NodeJs & NPM Version

```https://nodejs.org/en/download
  NodeJs: v18.12.1
  NPM: 8.19.2
```

#### Setup Video

```https://code.visualstudio.com/download
  WATCH: Setup & Demo Of Project
```

#### Install Vs Code Editor

```https://code.visualstudio.com/download
  GET: VsCode Editor
```
#### NodeJs & NPM Version

```https://nodejs.org/en/download
  NodeJs: v18.12.1
  NPM: 8.19.2
```

#### ThirdWeb

```https://thirdweb.com/
  thirdwebsdk API KEY
  thirdwebsdk SECRET KEY
```
#### Test Faucets

Chainlink will provide you with some free test faucets which you can transfer to your wallet address for deploying the contract

```https://faucets.chain.link/
  Get: Free Test Faucets
```

#### RemixID

I have used RemixID for deploying the contract and generation of the ABI in the project, but you can use any other tools like Hardhat, etc.

```https://remix-project.org
  OPEN: RemixID
```

#### Sepolia Testnet

```I have used sepolia testnet to deploy the contract that has been used over here
