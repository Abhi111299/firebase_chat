// src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import Axios

const Register = () => {
  const navigate = useNavigate();  // Changed history to navigate
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Send the registration request to the backend API
      const response = await axios.post('http://localhost:4000/register', {
        email,
        password,
      });
      console.log(response);

      // Assuming the backend returns a success message, redirect to chat
      if (response.status === 201) {
        navigate('/chat');  // Redirect to chat page after successful registration
      }
    } catch (error: any) { console.log("network error========>", error.response?.data?.message || error.message);
      // Handle the error from the API response
      setError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
