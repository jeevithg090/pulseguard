import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to PulseGuard</h1>
      <div className="options-container">
        <button 
          className="option-button patient-button"
          onClick={() => navigate('/patient')}
        >
          Patient
        </button>
        <button 
          className="option-button hospital-button"
          onClick={() => navigate('/hospital')}
        >
          Hospital
        </button>
      </div>
    </div>
  );
};

export default HomePage; 