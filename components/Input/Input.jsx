import React from "react";

const Input = ({ inputType, title, placeholder, handleClick, value, min, max, className }) => {
  return (
    <div className="flex flex-col space-y-2">
      <p className="text-lg font-semibold">{title}</p>
      <div className="form-control">
        <input
          type={inputType}
          className={`input input-bordered w-full max-w-xs ${className}`}
          placeholder={placeholder}
          onChange={handleClick}
          value={value}
          min={min}
          max={max}
        />
      </div>
    </div>
  );
};

export default Input;