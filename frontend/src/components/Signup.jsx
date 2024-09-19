import React, { useState } from "react";
import axios from "axios";
import background from "../assets/Back.jpg";
import { branches, collegeList, currentYear } from "@/Documents/Colleges";
import Button from "./Button";
import emailjs from "@emailjs/browser";
import debounce from "lodash/debounce";

const Signup = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    branch: "",
    college: "",
    year: "",
  });
  const [pages, setPages] = useState(0);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const title = ["User Info", "College Info"];

  // Debounced function to avoid frequent API calls
  const checkUsernameAvailability = debounce(async (value) => {
    try {
      console.log("checkUsernameAvailability");
      const res = await axios.post("http://localhost:8000/check-username", {
        value,
      });
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (res.data.isTaken) {
        if (emailPattern.test(value)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "Email is already registered",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: "Username is already taken",
          }));
        }
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "",
        }));
      }
    } catch (error) {
      console.error("Error checking username availability:", error);
    }
  }, 500); // Debounce by 500ms

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));

    // Validate input in real-time
    if (name === "username") {
      validateUsername(value);
    } else if (name === "email") {
      validateEmail(value);
    } else if (name === "password") {
      validatePassword(value);
    } else if (pages === 1) {
      // Validate college info if on page 1
      if (name === "branch") validateBranch(value);
      else if (name === "college") validateCollege(value);
      else if (name === "year") validateYear(value);
    }
  };

  const validateUsername = (username) => {
    if (!username) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: "Username is required",
      }));
    } else if (!/^[a-zA-Z0-9_.]+$/.test(username)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: "Username can contaion on a-z _ .",
      }));
      return false;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: "",
      }));
      // Trigger the username availability check
      checkUsernameAvailability(username);
    }
  };

  const validateEmail = (email) => {
    if (!email) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required",
      }));
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is not valid",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "",
      }));
      // Trigger the email availability check
      checkUsernameAvailability(email);
    }
  };

  const validatePassword = (password) => {
    if (!password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: password ? "" : "Password is required",
      }));
    } else if (!/^(?=.*[a-z])(?=.*[@#!$&*\(\)\[\]\{\}\\]){6,}/.test(password)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Passwords contain (a-zA-Z0-9,special characters)",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "",
      }));
    }
  };

  const validateBranch = (branch) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      branch: branch ? "" : "Branch is required",
    }));
  };

  const validateCollege = (college) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      college: college ? "" && "" : "College is required",
    }));
  };

  const validateYear = (year) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      year: year ? "" : "Year is required",
    }));
  };

  const handleNext = () => {
    console.log("Hello");
    if (pages === 0) {
      if (
        validateUserInfo() &&
        credentials.username !== "" &&
        credentials.password !== "" &&
        credentials.email !== ""
      ) {
        setPages(1); // Move to the next page if validation passes
      }
    } else if (pages === 1) {
      // For College Info Page Validation
      if (
        validateUsername(credentials.username) &&
        validateCollegeInfo() &&
        credentials.branch !== "" &&
        credentials.college !== "" &&
        credentials.year !== ""
      ) {
        console.log("called");
        handleLogin(); // Call handleLogin if all required fields are filled
      }
    }
  };

  const validateUserInfo = () => {
    validateUsername(credentials.username);
    validateEmail(credentials.email);
    validatePassword(credentials.password);

    return !Object.values(errors).some((error) => error); // return true if no errors
  };

  const validateCollegeInfo = () => {
    validateBranch(credentials.branch);
    validateCollege(credentials.college);
    validateYear(credentials.year);

    return !Object.values(errors).some((error) => error); // return true if no errors
  };

  const handleBack = () => {
    setPages(0); // Go back to the User Info page
    setErrors({}); // Clear errors when navigating back
  };

  const handleLogin = async () => {
    try {
      console.log(credentials);
      const res = await axios.post(
        "http://localhost:8000/register",
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-center">
      {/* Background image */}
      <img
        src={background}
        alt="background"
        className="w-full h-screen overflow-hidden object-cover z-[-2] absolute md:h-screen"
      />
      <div className="relative backdrop-blur-sm bg-white/40 p-8 rounded-lg shadow-lg w-[90vw] md:w-[50%] lg:w-[60vh] xl:w-[50vh] sm:w-[60vw]">
        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {/* Title */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-black">{title[pages]}</h2>
          </div>

          {/* Conditionally render based on the page */}
          {pages === 0 && (
            <>
              {/* Username Label and Input */}
              <div>
                <label className="block text-left text-black font-semibold mb-2">
                  Username <p className=" inline-block text-red-600">*</p>
                </label>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={onChangeHandler}
                  className="w-full p-2 border border-black rounded-lg focus:outline-none bg-transparent"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username}</p>
                )}
              </div>

              {/* Email Label and Input */}
              <div>
                <label className="block text-left text-black font-semibold mb-2">
                  Email <p className=" inline-block text-red-600">*</p>
                </label>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={onChangeHandler}
                  className="w-full p-2 border border-black rounded-lg focus:outline-none bg-transparent"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Password Label and Input */}
              <div className="relative">
                <label className="block text-left text-black font-semibold mb-2">
                  Password <p className=" inline-block text-red-600">*</p>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={onChangeHandler}
                  className="w-full p-2 border border-black rounded-lg focus:outline-none bg-transparent"
                />
                <h3
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0  flex items-center"
                >
                  {credentials.password == "ja" && showPassword ? (
                    <span
                      className={`text-black ${
                        errors.password ? "px-2 mt-4" : "px-2 mt-8"
                      }`}
                    >
                      Hide
                    </span>
                  ) : (
                    <span
                      className={`text-black ${
                        errors.password ? "px-2 mt-4" : "px-2 mt-8"
                      }`}
                    >
                      Show
                    </span>
                  )}
                </h3>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {/* Next Button */}
              <Button onClick={handleNext} buttonText="Next" />
            </>
          )}

          {pages === 1 && (
            <>
              {/* Back Button */}
              <h1
                className="block text-left text-black font-semibold mb-2 absolute top-0"
                onClick={handleBack}
                buttonText="Back"
              >
                Back
              </h1>

              {/* Branch Label and Input */}
              <div>
                <label className="block text-left text-black font-semibold mb-2">
                  Select Branch <p className=" inline-block text-red-600">*</p>
                </label>
                <select
                  name="branch"
                  value={credentials.branch}
                  onChange={onChangeHandler}
                  className="w-full p-2 border border-black rounded-lg focus:outline-none bg-transparent"
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch, index) => (
                    <option key={index} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
                {errors.branch && (
                  <p className="text-red-500 text-sm">{errors.branch}</p>
                )}
              </div>

              {/* College Label and Input */}
              <div>
                <label className="block text-left text-black font-semibold mb-2">
                  Select College <p className=" inline-block text-red-600">*</p>
                </label>
                <select
                  name="college"
                  value={credentials.college}
                  onChange={onChangeHandler}
                  className="w-full p-2 border border-black rounded-lg focus:outline-none bg-transparent"
                >
                  <option value="">Select College</option>
                  {collegeList.map((college, index) => (
                    <option key={index} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
                {errors.college && (
                  <p className="text-red-500 text-sm">{errors.college}</p>
                )}
              </div>

              {/* Year Label and Input */}
              <div>
                <label className="block text-left text-black font-semibold mb-2">
                  Select Your Year{" "}
                  <p className=" inline-block text-red-600">*</p>
                </label>
                <select
                  name="year"
                  value={credentials.year}
                  onChange={onChangeHandler}
                  className="w-full p-2 border border-black rounded-lg focus:outline-none bg-transparent"
                >
                  <option value="">Select Your Year</option>
                  {currentYear.map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.year && (
                  <p className="text-red-500 text-sm">{errors.year}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button onClick={handleNext} buttonText="Submit" />
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;