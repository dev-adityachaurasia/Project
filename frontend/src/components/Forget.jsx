import { useState } from "react";
import axios from "axios";
import otpVerify from "../middleware/verification.js";
import { NavLink } from "react-router-dom";

const Forget = () => {
  const [credential, setCredentiale] = useState({
    value: "",
    username: "",
    password: "",
  });
  const [page, setPage] = useState(0);
  const [errors, setErrors] = useState({});
  const [OTP, setOTP] = useState(null);
  const [genOTP, setGenOTP] = useState(null);

  const onChange = (e) => {
    setCredentiale((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (genOTP.toString() === OTP) {
      setPage(2);
    } else
      setErrors((prev) => ({
        ...prev,
        otp: "Invalid OTP",
      }));
  };
  const onChangePassword = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post(
        "http://localhost:8000/update-password",
        credential,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res) {
        console.log(res.data);
      } else {
        console.log("not done");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const sendOTP = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post(
        "http://localhost:8000/check-username",
        credential,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.isTaken) {
        let user = res.data.user;
        setPage(1);
        let otp = 1000 + Math.floor(Math.random() * 8999);
        setGenOTP(otp);
        setCredentiale((prev) => ({
          ...prev,
          username: user._id,
        }));
        otpVerify(user.name, user.email, otp);
      } else {
        setErrors((prev) => ({
          ...prev,
          username: "Username not found",
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex items-center flex-col justify-center h-screen  bg-cente gap-2">
      <div className="backdrop-blur-sm border border-solid bg-white p-8 pb-4  w-[70vw] md:w-[60vh] lg:w-[60vh] xl:w-[40vh] sm:w-[60vw]">
        {page === 0 && (
          <>
            <form onSubmit={sendOTP}>
              <div className="text-center">
                <h2 className="text-xl font-bold text-black">
                  Forget Password
                </h2>
              </div>
              <div className="justify-center items-center flex flex-col gap-6">
                <label className="w-full relative justify-center flex">
                  <input
                    type="text"
                    name="value"
                    onChange={onChange}
                    value={credential.value}
                    className="w-full  border border-black p-3 rounded-lg "
                  />
                  <span
                    className={`absolute top-3 left-3 transition-all duration-200 ${
                      credential.value === "" ? "input-text" : "input-fill"
                    }`}
                  >
                    Usename or Email
                  </span>
                </label>
                {errors.username && (
                  <p className="flex justify-center m-0 p-0 text-red-500 text-sm">
                    {errors.username}
                  </p>
                )}
                <button
                  onClick={sendOTP}
                  disabled={credential.value === "" ? true : false}
                  className={`w-full border-none text-black py-3 rounded-lg transition duration-300 ${
                    credential.value === "" ? "bg-[#78A8EB]" : "bg-blue-600"
                  }`}
                >
                  Continue
                </button>
              </div>
              <div className="text-center">
                <p className="text-black pt-2">
                  If you remenber the password ?{" "}
                  <NavLink
                    to="/"
                    className="text-yellow-600 hover:underline  no-underline"
                  >
                    Login
                  </NavLink>
                </p>
              </div>
            </form>
          </>
        )}
        {page === 1 && (
          <>
            <div className="justify-center items-center flex flex-col gap-6">
              <h2 className="text-xl font-bold text-black">OTP Verification</h2>
              <label className="w-full relative justify-center flex">
                <input
                  type="number"
                  name="otp"
                  onChange={(e) => setOTP(e.target.value)}
                  value={OTP}
                  className="w-full  border border-black p-3 rounded-lg [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span
                  className={`absolute top-3 left-3 transition-all duration-200 ${
                    OTP === "" ? "input-text" : "input-fill"
                  }`}
                >
                  Enter OTP
                </span>
              </label>
              <button
                type="submit"
                disabled={
                  OTP === null ||
                  OTP.toString().length < 4 ||
                  OTP.toString().length > 4
                    ? true
                    : false
                }
                className={`p-3 rounded-lg border-none ${
                  OTP === null ||
                  OTP.toString().length < 4 ||
                  OTP.toString().length > 4
                    ? "bg-[#78A8EB]"
                    : "bg-blue-500"
                }`}
                onClick={onSubmit}
              >
                Verify
              </button>
            </div>
          </>
        )}
        {page === 2 && (
          <>
            <div className="justify-center items-center flex flex-col gap-6">
              <h2 className="text-xl font-bold text-black">Reset Password</h2>
              <label className="w-full relative justify-center flex">
                <input
                  type="password"
                  name="password"
                  onChange={onChange}
                  value={credential.password}
                  className="w-full  border border-black p-3 rounded-lg "
                />
                <span
                  className={`absolute top-3 left-3 transition-all duration-200 ${
                    credential.password === "" ? "input-text" : "input-fill"
                  }`}
                >
                  New Password
                </span>
              </label>
              <button
                disabled={
                  !credential.password || credential.password.length < 6
                    ? true
                    : false
                }
                onClick={onChangePassword}
                className={`w-full border-none text-black py-3 rounded-lg transition duration-300 ${
                  !credential.password || credential.password.length < 6
                    ? "bg-[#78A8EB]"
                    : "bg-blue-600"
                }`}
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Forget;
