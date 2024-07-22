// src/Home.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../utils/Firebase';

const Home = () => {
  const { user } = useAuth();
console.log(user)
  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div>
      <h1>Welcome</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
