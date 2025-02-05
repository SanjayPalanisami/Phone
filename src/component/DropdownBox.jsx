import React, { useState } from 'react';
import './DropdownBox.css';

const Dropdown = ({ label, options, onChange }) => {
  return (
    <div className="dropdown-container">
      <label className="dropdown-label">{label}</label>
      <select className="dropdown-select" onChange={onChange}>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;