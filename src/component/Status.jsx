import React from 'react';
import './Status.css';
import details from '../Details';

const StatusGrid = () => {
  const status = details.Status;

  return (
    <div className="status-grid-container">
      {Object.entries(status).map(([key, value], index) => (
        <div className="status-grid-item" key={index}>
          <div className="status-grid-key">{key}</div>
          <div className="status-grid-value">{value}</div>
        </div>
      ))}
    </div>
  );
};

export default StatusGrid;