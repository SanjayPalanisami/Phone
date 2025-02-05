import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      navigate("/welcome"); // Redirect to home page if logged in
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      alert(response.data.message); // Show success message

      // Save user_id to localStorage
      localStorage.setItem("user_id", response.data.user_id);

      navigate("/welcome"); // Redirect to home page
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F12711] to-[#F5AF19] overflow-hidden ">
      <div className="hidden lg:block py-[140px] pl-20 pr-10 rounded-lg min-h-screen">
        <p className="text-white text-left text-[100px] font-bold">Welcome to Baby Nix</p>
      </div>

      <div className="lgn-container bg-white p-8 rounded-2xl shadow-lg w-[450px] lg:ml-auto lg:w-1/2 lg:h-screen lg:pt-[100px] lg:rounded-none">
        <form
          onSubmit={handleSubmit}
          className="lgn-form space-y-6 flex flex-col items-center"
        >
          <div>
            <p className="mail text-gray-700 font-medium">Email</p>
            <div className="input-wrapper mt-2 w-[380px]">
              <input
                type="email"
                placeholder="Email address"
                className="input-field w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <p className="password text-gray-700 font-medium">Password</p>
            <div className="input-wrapper mt-2 w-[380px]">
              <input
                type="password"
                placeholder="Password"
                className="input-field w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex justify-center w-full">
            <button
              type="submit"
              className="lgn-button w-[380px] py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:from-red-500 hover:to-orange-500 transition-all duration-200"
            >
              Log In
            </button>
          </div>
        </form>

        <a
          href="#"
          className="forgot-password text-orange-500 font-medium text-md hover:underline block text-center mt-2"
        >
          Forgot Password?
        </a>

        <p className="separator my-6 text-center text-gray-500">
          <span className="bg-white px-3">or</span>
        </p>

        <div className="google-lgn flex justify-center">
          <button className="google-button w-[380px] py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:from-red-500 hover:to-orange-500 transition-all duration-200">
            Sign in with Google
          </button>
        </div>

        <div className="create mt-6 text-center">
          <p className="create-acc text-gray-600">
            Don't have an account?{" "}
            <a href="/Signup" className="signup text-orange-500 font-medium hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
