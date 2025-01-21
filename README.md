# Blockchain Voting DApp

A decentralized voting application built with **Next.js**, **Solidity**, **MetaMask**, **Hardhat**, and **Tailwind CSS**. This DApp provides a secure, transparent, and tamper-proof voting platform on the Ethereum blockchain.

## Project Overview

1. **Frontend with Next.js and Tailwind CSS**
   - **User Interface**: Built with Next.js and styled using Tailwind CSS, providing a responsive and user-friendly UI. Users can register, view candidates, cast votes, and see voting results.
   - **MetaMask Integration**: Users connect their MetaMask wallet to the DApp for authentication and authorization, allowing interaction with the Ethereum blockchain.

2. **Smart Contract Development with Solidity**
   - **Voting Contract**: A Solidity smart contract is created to handle all voting logic, candidate registration, and eligibility checks. The contract:
     - **Registers Candidates**: Allows authorized users to add candidates.
     - **Records Votes**: Stores votes securely on the blockchain to ensure transparency.
     - **Ensures Eligibility**: Checks voter eligibility to prevent double voting.
     - **Data Storage**: Stores all voting data on-chain, making it accessible and verifiable.

3. **Blockchain Interaction with Hardhat**
   - **Smart Contract Compilation and Deployment**: Hardhat is used for compiling, deploying, and testing the Solidity contract locally or on the Sepolia testnet.
   - **Testing and Debugging**: Hardhat enables testing and debugging of key functions like candidate registration, vote casting, and vote counting.

4. **Voting and Data Flow**
   - **Candidate Registration**: Admins register candidates, storing the data on the blockchain. Next.js retrieves this data for display in the UI.
   - **Casting Votes**: Users connect their MetaMask wallet, select a candidate, and cast a vote, which triggers a transaction recorded on-chain.
   - **Viewing Results**: The app fetches vote counts from the blockchain in real-time.

## Setup Instructions

### Prerequisites

- **VS Code Editor**  
  [Download VS Code](https://code.visualstudio.com/download)

- **Node.js and NPM**  
  - Node.js: v18.12.1  
  - NPM: 8.19.2  
  [Download Node.js](https://nodejs.org/en/download)

- **Thirdweb SDK**  
  - Get your Thirdweb SDK API Key and Secret Key  
  [Visit Thirdweb](https://thirdweb.com/)

- **Test Faucets**  
  - Use Chainlink faucets to get free test Ether for deployment on Sepolia  
  [Get Test Faucets](https://faucets.chain.link/)

- **Remix IDE**  
  - Used for deploying contracts and generating the ABI.  
  [Open Remix IDE](https://remix-project.org)

### Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/blockchain-voting-dapp.git
   cd blockchain-voting-dapp
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   - In the root directory, create a `.env` file and add the following:
     ```plaintext
     NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
     NEXT_PUBLIC_THIRDWEB_SECRET_KEY=your_thirdweb_secret_key
     ```

4. **Compile and Deploy Smart Contract**
   - Use Hardhat or Remix IDE to compile and deploy the Solidity smart contract.
   - Deploy on Sepolia or a local Hardhat network.

5. **Run the DApp**
   ```bash
   npm run dev
   ```
6. **Connect MetaMask**
   - Configure MetaMask to connect with Sepolia Testnet or your local Hardhat network.

### Additional Resources  
- **Sepolia Testnet**  
  - [Learn more about Sepolia](https://sepolia.net/)
