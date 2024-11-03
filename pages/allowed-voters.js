import React, { useState, useCallback, useContext } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { VotingContext } from "../context/Voter";
import images from "../assets";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";

const AllowedVoters = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    name: "",
    address: "",
    position: "",
  });

  const { uploadToIPFS } = useContext(VotingContext);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const url = await uploadToIPFS(acceptedFiles[0]);
        setFileUrl(url); // Set the uploaded file's URL
      }
    },
    [uploadToIPFS]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });
  console.log(fileUrl);

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
              {/* Uncomment and map voterArray when available */}
              {/* voterArray.map((el, i) => (
                <div key={i + 1} className="card bg-base-100 shadow p-4">
                  <div className="flex items-center space-x-4">
                    <img src="" alt="Profile Photo" className="w-16 h-16 rounded-full" />
                    <div>
                      <p><strong>Name:</strong> {el.name}</p>
                      <p><strong>Address:</strong> {el.address}</p>
                      <p><strong>Details:</strong> {el.details}</p>
                    </div>
                  </div>
                </div>
              )) */}
            </div>
          </div>
        </div>

        {/* Center Column - Create New Voter */}
        <div className="flex-1 lg:flex-[0.4] card bg-base-200 shadow-lg p-6">
          <h1 className="text-xl font-bold mb-4">Create New Voter</h1>
          
          {/* Display uploaded image if available */}
          {fileUrl ? (
            <div className="text-center mb-4">
              <img src={fileUrl} alt="Uploaded Voter" className="w-48 h-48 rounded-full object-cover mx-auto mb-2" />
              <p className="text-gray-500">Uploaded Image</p>
            </div>
          ) : (
            <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center hover:border-primary">
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
              className="hover:border-primary transition-colors"
              handleClick={(e) =>
                setFormInput({ ...formInput, name: e.target.value })
              }
            />
            <Input
              inputType="text"
              title="Address"
              placeholder="Voter Address"
              className="hover:border-primary transition-colors"
              handleClick={(e) =>
                setFormInput({ ...formInput, address: e.target.value })
              }
            />
            <Input
              inputType="text"
              title="Position"
              placeholder="Voter Position"
              className="hover:border-primary transition-colors"
              handleClick={(e) =>
                setFormInput({ ...formInput, position: e.target.value })
              }
            />
            <div className="mt-4">
              <Button btnName="Authorized Voter" handleClick={() => {}} />
            </div>
          </div>
        </div>

        {/* Right Column - Notice for User */}
        <div className="flex-1 lg:flex-[0.3] card bg-gray-200 rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center text-center">
            <Image
              src={images.creator}
              alt="User profile"
              width={80} height={80}
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
