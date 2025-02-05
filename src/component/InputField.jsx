import React from 'react';
import './InputField.css';

const InputField = ({ label, type, value, onChange, maxLength, required }) => {
  return (
    <div className="input-field-container">
      <label className="input-label">
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <input
        className="input-field"
        type={type}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={`Enter your ${label}`}
        required={required}
      />
    </div>
  );
};

export default InputField;