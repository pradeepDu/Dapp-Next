import React, { useEffect, useContext, useState } from 'react';
import { VotingContext } from '../context/Voter';
import { User, Mail, Check, X, UserCheck, Users, UserX, ChevronRight } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Custom Card Components
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const VoterList = () => {
  const { 
    getAllVoterData, 
    voterArray, 
    voterLength,
    currentAccount,
    connectWallet,
    isLoadingVoters,
    votedVoters,
    convertIpfsToHttp
  } = useContext(VotingContext);
  
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        setError(null);
        console.log("Starting to fetch voter data...");
        await getAllVoterData();
      } catch (err) {
        console.error("Error fetching voter data:", err);
        setError(err.message);
      }
    };

    if (currentAccount) {
      fetchVoters();
    }
  }, [currentAccount, getAllVoterData]);

  // Calculate statistics
  const totalVoters = voterLength || 0;
  const totalVoted = votedVoters?.length || 0;
  const votingProgress = totalVoters > 0 ? (totalVoted / totalVoters) * 100 : 0;
  const remainingVoters = totalVoters - totalVoted;

  // Prepare data for the chart
  const chartData = [
    { name: 'Voted', value: totalVoted },
    { name: 'Not Voted', value: remainingVoters }
  ];

  const renderVoterImage = (voter) => {
    if (!voter.image) return null;
    
    try {
      const imageUrl = convertIpfsToHttp(voter.image);
      return (
        <img 
          src={imageUrl}
          alt={voter.name || 'Voter'} 
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Image load error:', e);
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = `
              <div class="w-full h-full flex items-center justify-center bg-gray-100">
                <svg class="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>`;
          }}
        />
      );
    } catch (err) {
      console.error('Error rendering voter image:', err);
      return null;
    }
  };

  if (!currentAccount) {
    return (
      <div className="min-h-screen p-8 bg-slate-50">
        <Card>
          <CardContent>
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Please connect your wallet</h2>
              <button 
                onClick={connectWallet}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
              >
                Connect Wallet
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 bg-slate-50">
        <Card>
          <CardContent>
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4 text-red-500">Error Loading Voters</h2>
              <p className="text-gray-600">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-slate-50">
      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Voters Card */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Voters</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalVoters}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voted Voters Card */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Voted</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalVoted}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Remaining Voters Card */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Yet to Vote</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{remainingVoters}</h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <UserX className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voting Progress Card */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Progress</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {votingProgress.toFixed(1)}%
                </h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <ChevronRight className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card className="mb-8">
        <CardContent>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Voting Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4F46E5" 
                  strokeWidth={2}
                  dot={{ fill: '#4F46E5', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Voters Grid */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Registered Voters</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Total Voters: {totalVoters}
              </span>
            </div>
          </div>

          {isLoadingVoters ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading voters...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(voterArray) && voterArray.length > 0 ? (
                voterArray.map((voter, idx) => (
                  <Card key={idx} className="overflow-hidden border border-gray-100">
                    <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-500"/>
                    <CardContent className="relative">
                      <div className="absolute -top-12 left-6">
                        <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white">
                          {voter.image ? (
                            renderVoterImage(voter)
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <User className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-10">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {voter.name || 'Unknown Name'}
                        </h3>
                        
                        <div className="flex items-center text-gray-600 mb-4 break-all">
                          <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">{voter.address || 'No Address'}</span>
                        </div>

                        <div className="flex items-center justify-between border-t pt-4">
                          <span className="text-sm text-gray-600">Voting Status</span>
                          {voter.hasVoted ? (
                            <div className="flex items-center text-green-500 bg-green-50 px-3 py-1 rounded-full">
                              <Check className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">Voted</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-500 bg-red-50 px-3 py-1 rounded-full">
                              <X className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">Not Voted</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full">
                  <Card>
                    <CardContent>
                      <div className="text-center">
                        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          No Voters Found
                        </h3>
                        <p className="text-gray-500">
                          There are no registered voters at the moment.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VoterList;