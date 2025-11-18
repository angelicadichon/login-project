import React from 'react';
import './Logo.css';

const Logo: React.FC = () => {
  return (
    <div className="logo-container">
      <div className="logo-icon">🔐</div>
      <h1 className="logo-text">SecureLogin</h1>
    </div>
  );
};

export default Logo;