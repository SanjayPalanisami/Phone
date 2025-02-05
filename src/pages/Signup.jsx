import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // Initialize the navigate function

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      });

      if (response.ok) {
        setMessage("Signup successful! You can now log in.");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setUsername("");

        // Redirect to the login page after successful signup
        setTimeout(() => {
          navigate("/"); // Change this path to match your login route
        }, 2000); // Wait for 2 seconds before redirecting
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F12711] to-[#F5AF19] overflow-hidden ">
      <div className="hidden lg:block py-[140px] pl-20 pr-10 rounded-lg min-h-screen">
        <p className="text-white text-left text-[100px] font-bold">Create an account</p>
      </div>

      <div className="signin-cont bg-white p-8 rounded-2xl shadow-lg w-[450px] lg:ml-auto lg:w-1/2 lg:h-screen lg:pt-[100px] lg:rounded-none">
        <form onSubmit={handleSignup} className="signin-form space-y-6 flex flex-col items-center">
          <h2 className="form-title font-medium text-2xl">Sign Up</h2>

          {message && (
            <p
              className={`text-center mb-4 ${message.includes("successful") ? "text-green-600" : "text-red-600"}`}
            >
              {message}
            </p>
          )}

          <p className="username text-gray-700 font-medium w-[380px] text-left">Username</p>
          <div className="s-input mt-2 w-[380px]">
            <input
              type="text"
              placeholder="Username"
              className="sign-input w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <p className="s-mail text-gray-700 font-medium w-[380px] text-left">Email</p>
          <div className="s-input mt-2 w-[380px]">
            <input
              type="email"
              placeholder="Email address"
              className="sign-input w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <p className="s-password text-gray-700 font-medium w-[380px] text-left">Password</p>
          <div className="s-input mt-2 w-[380px]">
            <input
              type="password"
              placeholder="Password"
              className="sign-input w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <p className="s-password text-gray-700 font-medium w-[380px] text-left">Confirm Password</p>
          <div className="s-input mt-2 w-[380px]">
            <input
              type="password"
              placeholder="Confirm Password"
              className="sign-input w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="create-btn">
            <button
              type="submit"
              className="create-btn w-[380px] py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:from-red-500 hover:to-orange-500 transition-all duration-200"
            >
              Create Account
            </button>
          </div>
        </form>

        <div className="acc-sign mt-6 text-center">
          <p className="acc-signin text-gray-600">
            Already have an account?{" "}
            <a href="/" className="signin text-orange-500 font-medium hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
