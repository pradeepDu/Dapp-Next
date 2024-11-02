import React from "react";

const Button = ({ btnName, handleClick }) => {
  return (
    <button
      className="btn btn-primary px-6 py-2 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200 ease-in-out"
      onClick={handleClick}
    >
      {btnName}
    </button>
  );
};

export default Button;

