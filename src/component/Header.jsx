import React from 'react';
import './Header.css'; 

const Header = ({ headerData }) => {
  return (
    <div className="header-container">
      {headerData.map((headerText, index) => (
        <div key={index} className="header-item">
          <h2 className="header-text">{headerText}</h2>
        </div>
      ))}
    </div>
  );
};

export default Header;