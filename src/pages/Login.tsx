import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth, signInWithCustomToken } from '../firebaseConfig'; // Import the auth and signInWithCustomToken

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Send the login request to the backend API
      const response = await axios.post('http://localhost:4000/login', {
        email,
        password,
      });

      // Assuming the response contains the Firebase ID token
      const { token } = response.data; // Get the token from the backend response

      // Use Firebase to sign in with the custom token
      await signInWithCustomToken(auth, token);

      // Redirect to the chat page
      navigate('/chat');
      
      // Clear form after successful login
      setEmail('');
      setPassword('');
    } catch (error: any) {
      // Handle the error from the API response
      setError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div>{error}</div>}  {/* Display error message if there's one */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
