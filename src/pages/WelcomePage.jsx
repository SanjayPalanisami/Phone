import React from 'react';
import Message from '../component/Message';
import Button from '../component/Button';
import details from '../Details';
import './WelcomePage.css'; // Ensure this file contains your CSS styles
import LogoutButton from "../component/LogoutButton";
const WelcomePage = () => {
  const { message, img1, img2, button: buttonText } = details.WelcomePage[0]; // Assuming img2 is added for hover effect.

  return (
    <div style={{ textAlign: 'center' }}>
      <LogoutButton />
      <Message msg={message} style={{ fontSize: '37px' }} />
      <div className="wel-image-container">
        <img src={img1} alt="Welcome Page" className="image base-image" />
        <img src={img2} alt="Hover Image" className="wel-image hover-image" />
      </div>
      <div style={{ marginTop: '-30px' }}>
        <Button bt={buttonText} to="/verification/user" />
      </div>
    </div>
  );
};

export default WelcomePage;