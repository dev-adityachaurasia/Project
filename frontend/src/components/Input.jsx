import React from "react";

const Input = ({ inputType, inputName, label, value, onChangeHandler }) => {
  return (
    <div>
      <label className="block text-left text-black font-semibold mb-2">
        {label}
      </label>
      <input
        type={inputType}
        name={inputName}
        value={value}
        onChange={onChangeHandler}
        className="w-full p-2 border border-black rounded-lg focus:outline-none bg-transparent"
      />
    </div>
  );
};

export default Input;
