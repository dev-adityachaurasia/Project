import { useState } from "react";

const Input = () => {
  const [value, setValue] = useState({
    name: "",
    email: "",
  });
  const onChange = (e) => {
    setValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <>
      <div className="w-screen h-screen flex flex-col gap-3  justify-center items-center">
        <label className="relative">
          <input
            type="text"
            name="name"
            value={value.name}
            onChange={onChange}
            className="w-full p-2 border border-black rounded-lg focus:outline input"
          />
          <span
            className={`input-text absolute top-2 left-2 transition-all duration-200 ${
              value.name.length === 0 ? "input-text" : "input-fill"
            }`}
          >
            Name
          </span>
        </label>
        <label className="relative">
          <input
            type="email"
            name="email"
            value={value.email}
            onChange={onChange}
            className="w-full p-2 border border-black rounded-lg focus:outline input"
          />
          <span
            className={`input-text absolute top-2 left-2 transition-all duration-200 ${
              value.email.length === 0 ? "input-text" : "input-fill"
            }`}
          >
            Email
          </span>
        </label>
      </div>
    </>
  );
};

export default Input;
