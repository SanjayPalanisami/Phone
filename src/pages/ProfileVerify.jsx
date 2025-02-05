import React, { useState } from "react";
import details from "../Details";
import './ProfileVerify.css'; 
import Button from "../component/Button";
import Header from "../component/Header";

const ProfileVerify = () => {
  const { message1, message2, field, button: buttonText } = details.Approval[0];

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      <Header headerData={details.HeaderVerify} />
        <div className="profile-verify-container">
        <div className="prim-message-container">
          <p className="primary-message">{message1}</p>
        </div>

        <div className="approval-section-container">
          <div className="approval-section">
            <p className="secondary-message">{message2}</p>
            
            <div className="input-container">
              <input
                id="approval-input"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                maxLength={200}
                placeholder={`Enter your ${field}`}
              />
            </div>

            <div className="button-container">
              <Button bt={buttonText} to="main" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileVerify;