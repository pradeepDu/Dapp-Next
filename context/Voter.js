import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import { VotingAddress, VotingAddressABI } from "./constants";

// Create an IPFS client
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

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

    const uploadToIPFS =async(file)=>{
        try{
            const added = await client.add({content:file});
            const url = 'https://ipfs.infura.io/ipfs/${added.path}';
            return url;
        } catch(error){
            setError("Error uploading file to IPFS");
        }
    };

    // Effect to check wallet connection on component mount
    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <VotingContext.Provider value={{ votingTitle, currentAccount, connectWallet, error, candidateArray,uploadToIPFS }}>
            {children}
        </VotingContext.Provider>
    );
};
