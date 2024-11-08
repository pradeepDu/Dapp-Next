import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { ethers } from 'ethers';
import { VotingContext } from '../context/Voter';
import { VotingAddress, VotingAddressABI } from '../context/constants';
import backgroundImage from '../assets/back.jpg';
const Card = ({ children, className }) => (
  <div className={`card bg-base-200 shadow-xl ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="card-body">{children}</div>
);

const CardTitle = ({ children }) => (
  <h2 className="card-title">{children}</h2>
);

const CardContent = ({ children }) => (
  <div className="space-y-4">{children}</div>
);

const Button = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`btn btn-primary ${className}`}
  >
    {children}
  </button>
);

const Loader = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
);

const StatsCard = ({ voterLength, candidateLength, isLoading }) => (
  <div className="bg-white/90 rounded-lg shadow-xl p-6 mb-8 w-full max-w-md mx-auto">
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800">Total Voters</h3>
        {isLoading ? (
          <div className="flex justify-center py-2">
            <Loader />
          </div>
        ) : (
          <p className="text-3xl font-bold text-primary">{voterLength || 0}</p>
        )}
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800">Total Candidates</h3>
        {isLoading ? (
          <div className="flex justify-center py-2">
            <Loader />
          </div>
        ) : (
          <p className="text-3xl font-bold text-primary">{candidateLength || 0}</p>
        )}
      </div>
    </div>
  </div>
);

const VotingHomepage = () => {
  const {
    votingTitle,
    candidateArray,
    getNewCandidate,
    isLoadingCandidates,
    giveVote,
    voterLength,
    candidateLength,
    getAllVoterData
  } = useContext(VotingContext);

  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = async () => {
    setIsStatsLoading(true);
    try {
      await Promise.all([
        getNewCandidate(),
        getAllVoterData()
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsStatsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    refreshData();
  }, [refreshTrigger]);

  // Set up event listeners for contract events
  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(VotingAddress, VotingAddressABI, provider);

      // Updated event filters to match your contract events
      const voterCreatedFilter = contract.filters.VoterCreated();
      const candidateCreateFilter = contract.filters.CandidateCreate();

      const handleEvent = () => {
        console.log("Contract event detected, refreshing data...");
        setRefreshTrigger(prev => prev + 1);
      };

      // Subscribe to events
      contract.on(voterCreatedFilter, handleEvent);
      contract.on(candidateCreateFilter, handleEvent);

      // Cleanup
      return () => {
        contract.off(voterCreatedFilter, handleEvent);
        contract.off(candidateCreateFilter, handleEvent);
      };
    }
  }, []);

  // Handle vote submission
  const handleVote = async (address, voteId) => {
    try {
      await giveVote(address, voteId);
      // Add slight delay before refreshing to allow transaction to be processed
      setTimeout(() => {
        setRefreshTrigger(prev => prev + 1);
      }, 2000);
    } catch (error) {
      console.error("Error casting vote:", error);
    }
  };

  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: `url(${backgroundImage.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="hero-content flex-col w-full">
        <div className="text-center text-neutral-content">
          <h1 className="text-5xl font-bold mb-8">{votingTitle}</h1>
          <StatsCard 
            voterLength={voterLength} 
            candidateLength={candidateLength} 
            isLoading={isStatsLoading}
          />
        </div>
        <div className="card-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoadingCandidates ? (
            <div className="flex justify-center py-8">
              <Loader />
            </div>
          ) : (
            candidateArray.map((candidate, index) => (
              <Card key={index} className="bg-base-100 hover:bg-base-300 transition-colors">
                <CardHeader>
                  <div className="avatar">
                    <div className="w-24 rounded-full">
                      <img src={candidate.image} alt={candidate.name} />
                    </div>
                  </div>
                  <CardTitle>{candidate.name}</CardTitle>
                </CardHeader>
                <div className="card-body">
                  <p className="text-base-content/70 overflow-hidden whitespace-nowrap text-ellipsis">
                    Address: {candidate.address}
                  </p>
                  <p className="text-base-content/70">Age: {candidate.age}</p>
                  <p className="text-base-content/70">Votes: {candidate.voteCount}</p>
                  <div className="card-actions justify-end">
                    <Button
                      onClick={() => handleVote(candidate.address, candidate.candidateId)}
                      className=""
                    >
                      Vote
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VotingHomepage;