import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { ThirdwebSDK } from "@thirdweb-dev/sdk"; // Import Thirdweb SDK
import { useRouter } from "next/router";
import { VotingAddress, VotingAddressABI } from "./constants";

// Function to fetch the contract instance
const fetchContract = (signerOrProvider) =>
    new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
    const votingTitle = "My first smart contract app";
    const router = useRouter();
    const [currentAccount, setCurrentAccount] = useState('');
    const [candidateArray, setCandidateArray] = useState([]);
    const [error, setError] = useState("");

    // Initialize the Thirdweb SDK with API credentials from environment variables
    const sdk = new ThirdwebSDK(new ethers.providers.JsonRpcProvider("http://localhost:8545"), {
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
        secretKey: process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY,
    });

    // Convert IPFS URL to HTTP
    const convertIpfsToHttp = (ipfsUrl) => {
        if (ipfsUrl.startsWith("ipfs://")) {
            return ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
        }
        return ipfsUrl; // Return as is if not an IPFS URL
    };

    // Check if wallet is connected
    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) return console.log("No Ethereum wallet found");
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length) {
            setCurrentAccount(accounts[0]);
        } else {
            console.log("Please connect to MetaMask or try to reload the page");
        }
    };

    // Connect wallet function
    const connectWallet = async () => {
        if (!window.ethereum) return setError("Please install MetaMask");
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setCurrentAccount(accounts[0]);
    };

    const uploadToIPFS = async (file) => {
        if (!file) {
            setError("Please select a file to upload.");
            return;
        }
        try {
            const uploadedFile = await sdk.storage.upload(file);
            const url = convertIpfsToHttp(uploadedFile); // Convert to HTTP URL
            console.log("Uploaded File URL:", url); // Debug: Log the URL
            return url;
        } catch (error) {
            setError("Error uploading file to IPFS: " + error.message);
            console.error(error);
        }
    };

    // Effect to check wallet connection on component mount
    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <VotingContext.Provider value={{ votingTitle, currentAccount, connectWallet, error, candidateArray, uploadToIPFS }}>
            {children}
        </VotingContext.Provider>
    );
};
