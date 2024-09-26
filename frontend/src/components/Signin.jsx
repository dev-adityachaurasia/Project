import axios from "axios";
import { useState } from "react";
import Tick from "./ui/Tick.jsx";
import cross from "../assets/x-mark.png";
import { Link, NavLink } from "react-router-dom";
import otpVerify from "../middleware/verification.js";
import { collegeList, district, year } from "../../messed/collegeList.js";
import OptionNull from "./ui/OptionNull.jsx";

const Signin = () => {
  const [page, setPage] = useState(0);
  const [hover, setHover] = useState({
    email: false,
    username: false,
    password: false,
    name: false,
  });
  const [OTP, setOTP] = useState(null);
  const [genOtp, setGenOtp] = useState();
  const [credentials, setCredentials] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    branch: "",
    district: "",
    college: "",
    year: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    branch: "",
    college: "",
    year: "",
  });
  const [next, setNext] = useState("");
  const onChange = (e) => {
    setHover((prev) => ({
      ...prev,
      email: false,
      username: false,
      password: false,
      name: false,
    }));
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (e.target.name === "username") {
      validUsername(e.target.value);
    }
    if (e.target.name === "name") {
      validName(e.target.value);
    }
    if (e.target.name === "email") {
      validEmail(e.target.value);
    }
    if (e.target.name === "district") {
      validDistrict(e.target.value);
      setCredentials({
        ...credentials,
        college: "",
        branch: "",
        [e.target.name]: e.target.value,
      });
    }
  };
  const nextHandle = (e) => {
    e.preventDefault();
    if (!errors.username && !errors.email) {
      setPage(1);
    } else {
      setNext("Username Or Email Not Available");
    }
  };
  const secondNextHandle = async (e) => {
    e.preventDefault();
    let otp = 1000 + Math.floor(Math.random() * 8999);
    setGenOtp(otp);
    otpVerify(credentials.name, credentials.email, otp);
    setPage(2);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (genOtp.toString() === OTP) {
      let res = await axios.post(
        "http://localhost:8000/register",
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data) console.log(res.data.message);
      else console.log(res.message);
    } else {
      setErrors((prev) => ({
        ...prev,
        otp: "Invalid OTP",
      }));
    }
  };
  const reSendOtp = async () => {
    let otp = 1000 + Math.floor(Math.random() * 8999);
    setGenOtp(otp);
    otpVerify(credentials.name, credentials.email, otp);
  };
  const disable = () => {
    if (
      credentials.district === "" ||
      credentials.district === "Select College District" ||
      credentials.college === "" ||
      credentials.college === "Select Your College" ||
      credentials.branch === "" ||
      credentials.branch === "Select Your Branch" ||
      credentials.year === "" ||
      credentials.year === "Select Your Current Year"
    ) {
      return true;
    } else {
      return false;
    }
  };
  const validation = async (value) => {
    const search = await axios.post("http://localhost:8000/check-username", {
      value: value,
    });
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(value)) {
      if (!search.data.isTaken) {
        setErrors((prevErrors) => ({ ...prevErrors, username: "" }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "Username Taken Already",
        }));
      }
    } else {
      if (!search.data.isTaken) {
        setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Email Taken Already",
        }));
      }
    }
  };
  const validUsername = (username) => {
    const regex =
      /^(?!.*\.\.)(?!^\.)(?!.*\_\_\_\_\_)[a-zA-Z0-9_.]{3,16}(?<!\.)$/;
    if (!regex.test(username) || Number(username)) {
      if (username.length < 3) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "To Small",
        }));
      } else if (Number(username)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "Can't contaion only numbers",
        }));
      } else if (username.length > 16) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "Too Long",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "Can't contain special character or spaces",
        }));
      }
    } else {
      validation(username);
    }
  };
  const validName = (name) => {
    const regex = /^[a-z. A-Z]{2,16}$/;
    if (!regex.test(name)) {
      if (name.length > 16) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: "Too Long",
        }));
      } else if (name.length < 2) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: "Too Short",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: "Can't be number or special character",
        }));
      }
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "",
      }));
    }
  };
  const validEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regex.test(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid Email",
      }));
    } else {
      validation(email);
    }
  };
  const validDistrict = () => {
    if (credentials.district === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        district: "Please Select District",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        district: "",
      }));
    }
  };
  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="backdrop-blur-sm  bg-white p-8 border-none  w-[70vw]  xl:border xl:border-solid md:border md:border-solid md:w-[50vh] lg:w-[60vh] xl:w-[40vh] sm:w-[60vw]">
          <form onSubmit="" className="flex flex-col gap-7">
            {page === 0 && (
              <>
                <h2 className="text-xl m-0 text-black">Create New Account</h2>
                <label className="w-full relative justify-center flex text-gray-400">
                  <input
                    type="text"
                    name="name"
                    value={credentials.name}
                    onChange={onChange}
                    className="w-full  border border-black p-3 rounded-lg "
                  />
                  <span
                    className={`absolute top-3 left-3 transition-all duration-200 ${
                      credentials.name === "" ? "input-text" : "input-fill"
                    } `}
                  >
                    Name
                  </span>

                  {errors.name && credentials.name ? (
                    <>
                      <img
                        className={`absolute bg-red-400 rounded-lg flex justify-center items-center right-2 top-3`}
                        width="15px"
                        src={`${cross}`}
                        alt=""
                        onMouseOver={() => {
                          setHover((prev) => ({
                            ...prev,
                            name: true,
                          }));
                        }}
                        onMouseOut={() => {
                          setHover((prev) => ({
                            ...prev,
                            name: false,
                          }));
                        }}
                      />
                      {hover.name && (
                        <p className="text-red-600 border bg-white border-yellow-500 border-solid top-5 p-1 rounded-lg -right-9 absolute text-xs ">
                          {errors.name}
                        </p>
                      )}
                    </>
                  ) : (
                    credentials.name && <Tick />
                  )}
                </label>
                <label className="w-full relative justify-center flex text-gray-400">
                  <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={onChange}
                    className="w-full  border border-black p-3 rounded-lg "
                  />
                  <span
                    className={`absolute top-3 left-3 transition-all duration-200 ${
                      credentials.username === "" ? "input-text" : "input-fill"
                    } `}
                  >
                    Username
                  </span>

                  {errors.username && credentials.username ? (
                    <>
                      <img
                        className={`absolute bg-red-400 rounded-lg flex justify-center items-center right-2 top-3`}
                        width="15px"
                        src={`${cross}`}
                        alt=""
                        onMouseOver={() => {
                          setHover((prev) => ({
                            ...prev,
                            username: true,
                          }));
                        }}
                        onMouseOut={() => {
                          setHover((prev) => ({
                            ...prev,
                            username: false,
                          }));
                        }}
                      />
                      {hover.username && (
                        <p className="text-red-400 border bg-white border-yellow-500 border-solid top-5 p-1 rounded-lg -right-9 absolute text-xs ">
                          {errors.username}
                        </p>
                      )}
                    </>
                  ) : (
                    credentials.username && <Tick />
                  )}
                </label>
                <label className="w-full relative justify-center flex text-gray-400">
                  <input
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={onChange}
                    className="w-full  border border-black p-3 rounded-lg "
                  />
                  <span
                    className={`absolute top-3 left-3 transition-all duration-200 ${
                      credentials.email === "" ? "input-text" : "input-fill"
                    } `}
                  >
                    Email
                  </span>
                  {errors.email && credentials.email ? (
                    <>
                      <img
                        className={`absolute bg-red-400 rounded-lg flex justify-center items-center right-2 top-3`}
                        width="15px"
                        src={`${cross}`}
                        alt=""
                        onMouseOver={() => {
                          setHover((prev) => ({
                            ...prev,
                            email: true,
                          }));
                        }}
                        onMouseOut={() => {
                          setHover((prev) => ({
                            ...prev,
                            email: false,
                          }));
                        }}
                      />
                      {hover.email && (
                        <p className="text-red-600 border bg-white border-yellow-500 border-solid top-5 p-1 rounded-lg -right-9 absolute text-xs ">
                          {errors.email}
                        </p>
                      )}
                    </>
                  ) : (
                    credentials.email && <Tick />
                  )}
                </label>
                <label className="w-full relative justify-center flex text-gray-400">
                  <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={onChange}
                    className="w-full  border border-black p-3 rounded-lg "
                  />
                  <span
                    className={`absolute top-3 left-3 transition-all duration-200 ${
                      credentials.password === "" ? "input-text" : "input-fill"
                    } `}
                  >
                    Set Password
                  </span>
                </label>
                <button
                  onClick={nextHandle}
                  disabled={
                    credentials.username === "" ||
                    credentials.email === "" ||
                    credentials.email === "" ||
                    errors.username ||
                    errors.email ||
                    errors.name ||
                    credentials.password.length < 6
                      ? true
                      : false
                  }
                  className={`p-3 rounded-lg border-none  ${
                    credentials.username === "" ||
                    credentials.email === "" ||
                    errors.username ||
                    errors.name ||
                    errors.email ||
                    credentials.password.length < 6
                      ? "bg-[#78A8EB]"
                      : "bg-blue-500"
                  }`}
                >
                  Next
                </button>
                {next && <p>username or email not Available</p>}
                <div className="text-center m-0 p-0">
                  <p className="text-black ">
                    Already have an account ?{" "}
                    <NavLink
                      to="/"
                      className="text-yellow-600 hover:underline no-underline"
                    >
                      Login
                    </NavLink>
                  </p>
                </div>
              </>
            )}
            {page === 1 && (
              <>
                <span
                  onClick={() => setPage(0)}
                  className="font-bold m-0 contents text-black"
                >
                  Back
                </span>
                <label className="w-full relative justify-center flex text-gray-400">
                  <select
                    name="district"
                    value={credentials.district}
                    onChange={onChange}
                    className="w-full  border border-black p-3 rounded-lg "
                  >
                    <OptionNull value="Select Your District"></OptionNull>
                    {district.map((value, i) => (
                      <option key={i} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <span
                    className={`absolute top-3 left-3 transition-all duration-200 ${
                      credentials.district === "Select Your District" ||
                      credentials.district === ""
                        ? "input-text opacity-0"
                        : "input-fill"
                    }`}
                  >
                    College District
                  </span>
                </label>
                <label className="w-full relative justify-center flex text-gray-400">
                  <select
                    name="college"
                    value={credentials.college}
                    onChange={onChange}
                    className="w-full  border border-black p-3 rounded-lg "
                  >
                    <OptionNull value="Select Your College"></OptionNull>
                    {collegeList.map((value, i) =>
                      value.district === credentials.district ? (
                        <option key={i} value={value.college}>
                          {value.college}
                        </option>
                      ) : (
                        ""
                      )
                    )}
                  </select>
                  <span
                    className={`absolute top-3 left-3 transition-all duration-200 ${
                      credentials.college === "" ||
                      credentials.college === "Select Your College"
                        ? "input-text opacity-0"
                        : "input-fill"
                    } `}
                  >
                    College Name
                  </span>
                </label>
                <label className="w-full relative justify-center flex text-gray-400">
                  <select
                    name="branch"
                    value={credentials.branch}
                    onChange={onChange}
                    className="w-full  border border-black p-3 rounded-lg "
                  >
                    <OptionNull value="Select Your Branch"></OptionNull>
                    {collegeList.map((value, i) =>
                      value.district === credentials.district &&
                      value.college === credentials.college
                        ? value.branch.map((value, i) => (
                            <option key={i} value={value}>
                              {value}
                            </option>
                          ))
                        : ""
                    )}
                  </select>
                  <span
                    className={`absolute top-3 left-3 transition-all duration-200 ${
                      !credentials.branch ||
                      credentials.branch === "Select Your Branch"
                        ? "input-text opacity-0"
                        : "input-fill"
                    } `}
                  >
                    Branch
                  </span>
                </label>
                <label className="w-full relative justify-center flex text-gray-400">
                  <select
                    name="year"
                    value={credentials.year}
                    onChange={onChange}
                    className="w-full  border border-black p-3 rounded-lg "
                  >
                    <OptionNull value="Select Your Current Year"></OptionNull>
                    {year.map((value, i) => (
                      <option key={i} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <span
                    className={`absolute top-3 left-3 transition-all duration-200 ${
                      !credentials.year ||
                      credentials.year === "Select Your Current Year"
                        ? "input-text opacity-0"
                        : "input-fill"
                    } `}
                  >
                    Select Current Year
                  </span>
                </label>

                <button
                  disabled={disable() ? true : false}
                  onClick={secondNextHandle}
                  className={`p-3 rounded-lg border-none ${
                    disable() ? "bg-[#78A8EB]" : "bg-blue-500"
                  }`}
                >
                  Next
                </button>
              </>
            )}
            {page === 2 && (
              <>
                <span
                  onClick={() => setPage(1)}
                  className="font-bold m-0 contents text-black"
                >
                  Back
                </span>
                <h3 className="text-sm m-0 text-black">
                  OTP Send On Your Email
                </h3>
                <label className="w-full relative justify-center flex text-gray-400">
                  <input
                    type="number"
                    name="OTP"
                    value={OTP}
                    onChange={(e) => setOTP(e.target.value)}
                    className="w-full  border border-black p-3 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span
                    className={`absolute top-3 left-3 transition-all duration-200 ${
                      OTP === "" ? "input-text" : "input-fill"
                    } `}
                  >
                    OTP
                  </span>
                </label>
                <div className="text-center">
                  <p className="text-black">
                    Don't Get OTP ?{" "}
                    <a
                      href="#"
                      onClick={reSendOtp}
                      className="text-yellow-600 hover:underline"
                    >
                      Resend
                    </a>
                  </p>
                </div>
                <button
                  disabled={
                    OTP === null ||
                    OTP.toString().length < 4 ||
                    OTP.toString().length > 4
                      ? true
                      : false
                  }
                  onClick={submitHandler}
                  className={`p-3 rounded-lg border-none ${
                    OTP == null ||
                    OTP.toString().length < 4 ||
                    OTP.toString().length > 4
                      ? "bg-[#78A8EB]"
                      : "bg-blue-500"
                  }`}
                >
                  Next
                </button>
                {errors.otp && (
                  <p className="flex justify-center text-red-500 text-sm">
                    {errors.otp}
                  </p>
                )}
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Signin;
