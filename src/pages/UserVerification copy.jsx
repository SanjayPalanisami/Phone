import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import details from '../Details';
import InputField from '../component/InputField';
import Header from '../component/Header';
import Button from '../component/Button';

const UserVerification = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // Step 1: Enter Phone Number, Step 2: Enter OTP
  const [error, setError] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false); // Track OTP verification
  const [userDetails, setUserDetails] = useState({}); // Store user details after OTP verification

  // Load stored user details from localStorage (if any)
  useEffect(() => {
    const storedDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (storedDetails) {
      setUserDetails(storedDetails);
      setPhoneNumber(storedDetails.phoneNumber || '');
    }
  }, []);

  const handleSendOtp = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message); // Notify the user that OTP is sent
        setStep(2); // Move to OTP verification step
      } else {
        setError(data.message); // Handle error
      }
    } catch (error) {
      setError("Error sending OTP: " + error.message);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message); // Notify the user about verification status
        setIsOtpVerified(true); // Mark OTP as verified
        setUserDetails((prevDetails) => ({
          ...prevDetails,
          phoneNumber,
          otp,
        })); // Store user details
        localStorage.setItem('userDetails', JSON.stringify({ ...userDetails, phoneNumber, otp })); // Persist to localStorage
        navigate('/verification/business'); // Redirect after successful OTP verification
      } else {
        setError(data.message); // Handle error
      }
    } catch (error) {
      setError("Error verifying OTP: " + error.message);
    }
  };

  return (
    <div>
      <Header headerData={details.HeaderVerify} />

      {details.userDetails.map((field, index) => (
        <div key={index}>
          <InputField
            label={field.label}
            type={field.type}
            maxLength={field.maxLength}
            required={field.required}
            value={userDetails[field.label] || ''} // Show persisted data
            onChange={(e) => {
              setUserDetails((prevDetails) => ({
                ...prevDetails,
                [field.label]: e.target.value,
              }));
            }}
          />
        </div>
      ))}

      {step === 1 && (
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
          />
          <button onClick={handleSendOtp}>Send OTP</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <label>Enter OTP:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP sent to your phone"
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginTop: '40px' }}>
        <Button bt="Next" to="/verification/business" disabled={!isOtpVerified} />
      </div>
    </div>
  );
};

export default UserVerification;
