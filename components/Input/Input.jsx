import React from "react";

const Input = ({ inputType, title, placeholder, handleClick }) => {
  return (
    <div className="flex flex-col space-y-2">
      <p className="text-lg font-semibold">{title}</p>
      {inputType === "text" && (
        <div className="form-control">
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            placeholder={placeholder}
            onChange={handleClick}
          />
        </div>
      )}
    </div>
  );
};

export default Input;
