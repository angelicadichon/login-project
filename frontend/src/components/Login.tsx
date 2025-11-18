import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import './Auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First attempt to login with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('Login successful!');
      
      // Now that user is authenticated, we can safely access Firestore
      try {
        // Check if user exists in Firestore and reset failed attempts
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          await updateDoc(doc(db, 'users', userDoc.id), {
            failedLoginAttempts: 0,
            lastLogin: new Date()
          });
        }
      } catch (firestoreError) {
        console.log('Firestore update optional - user might not exist in users collection yet');
      }

    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle invalid credentials (wrong password)
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
        
        // Optional: You could create a separate admin function to handle failed attempts
        // that doesn't require user authentication
        console.log('Failed login attempt for:', email);
      } 
      // Handle user not found
      else if (error.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      }
      // Handle other errors
      else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login to Your Account</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="auth-button"
        >
          {loading ? (
            <>
              <div className="button-spinner"></div>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>

        <div className="auth-footer">
          <p>Don't have an account? <span onClick={() => window.location.reload()} style={{color: '#667eea', cursor: 'pointer', textDecoration: 'underline'}}>Sign up here</span></p>
        </div>
      </form>
    </div>
  );
};

export default Login;