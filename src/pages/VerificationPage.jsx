import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserVerification from './UserVerification';
import BusinessVerify from './businessVerify';
import LocationPage from './locationverify';
import ProfileVerify from './ProfileVerify';

const VerificationPage = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="user" replace />} /> 
      <Route path="user" element={<UserVerification />} />
      <Route path="business" element={<BusinessVerify />} />
      <Route path="location" element={<LocationPage />} />
      <Route path="profile" element={<ProfileVerify />} />
    </Routes>
  );
};

export default VerificationPage;