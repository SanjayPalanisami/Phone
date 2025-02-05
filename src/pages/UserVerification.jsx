import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../component/Button';
import LogoutButton from '../component/LogoutButton';

function App() {
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [originalContactNumber, setOriginalContactNumber] = useState(''); // Store original phone number
  const [message, setMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [userStatus, setUserStatus] = useState(null);

  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    }
  }, [userId]);

  const fetchProfile = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/profile/${userId}`);
      if (response.status === 200 && response.data.profile) {
        const { profile, isNumberVerified, isProfileComplete } = response.data;
        setFullName(profile.full_name || '');
        setBusinessName(profile.business_name || '');
        setContactNumber(profile.contact_number || '');
        setOriginalContactNumber(profile.contact_number || ''); // Save original phone number
        setIsPhoneVerified(isNumberVerified);
        setIsProfileComplete(isProfileComplete);
        setUserStatus(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage('Your Profile is empty please fill the details');
    }
  };

  const handleSendOtp = async () => {
    if (!contactNumber) {
      setMessage('Please enter a valid contact number.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/send-otp', { phoneNumber: contactNumber });
      if (response.status === 200) {
        setOtpSent(true);
        setMessage('OTP sent successfully. Please check your phone.');
      }
    } catch (error) {
      setMessage('Error sending OTP.');
      console.error(error);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setMessage('Please enter the OTP.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/verify-otp', {
        phoneNumber: contactNumber,
        otp: otp,
        userId: userId,
      });

      if (response.status === 200) {
        setIsOtpVerified(true);
        setIsPhoneVerified(true);
        setMessage('OTP verified successfully. Phone number is verified.');
      }
    } catch (error) {
      setMessage('Error verifying OTP.');
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage('User is not logged in.');
      return;
    }

    // Check if phone number has changed
    const isPhoneNumberChanged = contactNumber !== originalContactNumber;

    // If phone number has changed and is not verified
    if (isPhoneNumberChanged && !isOtpVerified) {
      setMessage('Please verify your OTP before updating the phone number.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/profile', {
        user_id: userId,
        full_name: fullName,
        business_name: businessName,
        contact_number: contactNumber,
      });

      if (response.status === 200) {
        setMessage('Profile updated successfully!');
        fetchProfile(userId); // Fetch updated profile after successful update
        if (!isPhoneNumberChanged) {
          setIsOtpVerified(false); // Reset OTP verification for future phone number changes
        }
      }
    } catch (error) {
      setMessage('Error creating or updating profile.');
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Create or Update Profile</h1> <LogoutButton />
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Business Name:</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>
        <div>
          <label>Contact Number:</label>
          <input
            type="text"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            maxLength="15"
            required
          />
        </div>
        {contactNumber !== originalContactNumber && (
          <div>
            <button type="button" onClick={handleSendOtp} disabled={otpSent || isPhoneVerified}>
              {otpSent ? 'OTP Sent' : 'Send OTP'}
            </button>
            {otpSent && !isPhoneVerified && (
              <div>
                <label>Enter OTP:</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  required
                />
                <button type="button" onClick={handleVerifyOtp}>
                  Verify OTP
                </button>
              </div>
            )}
          </div>
        )}
    


    {contactNumber.length !== 13 ? (
  <p style={{ color: 'red' }}>Please enter a valid phone number.</p>
) : isPhoneVerified && contactNumber === originalContactNumber ? (
  <p style={{ color: 'green' }}>Phone number is verified.</p>
) :
<> <p style={{ color: 'Blue' }}>Phone number need to verify.</p></>}


        <button type="submit">Update</button>
        {userStatus && userStatus.isProfileComplete && (
          <Button bt="Next" to="/verification/business" />
        )}
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
