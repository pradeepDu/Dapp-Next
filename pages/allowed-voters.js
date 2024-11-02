import React, { useState, useEffect, useCallback, useContext } from "react";
import { useRouter } from "next/router";
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

  const router = useRouter();
  const { uploadToIPFS, voterArray } = useContext(VotingContext);

  const onDrop = useCallback(async (acceptedFiles) => {
    const url = await uploadToIPFS(acceptedFiles[0]);
    setFileUrl(url);
  }, [uploadToIPFS]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  return (
    <div className="p-6 space-y-8 bg-base-100">
      <div>
        {fileUrl && (
          <div className="flex items-center p-4 bg-white shadow-lg rounded-lg space-x-4">
            <img src={fileUrl} alt="Voter Image" className="w-24 h-24 rounded-full object-cover" />
            <div className="text-gray-700">
              <p>
                <strong>Name:</strong> <span className="ml-2">{formInput.name}</span>
              </p>
              <p>
                <strong>Address:</strong>{" "}
                <span className="ml-2">{formInput.address.slice(0, 20)}</span>
              </p>
              <p>
                <strong>Position:</strong> <span className="ml-2">{formInput.position}</span>
              </p>
            </div>
          </div>
        )}
        {!fileUrl && (
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
        )}
      </div>

      <div className="card bg-base-100 shadow-lg p-6">
        <h1 className="text-xl font-bold">Create New Voter</h1>
        <div className="mt-4">
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center">
            <input {...getInputProps()} />
            <div className="space-y-2">
              <p>Upload File: JPG, PNG, GIF (Max size 10MB)</p>
              <div className="flex justify-center">
                <Image src={images.creator} width={150} height={150} objectFit="contain" alt="File upload" />
              </div>
              <p>Drag and Drop File</p>
              <p>or Browse Media on your device</p>
            </div>
          </div>
        </div>

        <div className="mt-6 form-control w-full">
          <Input
            inputType="text"
            title="Name"
            placeholder="Voter Name"
            handleClick={(e) =>
              setFormInput({ ...formInput, name: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Address"
            placeholder="Voter Address"
            handleClick={(e) =>
              setFormInput({ ...formInput, address: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Position"
            placeholder="Voter Position"
            handleClick={(e) =>
              setFormInput({ ...formInput, position: e.target.value })
            }
          />
          <div className="my-4">
          <Button btnName="Authorized Voter" handleClick={() => {}} />
          </div>
        </div>
      </div>
      <div className="my-4 p-4 bg-gray-200 rounded-lg shadow-lg max-w-md mx-auto">
  <div className="flex flex-col items-center text-center">
    <Image
      src={images.creator}
      alt="User profile"
      width={200}
      height={200}
      className="w-16 h-16 rounded-full object-cover"
    />
    <p className="mt-4 text-lg font-semibold text-gray-900">Notice For User</p>
    <p className="mt-2 text-sm text-gray-700 max-w-xs">
      Only organizers affiliated with the contract can create voters for the voting election.
    </p>
  </div>
</div>

    </div>
  );
};

export default AllowedVoters;
