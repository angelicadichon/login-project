import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    // Simulate no user logged in initially
    callback(null);
    return jest.fn(); // unsubscribe function
  }),
}));

// Mock Firebase app
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

// Mock Firebase firestore
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
}));

test('renders login system', async () => {
  render(<App />);
  
  // Wait for loading to complete and check for login/signup buttons
  await waitFor(() => {
    const loginButton = screen.getByText(/login/i);
    expect(loginButton).toBeInTheDocument();
  });
});

test('shows loading spinner initially', () => {
  render(<App />);
  
  const loadingElement = screen.getByText(/loading/i);
  expect(loadingElement).toBeInTheDocument();
});