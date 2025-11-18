import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to Your Dashboard! 🎉</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      
      <div className="dashboard-content">
        <h2>Your Photos</h2>
        <div className="photos-grid">
          {/* Sample photos - you can replace with real images */}
          <div className="photo-card">
            <img src="https://via.placeholder.com/300x200/667eea/white?text=Photo+1" alt="Sample 1" />
            <p>Beautiful Landscape</p>
          </div>
          <div className="photo-card">
            <img src="https://via.placeholder.com/300x200/764ba2/white?text=Photo+2" alt="Sample 2" />
            <p>City View</p>
          </div>
          <div className="photo-card">
            <img src="https://via.placeholder.com/300x200/f093fb/white?text=Photo+3" alt="Sample 3" />
            <p>Nature Shot</p>
          </div>
          <div className="photo-card">
            <img src="https://via.placeholder.com/300x200/4facfe/white?text=Photo+4" alt="Sample 4" />
            <p>Sunset</p>
          </div>
          <div className="photo-card">
            <img src="https://via.placeholder.com/300x200/43e97b/white?text=Photo+5" alt="Sample 5" />
            <p>Mountain</p>
          </div>
          <div className="photo-card">
            <img src="https://via.placeholder.com/300x200/ff9a9e/white?text=Photo+6" alt="Sample 6" />
            <p>Beach</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;