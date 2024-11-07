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
    const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);

    const [error, setError] = useState("");
    const [voterArray, setVoterArray] = useState([]);
    const [voterLength, setVoterLength] = useState("");
    const [voterAddress, setVoterAddress] = useState([]);
    const [candidateLength, setCandidateLength] = useState("");

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
            if (!name || !address || !position) {
                setError("Please fill in all fields");
                return;
            }
    
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let validAddress = address.trim();
            
            if (ethers.utils.isAddress(validAddress)) {
                // Address is valid, continue
            } else if (validAddress.toLowerCase().endsWith('.eth')) {
                try {
                    const resolvedAddress = await provider.resolveName(validAddress);
                    if (resolvedAddress) {
                        validAddress = resolvedAddress;
                    } else {
                        setError("Could not resolve ENS name.");
                        return;
                    }
                } catch (ensError) {
                    setError("Error resolving ENS name.");
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
            const data = JSON.stringify({ 
                name, 
                address: validAddress, 
                position, 
                image: fileUrl 
            });
    
            const ipfsUrl = await sdk.storage.upload(data);
            const convertedUrl = convertIpfsToHttp(ipfsUrl);
            const formattedAddress = ethers.utils.getAddress(validAddress);
            
            // Estimate gas before sending transaction
            const gasEstimate = await contract.estimateGas.voterRight(
                formattedAddress,
                name,
                convertedUrl,
                convertedUrl
            );
    
            // Add 20% buffer to gas estimate
            const gasLimit = Math.floor(gasEstimate.toNumber() * 1.2);
            
            const transaction = await contract.voterRight(
                formattedAddress,
                name,
                convertedUrl,
                convertedUrl,
                { 
                    gasLimit,
                }
            );
    
            await transaction.wait();
            router.push('./voterList');
    
        } catch (error) {
            handleError(error);
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
            setCandidateArray(voterListData);
            const pushCandidate = [];

            voterListData.map(async(el) => {
                const singleVoterData = await contract.getVoterData(el);
                pushCandidate.push(singleVoterData);    
            });
            const voterList = await contract.getVoterLength();
            setVoterLength(voterList.toNumber());
          
        } catch (error) {
            console.error("Error fetching voter list:", error);
            setError("Error fetching voter list: " + error.message);
        }
    }, []);


    const giveVote = async(id) => {
        try {
            // Voting logic here
        } catch (error) {
            console.error("Error giving vote:", error);
        }
    };

    const setCandidate = useCallback(async (candidateForm, fileUrl) => {
        try {
            const { name, address, age } = candidateForm;
            if (!name || !address || !age) {
                setError("Please fill in all fields");
                return;
            }
    
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let validAddress = address.trim();
            
            if (ethers.utils.isAddress(validAddress)) {
                // Address is valid, continue
            } else if (validAddress.toLowerCase().endsWith('.eth')) {
                try {
                    const resolvedAddress = await provider.resolveName(validAddress);
                    if (resolvedAddress) {
                        validAddress = resolvedAddress;
                    } else {
                        setError("Could not resolve ENS name.");
                        return;
                    }
                } catch (ensError) {
                    setError("Error resolving ENS name.");
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
            const data = JSON.stringify({ name, address: validAddress, image: fileUrl, age });
            const ipfsUrl = await sdk.storage.upload(data);
            const convertedUrl = convertIpfsToHttp(ipfsUrl);
            const formattedAddress = ethers.utils.getAddress(validAddress);
            
            const transaction = await contract.setCandidate(
                formattedAddress,
                age,
                name,
                fileUrl,
                convertedUrl,
                { gasLimit: 500000 }
            );
            
    
            await transaction.wait();
            router.push('./');
    
        } catch (error) {
            handleError(error);
        }
    }, [sdk, router]);

    const getNewCandidate = useCallback(async () => {
        try {
          setIsLoadingCandidates(true);
          const web3Modal = new Web3Modal();
          const connection = await web3Modal.connect();
          const provider = new ethers.providers.Web3Provider(connection);
          const signer = provider.getSigner();
          const contract = fetchContract(signer);
      
          // Get all candidate addresses
          const allCandidateAddresses = await contract.getCandidate();
          console.log("Candidate addresses:", allCandidateAddresses);
      
          // Get the total number of candidates
          const allCandidateLength = await contract.getCandidateLength();
          setCandidateLength(allCandidateLength.toNumber());
      
          // Fetch data for all candidates
          const candidateDataPromises = allCandidateAddresses.map(async (address) => {
            try {
              const candidateData = await contract.getCandidateData(address);
              return {
                name: candidateData[0],
                address: candidateData[5],
                age: candidateData[3],
                image: candidateData[1],
                voteCount: typeof candidateData[4] === 'number' ? candidateData[4] : 0,
                ipfs: candidateData[6],
              };
            } catch (error) {
              console.error(`Error fetching candidate data for address ${address}:`, error);
              return null;
            }
          });
      
          const candidateDataResults = await Promise.all(candidateDataPromises);
          const processedCandidates = candidateDataResults.filter(Boolean);
          console.log("Processed candidates:", processedCandidates);
          setCandidateArray(processedCandidates);
        } catch (error) {
          console.error("Error fetching candidates:", error);
          setError("Failed to fetch candidates: " + error.message);
        } finally {
          setIsLoadingCandidates(false);
        }
      }, [fetchContract]);

    return (
        <VotingContext.Provider value={{
            votingTitle,
            currentAccount,
            connectWallet,
            error,
            candidateArray,
            voterArray,
            voterLength,
            setCandidate,
            createVoter,
            getAllVoterData,
            getNewCandidate,
            giveVote,
            uploadToIPFS,
            candidateLength,
            isLoadingCandidates
        }}>
            {children}
        </VotingContext.Provider>
    );
};