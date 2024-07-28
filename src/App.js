// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import ProtectedRoute from './utils/ProtectedRoute';
import Question from './pages/Question';

function App() {
  return (
      <Router>
    <AuthProvider>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/home" />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/question/:id" element={<Question />} />
          </Route>
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
    </AuthProvider>
      </Router>
  );
}

export default App;
