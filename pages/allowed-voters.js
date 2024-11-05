import React, { useState, useCallback, useContext } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { VotingContext } from "../context/Voter";
import images from "../assets";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";

const AddressInput = ({ value, handleClick }) => {
  const formatAddress = (e) => {
    let input = e.target.value.trim();
    // Only format if it's not an ENS name
    if (!input.toLowerCase().endsWith('.eth')) {
      // Remove spaces and ensure proper formatting
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

const AllowedVoters = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    name: "",
    address: "",
    position: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const { uploadToIPFS, createVoter, error } = useContext(VotingContext);

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

      // Validate form inputs
      if (!formInput.name.trim()) {
        setFormError("Name is required");
        setIsSubmitting(false);
        return;
      }
      if (!formInput.address.trim()) {
        setFormError("Address is required");
        setIsSubmitting(false);
        return;
      }
      if (!formInput.position.trim()) {
        setFormError("Position is required");
        setIsSubmitting(false);
        return;
      }
      if (!fileUrl) {
        setFormError("Please upload an image");
        setIsSubmitting(false);
        return;
      }

      console.log("Submitting form with data:", { formInput, fileUrl });
      
      // Call createVoter function
      await createVoter(formInput, fileUrl);
      
      // Reset form after successful submission
      setFormInput({
        name: "",
        address: "",
        position: "",
      });
      setFileUrl(null);

    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError(error.message || "Error creating voter. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-8 bg-base-100">
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Left Column - Procedure for Voter */}
        <div className="flex-1 lg:flex-[0.3] card bg-base-100 shadow-lg p-6 mb-8 lg:mb-0">
          <div className="card bg-base-200 shadow-lg p-6 space-y-4">
            <h4 className="text-lg font-bold">Procedure for being a voter</h4>
            <p>Provide your Metamask Account to proceed with the procedures.</p>
            <p className="text-primary">Contact Candidate</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Voter array mapping would go here */}
            </div>
          </div>
        </div>

        {/* Center Column - Create New Voter */}
        <div className="flex-1 lg:flex-[0.4] card bg-base-200 shadow-lg p-6">
          <h1 className="text-xl font-bold mb-4">Create New Voter</h1>
          
          <form onSubmit={handleSubmit}>
            {/* Display error messages */}
            {(formError || error) && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {formError || error}
              </div>
            )}

            {/* Image upload section */}
            {fileUrl ? (
              <div className="text-center mb-4">
                <img 
                  src={fileUrl} 
                  alt="Uploaded Voter" 
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

            {/* Input Fields */}
            <div className="mt-6 space-y-4">
              <Input
                inputType="text"
                title="Name"
                placeholder="Voter Name"
                value={formInput.name}
                className="hover:border-primary transition-colors"
                handleClick={(e) =>
                  setFormInput({ ...formInput, name: e.target.value })
                }
              />
              
              {/* Updated Address Input */}
              <AddressInput
                value={formInput.address}
                handleClick={(e) =>
                  setFormInput({ ...formInput, address: e.target.value })
                }
              />
              
              <Input
                inputType="text"
                title="Position"
                placeholder="Voter Position"
                value={formInput.position}
                className="hover:border-primary transition-colors"
                handleClick={(e) =>
                  setFormInput({ ...formInput, position: e.target.value })
                }
              />
              
              <div className="mt-4">
                <Button
                  btnName={isSubmitting ? "Processing..." : "Authorize Voter"}
                  className={`w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  handleClick={handleSubmit}
                  disabled={isSubmitting}
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
            <p className="mt-4 text-lg font-semibold text-gray-900">Notice For User</p>
            <p>Organizer <span>0x9785452128525jffnhf</span></p>
            <p className="mt-2 text-sm text-gray-700 max-w-xs">
              Only organizers affiliated with the contract can create voters for the voting election.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllowedVoters;