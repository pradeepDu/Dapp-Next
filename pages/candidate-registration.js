import React, { useState, useCallback, useContext, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { VotingContext } from "../context/Voter";
import images from "../assets";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";

const AddressInput = ({ value, handleClick }) => {
  const formatAddress = (e) => {
    let input = e.target.value.trim();
    if (!input.toLowerCase().endsWith('.eth')) {
      input = input.replace(/\s+/g, '');
    }
    handleClick({
      target: {
        value: input
      }
    });
  };

  return (
    <Input
      inputType="text"
      title="Address"
      placeholder="Enter Ethereum address or ENS name"
      value={value}
      className="hover:border-primary transition-colors font-mono"
      handleClick={formatAddress}
    />
  );
};

const CandidateCard = ({ candidate }) => {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <img 
            src={candidate.image} 
            alt={candidate.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">{candidate.name}</h3>
            <p className="text-sm text-gray-600 truncate">Address: {candidate.address}</p>
            <p className="text-sm text-gray-600">Age: {candidate.age}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CandidateRegistration = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    address: "",
    age: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [useMetaMask, setUseMetaMask] = useState(false);

  const { 
    uploadToIPFS, 
    setCandidate, 
    error, 
    currentAccount,
    connectWallet,
    getNewCandidate,
    candidateLength,
    candidateArray 
  } = useContext(VotingContext);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        await getNewCandidate();
      } catch (error) {
        console.error("Error fetching candidates:", error);
        setFormError("Error fetching candidates. Please try again.");
      }
    };

    fetchCandidates();
  }, [getNewCandidate]);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (useMetaMask && typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setIsWalletConnected(true);
            setCandidateForm(prev => ({ ...prev, address: accounts[0] }));
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
          setFormError("Error checking wallet connection");
        }
      }
    };

    checkWalletConnection();
  }, [currentAccount, useMetaMask]);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      setIsWalletConnected(true);
      setUseMetaMask(true);
    } catch (error) {
      setFormError("Failed to connect wallet. Please try again.");
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      try {
        if (acceptedFiles.length > 0) {
          console.log("Uploading file...");
          const url = await uploadToIPFS(acceptedFiles[0]);
          console.log("File uploaded:", url);
          setFileUrl(url);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setFormError("Error uploading file. Please try again.");
      }
    },
    [uploadToIPFS]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setFormError("");
      setIsSubmitting(true);

      if (!candidateForm.name.trim()) {
        setFormError("Name is required");
        setIsSubmitting(false);
        return;
      }
      if (!candidateForm.address.trim()) {
        setFormError("Address is required");
        setIsSubmitting(false);
        return;
      }
      if (!candidateForm.age || candidateForm.age < 18) {
        setFormError("Valid age is required (must be 18 or older)");
        setIsSubmitting(false);
        return;
      }
      if (!fileUrl) {
        setFormError("Please upload an image");
        setIsSubmitting(false);
        return;
      }

      console.log("Submitting form with data:", { candidateForm, fileUrl });
      
      await setCandidate(candidateForm, fileUrl);
      await getNewCandidate();
      
      setCandidateForm({
        name: "",
        address: "",
        age: "",
      });
      setFileUrl(null);

    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError(error.message || "Error registering candidate. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-8 bg-base-100">
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Left Column - Procedure for Candidates */}
        <div className="flex-1 lg:flex-[0.3] card bg-base-100 shadow-lg p-6 mb-8 lg:mb-0">
          <div className="card bg-base-200 shadow-lg p-6 space-y-4">
            <h4 className="text-lg font-bold">Procedure for Registration</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="useMetaMask"
                  checked={useMetaMask}
                  onChange={(e) => setUseMetaMask(e.target.checked)}
                  className="checkbox"
                />
                <label htmlFor="useMetaMask">Use MetaMask</label>
              </div>
              
              {useMetaMask ? (
                !isWalletConnected ? (
                  <div className="space-y-4">
                    <p>Please connect your MetaMask wallet to proceed with registration.</p>
                    <Button
                      btnName="Connect MetaMask"
                      className="w-full"
                      handleClick={handleConnectWallet}
                    />
                  </div>
                ) : (
                  <>
                    <p>Connected wallet: {currentAccount}</p>
                    <p className="text-primary">Contact Election Committee</p>
                  </>
                )
              ) : (
                <p>Manual address entry mode</p>
              )}
              
              {candidateLength !== undefined && (
                <div className="mt-4 p-4 bg-base-300 rounded-lg">
                  <p className="text-sm">Total Registered Candidates: {candidateLength}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center Column - Register New Candidate */}
        <div className="flex-1 lg:flex-[0.4] card bg-base-200 shadow-lg p-6">
          <h1 className="text-xl font-bold mb-4">Register New Candidate</h1>
          
          <form onSubmit={handleSubmit}>
            {(formError || error) && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {formError || error}
              </div>
            )}

            {fileUrl ? (
              <div className="text-center mb-4">
                <img 
                  src={fileUrl} 
                  alt="Uploaded Candidate" 
                  className="w-48 h-48 rounded-full object-cover mx-auto mb-2" 
                />
                <p className="text-gray-500">Uploaded Image</p>
              </div>
            ) : (
              <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center hover:border-primary cursor-pointer">
                <input {...getInputProps()} />
                <div className="space-y-2">
                  <p>Upload File: JPG, PNG, GIF (Max size 5MB)</p>
                  <div className="flex justify-center">
                    <Image src={images.upload} width={150} height={150} objectFit="contain" alt="File upload" />
                  </div>
                  <p>Drag and Drop File</p>
                  <p>or Browse Media on your device</p>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-4">
              <Input
                inputType="text"
                title="Name"
                placeholder="Candidate Name"
                value={candidateForm.name}
                className="hover:border-primary transition-colors"
                handleClick={(e) =>
                  setCandidateForm(prev => ({ ...prev, name: e.target.value }))
                }
              />
              
              {!useMetaMask && (
                <AddressInput
                  value={candidateForm.address}
                  handleClick={(e) =>
                    setCandidateForm(prev => ({ ...prev, address: e.target.value }))
                  }
                />
              )}
              
              <Input
                inputType="number"
                title="Age"
                placeholder="Candidate Age (must be 18 or older)"
                value={candidateForm.age}
                min="18"
                className="hover:border-primary transition-colors"
                handleClick={(e) =>
                  setCandidateForm(prev => ({ ...prev, age: e.target.value }))
                }
              />
              
              <div className="mt-4">
                <Button
                  btnName={isSubmitting ? "Processing..." : "Register Candidate"}
                  className={`w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  handleClick={handleSubmit}
                  disabled={isSubmitting || (useMetaMask && !isWalletConnected)}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Right Column - Notice for User */}
        <div className="flex-1 lg:flex-[0.3] card bg-gray-200 rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center text-center">
            <Image
              src={images.creator}
              alt="User profile"
              width={80} 
              height={80}
              className="w-16 h-16 rounded-full object-cover"
            />
            <p className="mt-4 text-lg font-semibold text-gray-900">Notice For Candidates</p>
            <p>Organizer <span>0x9785452128525jffnhf</span></p>
            <p className="mt-2 text-sm text-gray-700 max-w-xs">
              Only eligible candidates can register for the election. All submissions will be verified by the election committee.
            </p>
          </div>
        </div>
      </div>

      {/* Candidate List Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Registered Candidates ({candidateLength || 0})</h2>
        
        {!candidateArray && <p>Loading candidates...</p>}
        
        {candidateArray && candidateArray.length === 0 && (
          <p className="text-gray-600">No candidates registered yet.</p>
        )}
        
        {candidateArray && candidateArray.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidateArray.map((candidate, index) => (
              <CandidateCard key={index} candidate={candidate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateRegistration;