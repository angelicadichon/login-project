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
      // First, check if user exists in Firestore and is not locked
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        
        // Check if account is locked due to too many failed attempts
        if (userData.failedLoginAttempts >= 3) {
          setError('Account temporarily locked due to multiple failed attempts. Check your email for instructions.');
          setLoading(false);
          return;
        }
      }

      // Attempt to login with Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      
      // Reset failed attempts on successful login
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'users', userDoc.id), {
          failedLoginAttempts: 0,
          lastLogin: new Date()
        });
      }

      console.log('Login successful!');
      // No need for alert - the auth state change will redirect to dashboard automatically

    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle invalid credentials (wrong password)
      if (error.code === 'auth/invalid-credential') {
        // Find user in Firestore to update failed attempts
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          const newAttempts = (userData.failedLoginAttempts || 0) + 1;
          
          // Update failed login attempts count
          await updateDoc(doc(db, 'users', userDoc.id), {
            failedLoginAttempts: newAttempts,
            lastFailedAttempt: new Date()
          });

          // Show appropriate error message
          if (newAttempts >= 3) {
            setError('Too many failed attempts. Account locked. Check your email for instructions.');
          } else {
            setError(`Invalid credentials. ${3 - newAttempts} attempts remaining.`);
          }
        } else {
          setError('Invalid email or password.');
        }
      } 
      // Handle user not found
      else if (error.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      }
      // Handle other errors
      else {
        setError(error.message);
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