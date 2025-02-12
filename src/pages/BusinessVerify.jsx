import React, { useState, useEffect } from "react";
import Header from "../component/Header";
import Button from "../component/Button";
import details from "../Details";
import "./businessVerify.css";
import axios from "axios";

const BusinessVerify = () => {
  const [formData, setFormData] = useState({
    addressLine1: "",
    addressLine2: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    shopLicenseNumber: "",
    gstinNumber: "",
    gstinVerified:"",
    businessType: "",
  });

  const [userId, setUserId] = useState(null);
  const [gstinVerified, setGstinVerified] = useState(null);
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUserProfile(storedUserId);
    }
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`https://phone3.onrender.com/getUserProfile/${userId}`);
      const data = response.data;

      if (data) {
        setFormData({
          addressLine1: data.address_line1 || "",
          addressLine2: data.address_line2 || "",
          street: data.street || "",
          city: data.city || "",
          state: data.state || "",
          zip: data.zip || "",
          gstinVerified: data.gstin_verified || "",
          shopLicenseNumber: data.shop_license_number || "",
          gstinNumber: data.gstin || "",
          businessType: data.type_of_business || "",
        });
        setGstinVerified(data.gstin_verified); // Update GSTIN verification status
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    const requestData = { ...formData, user_id: userId };
    
    try {
      const response = await axios.post("https://phone3.onrender.com/verify", requestData);
      alert("Business verification submitted successfully!");
      setIsDataSubmitted(true); // Show the next button after successful submission
      setGstinVerified(response.data.gstinVerified); // Update GSTIN verification status from backend
    } catch (error) {
      console.error("Error submitting business verification:", error);
      alert("Submission failed!");
    }
  };

  return (
    <div className="business-verify-container">
      <Header headerData={details.HeaderVerify} />

      <form className="form-section" onSubmit={handleSubmit}>
        <label>
          Address line 1 <span>*</span>
        </label>
        <input
          type="text"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleChange}
          maxLength={100}
          placeholder="Enter your address"
          required
        />

        <label>Address line 2</label>
        <input
          type="text"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleChange}
          maxLength={100}
          placeholder="Enter additional address info"
        />

        <label>
          Street <span>*</span>
        </label>
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          maxLength={50}
          placeholder="Enter street name"
          required
        />

        <label>
          City <span>*</span>
        </label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          maxLength={50}
          placeholder="Enter city name"
          required
        />

        <label>
          State <span>*</span>
        </label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          maxLength={50}
          placeholder="Enter state name"
          required
        />

        <label>
          Zip <span>*</span>
        </label>
        <input
          type="number"
          name="zip"
          value={formData.zip}
          onChange={handleChange}
          maxLength={6}
          placeholder="Enter zip code"
          required
        />

        <label>
          GSTIN Number <span>*</span>
        </label>
        <input
          type="text"
          name="gstinNumber"
          value={formData.gstinNumber}
          onChange={handleChange}
          maxLength={15}
          placeholder="Enter GSTIN"
          required
        />

        <label>Type of business</label>
        <select name="businessType" value={formData.businessType} onChange={handleChange}>
          <option value="">Select business type</option>
          <option value="Mobile Sales">Mobile Sales</option>
          <option value="Repairs">Repairs</option>
          <option value="Accessories">Accessories</option>
          <option value="Multi-Service">Multi-Service</option>
        </select>

        <button type="submit">Submit</button>
      </form>

      {gstinVerified !== null && (
  <div className="gstin-status">
    {gstinVerified ? <p style={{ color: "green" }}>GSTIN is verified</p> : <p style={{ color: "red" }}>GSTIN needs to be verified</p>}
  </div>
)}

{formData.gstinNumber && formData.businessType && formData.gstinVerified !== null && (
  <Button bt="Next" to="/verification/location"/>
)}
    </div>
  );
};

export default BusinessVerify;
