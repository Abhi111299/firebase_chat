// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // use Routes instead of Switch
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import './styles.css';

const App = () => {
  return (
    <Router>
      <Routes> {/* use Routes instead of Switch */}
        {/* Define routes for Login, Register, and Chat */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        
        {/* Default route to Login page */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
