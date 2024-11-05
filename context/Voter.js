import React, { useState, useEffect, useCallback } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import { VotingAddress, VotingAddressABI } from "./constants";

const fetchContract = (signerOrProvider) =>
    new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
    const votingTitle = "My first smart contract app";
    const router = useRouter();
    const [currentAccount, setCurrentAccount] = useState('');
    const [candidateArray, setCandidateArray] = useState([]);
    const [error, setError] = useState("");

    const sdk = new ThirdwebSDK(new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/3WKyJT6bOfqzeL2rf1wfKMwAj0KD-X91"), {
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
        secretKey: process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY,
    });

    const convertIpfsToHttp = (ipfsUrl) => {
        if (ipfsUrl.startsWith("ipfs://")) {
            return ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
        }
        return ipfsUrl;
    };

    const checkIfWalletIsConnected = useCallback(async () => {
        if (!window.ethereum) return console.log("No Ethereum wallet found");
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length) {
            setCurrentAccount(accounts[0]);
        } else {
            console.log("Please connect to MetaMask or try to reload the page");
        }
    }, []);

    const connectWallet = useCallback(async () => {
        if (!window.ethereum) return setError("Please install MetaMask");
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setCurrentAccount(accounts[0]);
    }, []);

    const uploadToIPFS = useCallback(async (file) => {
        if (!file) {
            setError("Please select a file to upload.");
            return;
        }
        try {
            const uploadedFile = await sdk.storage.upload(file);
            return convertIpfsToHttp(uploadedFile);
        } catch (error) {
            setError("Error uploading file to IPFS: " + error.message);
            console.error(error);
        }
    }, [sdk]);

    useEffect(() => {
        checkIfWalletIsConnected();
    }, [checkIfWalletIsConnected]);

    const createVoter = useCallback(async (formInput, fileUrl) => {
        try {
            const { name, address, position } = formInput;
    
            // Validate input fields
            if (!name || !address || !position) {
                setError("Please fill in all fields");
                return;
            }
    
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            
            let validAddress = address.trim();
            
            // First check if it's a valid Ethereum address
            if (ethers.utils.isAddress(validAddress)) {
                // Address is valid, continue
            } else if (validAddress.toLowerCase().endsWith('.eth')) {
                // Only try ENS resolution for .eth addresses
                try {
                    const resolvedAddress = await provider.resolveName(validAddress);
                    if (resolvedAddress) {
                        validAddress = resolvedAddress;
                    } else {
                        setError("Could not resolve ENS name. Please use a valid ENS name or Ethereum address.");
                        return;
                    }
                } catch (ensError) {
                    setError("Error resolving ENS name. Please use a valid Ethereum address.");
                    return;
                }
            } else {
                setError("Please enter a valid Ethereum address or ENS name.");
                return;
            }
    
            const code = await provider.getCode(VotingAddress);
            if (code === "0x") {
                setError("No contract found at the specified address.");
                return;
            }
    
            const contract = fetchContract(signer);
    
            // Prepare data and upload to IPFS
            const data = JSON.stringify({ 
                name, 
                address: validAddress, 
                position, 
                image: fileUrl 
            });
    
            // Upload to IPFS
            const ipfsUrl = await sdk.storage.upload(data);
            const convertedUrl = convertIpfsToHttp(ipfsUrl);
    
            // Format the data properly for the contract call
            const formattedAddress = ethers.utils.getAddress(validAddress);
            
            const transaction = await contract.voterRight(
                formattedAddress,
                name,
                convertedUrl,
                convertedUrl,
                { 
                    gasLimit: 500000,
                }
            );
    
            // Wait for transaction confirmation
            await transaction.wait();
    
            // Navigate to voter list only after successful transaction
            router.push('./voterList');
    
        } catch (error) {
            if (error.code === 'ACTION_REJECTED') {
                setError("Transaction was rejected in MetaMask");
            } else if (error.code === 'INSUFFICIENT_FUNDS') {
                setError("Insufficient funds for transaction");
            } else if (error.message.includes("gas")) {
                setError("Gas estimation failed. The transaction might fail");
            } else {
                setError(error.message || "Error creating voter. Please try again.");
            }
        }
    }, [sdk, router]);
   
    
    
    const getAllVoterData = useCallback(async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const code = await provider.getCode(VotingAddress);
            if (code === "0x") {
                throw new Error("No contract found at the specified address.");
            }

            const voterListData = await contract.getVoterList();
            console.log("Voter List Data: ", voterListData);
            setCandidateArray(voterListData); // Updated array state name
        } catch (error) {
            console.error("Error fetching voter list:", error);
            setError("Error fetching voter list: " + error.message);
        }
    }, []);

    useEffect(() => {
        getAllVoterData();
    }, [getAllVoterData]);

    return (
        <VotingContext.Provider value={{
            votingTitle,
            currentAccount,
            connectWallet,
            error,
            candidateArray,
            uploadToIPFS,
            createVoter,
        }}>
            {children}
        </VotingContext.Provider>
    );
};
