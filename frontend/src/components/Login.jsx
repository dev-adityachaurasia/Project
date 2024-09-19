import React, { useState } from "react";
import axios from "axios";
import background from "../assets/Back.jpg";
import Input from "./Input";
const Login = () => {
  const [login, setLogin] = useState({
    value: "",
    password: "",
  });
  const onChangeHandler = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    // Add your login logic here
    try {
      const res = await axios.post("http://localhost:8000/login", login, {
        headers: {
          "Context-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen  bg-center">
      {/* Transparent login box */}
      <img
        src={background}
        alt=""
        className="w-full h-screen overflow-hidden object-cover z-[-2] absolute md:w-full md:h-full "
      />
      <div className="backdrop-blur-sm bg-white/40 p-8 rounded-lg shadow-lg  w-[90vw] md:w-[60vh] lg:w-[60vh] xl:w-[50vh] sm:w-[60vw]">
        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-black">Login</h2>
          </div>

          {/* Email Label and Input */}
          <Input
            inputType="text"
            inputName="value"
            label="Username Or Email"
            onChangeHandler={onChangeHandler}
          ></Input>

          {/* Password Label and Input */}
          <Input
            inputType="password"
            inputName="password"
            label="Password"
            onChangeHandler={onChangeHandler}
          ></Input>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#78A8EB] text-black py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>

          {/* Divider */}
          <div className="flex items-center justify-center space-x-2">
            <span className="border-t border-black w-full"></span>
            <span className="text-black-500">Else</span>
            <span className="border-t border-black w-full"></span>
          </div>

          {/* Forgot Password Link */}
          <div className="text-center">
            <a href="#" className="text-yellow-600 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-black">
              Don't have an account?{" "}
              <a href="#" className="text-yellow-600 hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
