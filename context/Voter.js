import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers, Signer } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import { useRouter } from "next/router";
import { VotingAddress, VotingAddressABI } from "./constants";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");
const fetchContract = (signerOrProvider) =>
    new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
    const votingTitle = "My first smart contract app";
    
    // You can add more state or functionality here as needed
    // For example, you might want to add functions to interact with your smart contract

    return (
        <VotingContext.Provider value={{ votingTitle }}>
            {children}
        </VotingContext.Provider>
    );
};
