import React from 'react';
import './Profile.css';
import details from '../Details'; 
import HomeHeader from '../component/HomeHeader';

const ProfilePage = () => {
  const { userDetails, BusinessDetails } = details.fakeProfile;

  return (
    <div>
      <HomeHeader />
      <div className="profile-container">
        <h1 className="profile-title">Profile Page</h1>
        <div className="section user-details-section">
          <h2 className="section-title">User Details</h2>
          <div className="profile-info user-details">
            <div className="profile-item"><strong>Full Name:</strong> {userDetails['Full Name']}</div>
            <div className="profile-item"><strong>Business Name:</strong> {userDetails['Business Name']}</div>
            <div className="profile-item"><strong>Contact Number:</strong> {userDetails['Contact Number']}</div>
            <div className="profile-item"><strong>Email Address:</strong> {userDetails['Email Address']}</div>
          </div>
        </div>

        <div className="section business-details-section">
          <h3 className="section-title">Shop Details</h3>
          <div className="profile-info business-details">
            <div className="profile-item"><strong>Address Line 1</strong> {BusinessDetails['Shop Address']['Address line 1']}</div>
            <div className="profile-item"><strong>Address Line 2</strong> {BusinessDetails['Shop Address']['Address line 2']}</div>
            <div className="profile-item"><strong>Street:</strong> {BusinessDetails['Shop Address']['Street']}</div>
            <div className="profile-item"><strong>City</strong> {BusinessDetails['Shop Address']['City']}</div>
            <div className="profile-item"><strong>State</strong> {BusinessDetails['Shop Address']['State']}</div>
            <div className="profile-item"><strong>Zip Code</strong> {BusinessDetails['Shop Address']['Zip']}</div>
            <div className="profile-item"><strong>License Number</strong> {BusinessDetails['Business Registration Number']['Shop License Number']}</div>
            <div className="profile-item"><strong>GSTIN Number</strong> {BusinessDetails['Business Registration Number']['GSTIN Number']}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;